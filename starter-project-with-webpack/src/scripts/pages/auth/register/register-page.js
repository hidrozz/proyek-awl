import { RegisterPresenter } from './register-presenter';
import { register } from '../../../model/auth';

export class RegisterPage {
  #presenter = null;

  render() {
    return `
      <section class="register-page">
        <h2>Daftar Akun</h2>
        <form id="register-form">
          <label for="name">Nama</label>
          <input type="text" id="name" name="name" required />
          
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
          
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="8" />
          
          <button type="submit">Daftar</button>
        </form>
        <p>Sudah punya akun? <a href="#/login">Login</a></p>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter(register, this);
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;
      await this.#presenter.register(name, email, password);
    });
  }

  showLoading() {
    alert('Mendaftarkan akun...');
  }

  showSuccess() {
    alert('Pendaftaran berhasil. Silakan login.');
    window.location.hash = '#/login';
  }

  showError(error) {
    alert(`Pendaftaran gagal: ${error.message}`);
  }
}
