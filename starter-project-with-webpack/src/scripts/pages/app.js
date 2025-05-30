import { getActiveRoute } from '../routes/url-parser';
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from '../templates';
import { setupSkipToContent, transitionHelper } from '../utils';
import { getAccessToken, getLogout } from '../utils/auth';
import { routes } from '../routes/routes';

export default class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  #skipLinkButton;

  constructor({ content, drawerNavigation, drawerButton, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#drawerNavigation.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove('open');
      }

      this.#drawerNavigation.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove('open');
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = document.getElementById('navlist-main');
    const navList = document.getElementById('navlist');

    if (!navListMain || !navList) {
      console.warn('Elemen navlist-main atau navlist tidak ditemukan');
      return;
    }

    if (!isLogin) {
      navListMain.innerHTML = '';
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navListMain.innerHTML = generateMainNavigationListTemplate();
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (confirm('Apakah Anda yakin ingin keluar?')) {
          getLogout();
          location.hash = '/login';
        }
      });
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    if (!route) {
      console.warn(`Route tidak ditemukan: ${url}`);
      this.#content.innerHTML = '<h2>404 - Halaman tidak ditemukan</h2>';
      return;
    }

    const page = route(); // akan hasilkan instance seperti new DetailPage()
    if (!page || typeof page.render !== 'function') {
      console.error('Halaman tidak valid:', page);
      this.#content.innerHTML = '<h2>Error saat memuat halaman.</h2>';
      return;
    }

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      },
    });

    try {
      if (transition.ready) await transition.ready;
    } catch (err) {
      console.warn('Transition not supported or failed:', err.message);
    }

    try {
      if (transition.updateCallbackDone) await transition.updateCallbackDone;
    } catch (err) {
      console.warn('Update callback failed:', err.message);
    }

    scrollTo({ top: 0, behavior: 'instant' });
    this.#setupNavigationList();
  }

}
