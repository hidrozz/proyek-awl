import { getStoryDetail } from '../../model/story';
import { getActiveRoute } from '../../routes/url-parser';

export class DetailPage {
  #story = null;

  async render() {
    return `
      <section class="container">
        <h2 id="story-title">Detail Story</h2>
        <div id="story-detail">Memuat...</div>
      </section>
    `;
  }

  async afterRender() {
    const { id } = getActiveRoute(true);
    try {
      this.#story = await getStoryDetail(id, localStorage.getItem('token'));
      this.#showDetail(this.#story);
    } catch (error) {
      document.getElementById('story-detail').innerHTML = `<p>Gagal memuat detail: ${error.message}</p>`;
    }
  }

  #showDetail(story) {
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
}
