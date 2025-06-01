import { getStoryDetail } from '../../model/story';
import { getActiveRoute } from '../../routes/url-parser';
import { DetailPresenter } from './detail-presenter';
import { getAccessToken } from '../../utils/auth';

export class DetailPage {
  #presenter = null;

  render() {
    return `
      <section class="container">
        <h2 id="story-title">Detail Story</h2>
        <div id="story-detail" aria-live="polite">Memuat...</div>
      </section>
    `;
  }

  async afterRender() {
    const { id } = getActiveRoute(true);
    const token = getAccessToken();

    if (!token) {
      this.showError(new Error("Token tidak ditemukan. Silakan login ulang."));
      return;
    }

    this.#presenter = new DetailPresenter(getStoryDetail, this);
    await this.#presenter.loadDetail(id, token);
  }

  showDetail(story) {
    const detail = document.getElementById('story-detail');
    detail.innerHTML = `
      <img src="${story.photoUrl}" alt="${story.name}" width="250" />
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <p><strong>Dibuat:</strong> ${new Date(story.createdAt).toLocaleString()}</p>
      <p><strong>Latitude:</strong> ${story.lat ?? '-'}</p>
      <p><strong>Longitude:</strong> ${story.lon ?? '-'}</p>
    `;
  }

  showError(error) {
    const container = document.getElementById('story-detail');
    container.innerHTML = `<p>Gagal memuat detail: ${error.message}</p>`;
  }
}
