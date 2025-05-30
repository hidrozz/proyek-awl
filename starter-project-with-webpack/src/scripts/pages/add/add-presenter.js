export class AddPresenter {
  constructor(modelFn, view) {
    this.modelFn = modelFn;
    this.view = view;
  }

  async sendStory({ desc, photo, lat, lon, token }) {
    try {
      this.view.showLoading();
      const formData = new FormData();
      formData.append('description', desc);
      formData.append('photo', photo);
      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }
      await this.modelFn(formData, token);
      this.view.showSuccess();
    } catch (error) {
      this.view.showError(error);
    }
  }
}
