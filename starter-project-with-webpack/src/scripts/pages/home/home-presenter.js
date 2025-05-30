export class HomePresenter {
  constructor(getStoriesUseCase, view) {
    this.getStories = getStoriesUseCase;
    this.view = view;
    this.stories = [];
  }

  async loadStories(token) {
    try {
      this.view.showLoading();
      this.stories = await this.getStories(token);
      this.view.showStories(this.stories);
    } catch (error) {
      this.view.showError(error);
    }
  }
}
