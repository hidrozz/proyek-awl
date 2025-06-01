import { putAccessToken } from '../../../utils/auth';

export class LoginPresenter {
  constructor(modelFn, view) {
    this.modelFn = modelFn;
    this.view = view;
  }

  async login(email, password) {
    try {
      this.view.showLoading();

      const response = await this.modelFn(email, password);

      const token = response?.loginResult?.token;
      const name = response?.loginResult?.name;

      if (!token) {
        throw new Error('Login gagal: token tidak ditemukan.');
      }

      putAccessToken(token);

      this.view.showSuccess(name);
      location.hash = '/';
    } catch (error) {
      this.view.showError(error);
    }
  }
}
