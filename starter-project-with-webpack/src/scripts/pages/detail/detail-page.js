import { DetailPresenter } from './detail-presenter';
import { getStoryDetail } from '../../model/story';
// import { postStory } from '../../model/story';
// import { getStoryDetail } from '../../model/story';
import { parsePathname } from '../../routes/url-parser';
const { id } = parsePathname(window.location.hash);


export class DetailPage {
  #presenter = null;

  render() {
    return `
      <section id="detail-story">
        <h2>Detail Cerita</h2>
        <div id="story-container">Memuat...</div>
        <div id="map" style="height: 300px; margin-top: 16px;"></div>
      </section>
    `;
  }

  async afterRender() {
    const { id } = UrlParser.parseActiveUrlWithoutCombiner();
    const token = localStorage.getItem('token');
    this.#presenter = new DetailPresenter(getStoryDetail, this);
    await this.#presenter.loadDetail(id, token);
  }

  showDetail(story) {
    const container = document.getElementById('story-container');
    container.innerHTML = `
      <img src="${story.photoUrl}" alt="${story.name}" width="200"/>
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
    `;

    if (story.lat && story.lon) {
      const map = L.map('map').setView([story.lat, story.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const marker = L.marker([story.lat, story.lon]).addTo(map);
      marker.bindPopup(`<b>${story.name}</b>`).openPopup();
    }
  }

  showError(error) {
    document.getElementById('story-container').innerHTML = `<p>Gagal memuat detail: ${error.message}</p>`;
  }
}
