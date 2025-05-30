import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HomePresenter } from './home-presenter';
import { getStories } from '../../model/story';

export class HomePage {
  #presenter = null;
  _map = null;

  render() {
    const token = localStorage.getItem('token');
    return `
      <section class="container">
        ${token ? '<a href="#/add" class="btn-add">➕ Tambah Cerita</a>' : ''}
        <h2>Daftar Cerita</h2>
        <input type="text" id="search-input" placeholder="Cari cerita..." style="margin-bottom: 16px; padding: 8px; width: 100%;" />
        <div id="map" style="height: 300px; margin-bottom: 16px;"></div>
        <ul id="story-list" class="story-list"></ul>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showError(new Error("Token tidak ditemukan. Silakan login ulang."));
      return;
    }

    this.#presenter = new HomePresenter(getStories, this);
    await this.#presenter.loadStories(token);

    document.getElementById('search-input').addEventListener('input', async (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = this.#presenter.stories.filter((story) =>
        story.name.toLowerCase().includes(keyword) ||
        story.description.toLowerCase().includes(keyword)
      );
      this.showStories(filtered);
    });
  }

  showLoading() {
    document.getElementById('story-list').innerHTML = '<p>Loading stories...</p>';
  }

  showStories(stories) {
    const list = document.getElementById('story-list');
    const mapContainer = document.getElementById('map');
    if (!list || !mapContainer) return;

    if (!this._map) {
      this._map = L.map(mapContainer).setView([-2.5489, 118.0149], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this._map);
    } else {
      this._map.eachLayer((layer) => {
        if (layer instanceof L.Marker) this._map.removeLayer(layer);
      });
    }

    list.innerHTML = '';
    stories.forEach((story) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" width="100" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
      `;
      list.appendChild(li);

      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this._map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }

  showError(error) {
    document.getElementById('story-list').innerHTML = `<p>Gagal memuat cerita: ${error.message}</p>`;
  }
}
