export class HomePresenter {
  constructor(getStoriesUseCase, view) {
    this.getStories = getStoriesUseCase;
    this.view = view;
    this.stories = [];
  }

  async loadStories(token) {
    try {
      this.view.showLoading();
      const result = await this.getStories(token);
      this.stories = result.listStory;
      this.view.showStories(this.stories);
    } catch (error) {
      this.view.showError(error);
    }
  }
}
