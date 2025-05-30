export class HomePresenter {
  constructor(modelFn, view) {
    this.modelFn = modelFn;
    this.view = view;
  }

  async loadStories(token) {
    try {
      this.view.showLoading();
      const result = await this.modelFn(token, true);
      this.view.showStories(result.listStory);
    } catch (error) {
      this.view.showError(error);
    }
  }
}
