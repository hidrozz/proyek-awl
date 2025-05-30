export class DetailPresenter {
  constructor(modelFn, view) {
    this.modelFn = modelFn;
    this.view = view;
  }

  async loadDetail(id, token) {
    try {
      const story = await this.modelFn(id, token); 
      this.view.showDetail(story);
    } catch (error) {
      this.view.showError(error);
    }
  }
}
