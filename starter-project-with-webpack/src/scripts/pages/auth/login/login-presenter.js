export class LoginPresenter {
  constructor(modelFn, view) {
    this.modelFn = modelFn;
    this.view = view;
  }

  async login(email, password) {
    try {
      this.view.showLoading();
      const { loginResult } = await this.modelFn(email, password);
      localStorage.setItem('token', loginResult.token);
      this.view.showSuccess(loginResult.name);
    } catch (error) {
      this.view.showError(error);
    }
  }
}
