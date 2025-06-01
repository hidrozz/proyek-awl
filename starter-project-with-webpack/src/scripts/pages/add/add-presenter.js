import { getAccessToken } from '../../utils/auth';

export class AddPresenter {
  constructor(modelFn, view) {
    this.modelFn = modelFn;
    this.view = view;
  }

  async sendStory({ desc, photo, lat, lon }) {
    try {
      this.view.showLoading();

      const token = getAccessToken();
      if (!token) throw new Error('Token tidak ditemukan. Silakan login ulang.');

      const formData = new FormData();
      formData.append('description', desc);
      formData.append('photo', photo);

      if (lat && lon) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      await this.modelFn(formData, token);

      this.view.showSuccess();

      location.hash = '/';
    } catch (error) {
      this.view.showError(error);
    }
  }
}
