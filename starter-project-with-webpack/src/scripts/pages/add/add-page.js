import { AddPresenter } from './add-presenter';
import { postStory } from '../../model/story';

export class AddPage {
  #presenter = null;
  #map = null;
  #marker = null;

  render() {
    return `
      <section>
        <h2>Tambah Cerita Baru</h2>
        <form id="add-form">
          <label for="description">Deskripsi</label>
          <textarea id="description" name="description" required></textarea>

          <label for="photo">Ambil Gambar</label>
          <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required />

          <div id="map" style="height: 300px; margin: 16px 0;"></div>

          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddPresenter(postStory, this);

    const map = L.map('map').setView([-2.5489, 118.0149], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    this.#map = map;

    map.on('click', (e) => {
      if (this.#marker) this.#map.removeLayer(this.#marker);
      this.#marker = L.marker(e.latlng).addTo(this.#map);
      this.#marker.bindPopup(`Lokasi dipilih`).openPopup();
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
    });

    document.getElementById('add-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const desc = document.getElementById('description').value;
      const photo = document.getElementById('photo').files[0];
      const token = localStorage.getItem('token');
      await this.#presenter.sendStory({ desc, photo, lat: this.lat, lon: this.lon, token });
    });
  }

  showLoading() {
    alert('Mengirim cerita...');
  }

  showSuccess() {
    alert('Cerita berhasil ditambahkan!');
    window.location.hash = '#/';
  }

  showError(error) {
    alert(`Gagal mengirim cerita: ${error.message}`);
  }
}
