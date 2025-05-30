import { LoginPage } from '../pages/auth/login/login-page';
import { RegisterPage } from '../pages/auth/register/register-page';
import { HomePage } from '../pages/home/home-page';
// import BookmarkPage from '../pages/bookmark/bookmark-page';
import { AddPage } from '../pages/add/add-page';
import { DetailPage } from '../pages/detail/detail-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

export const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/add': () => checkAuthenticatedRoute(new AddPage()),
  '/reports/:id': () => checkAuthenticatedRoute(new DetailPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
};
