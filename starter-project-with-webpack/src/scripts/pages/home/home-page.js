import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HomePresenter } from './home-presenter';
import { getStories } from '../../model/story';
import { getAccessToken } from '../../utils/auth';

export class HomePage {
  #presenter = null;
  _map = null;
  _token = null;

  render() {
    return `
      <section class="container">
        <div>
          <a href="#/add" id="btn-add" class="btn-add" style="display: none;">➕ Tambah Cerita</a>
        </div>
        <div>
          <h2>Daftar Cerita</h2>
        </div>
        <input type="text" id="search-input" placeholder="Cari cerita..." style="margin-bottom: 16px; padding: 8px; width: 100%;" />
        <div id="map" style="height: 300px; margin-bottom: 16px;"></div>
        <ul id="story-list" class="story-list"></ul>
      </section>
    `;
  }

  async afterRender() {
    this._token = getAccessToken();
    if (!this._token) {
      this.showError(new Error('Token tidak ditemukan. Silakan login ulang.'));
      return;
    }

    document.getElementById('btn-add').style.display = 'inline-block';

    this.#presenter = new HomePresenter(getStories, this);
    await this.#presenter.loadStories(this._token);

    document.getElementById('search-input').addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = this.#presenter.filterStories(keyword);
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
    if (!stories.length) {
      list.innerHTML = '<p>Tidak ada cerita ditemukan.</p>';
      return;
    }

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
        const marker = L.marker([story.lat, story.lon], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        }).addTo(this._map);

        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }

  showError(error) {
    document.getElementById('story-list').innerHTML = `<p>Gagal memuat cerita: ${error.message}</p>`;
  }
}
