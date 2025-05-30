export class DetailPresenter {
  constructor(modelFn, view) {
    this.modelFn = modelFn;
    this.view = view;
  }

  async loadDetail(id, token) {
    try {
      const result = await this.modelFn(id, token);
      this.view.showDetail(result.story);
    } catch (error) {
      this.view.showError(error);
    }
  }
}
