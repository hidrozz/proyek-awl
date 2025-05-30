export class RegisterPresenter {
  constructor(modelFn, view) {
    this.modelFn = modelFn;
    this.view = view;
  }

  async register(name, email, password) {
    try {
      this.view.showLoading();
      await this.modelFn(name, email, password);
      this.view.showSuccess();
    } catch (error) {
      this.view.showError(error);
    }
  }
}
