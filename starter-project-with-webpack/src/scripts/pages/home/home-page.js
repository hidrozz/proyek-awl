import { HomePresenter } from './home-presenter';
import { getStories } from '../../model/story';

export class HomePage {
  #presenter = null;

  render() {
    return `
      <section>
        <h2>Daftar Cerita</h2>
        <div id="map" style="height: 300px; margin-bottom: 16px;"></div>
        <ul id="story-list" class="story-list"></ul>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter(getStories, this);
    const token = localStorage.getItem('token');
    await this.#presenter.loadStories(token);
  }

  showLoading() {
    document.getElementById('story-list').innerHTML = '<p>Loading stories...</p>';
  }

  showStories(stories) {
    const list = document.getElementById('story-list');
    const map = L.map('map').setView([-2.5489, 118.0149], 4); // Center Indonesia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

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
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`).openPopup();
      }
    });
  }

  showError(error) {
    document.getElementById('story-list').innerHTML = `<p>Gagal memuat cerita: ${error.message}</p>`;
  }
}
