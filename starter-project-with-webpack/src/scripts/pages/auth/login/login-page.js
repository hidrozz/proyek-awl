import { LoginPresenter } from './login-presenter';
import { login } from '../../../model/auth';

export class LoginPage {
  #presenter = null;

  render() {
    return `
      <section class="login-page">
        <h2>Masuk ke Akun</h2>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" autocomplete="email" required />
          <label for="password">Password</label>
          <input type="password" id="password" name="password" autocomplete="current-password" required />
          
          <button type="submit">Login</button>
        </form>
        <p>Belum punya akun? <a href="#/register">Daftar</a></p>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter(login, this);
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;
      await this.#presenter.login(email, password);
    });
  }

  showLoading() {
    alert('Sedang masuk...');
  }

  showSuccess(name) {
    alert(`Selamat datang, ${name}`);
    window.location.hash = '#/';
  }

  showError(error) {
    alert(`Login gagal: ${error.message}`);
  }
}
