import { AddPresenter } from './add-presenter';
import { postStory } from '../../model/story';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export class AddPage {
  #presenter = null;
  #map = null;
  #marker = null;
  videoStream = null;
  lat = null;
  lon = null;

  render() {
    return `
      <section>
        <h2>Tambah Cerita Baru</h2>
        <form id="add-form">
          <label for="description">Deskripsi</label>
          <textarea id="description" name="description" required></textarea>

          <label>Ambil Gambar</label>
          <button type="button" id="start-camera">Buka Kamera</button><br><br>
          <video id="camera" width="300" autoplay style="display:none;"></video>
          <canvas id="canvas" width="300" height="300" style="display:none;"></canvas>
          <input type="file" id="photo" name="photo" accept="image/*" capture="environment" />

          <div id="map" style="height: 300px; margin: 16px 0;"></div>

          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddPresenter(postStory, this);

   
    this.#map = L.map('map').setView([-2.5489, 118.0149], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.#map);

    this.#map.on('click', (e) => {
      if (this.#marker) this.#map.removeLayer(this.#marker);
      this.#marker = L.marker(e.latlng).addTo(this.#map);
      this.#marker.bindPopup('Lokasi dipilih').openPopup();
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
    });

    const startButton = document.getElementById('start-camera');
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const fileInput = document.getElementById('photo');
    const form = document.getElementById('add-form');

    startButton.addEventListener('click', async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      video.style.display = 'block';
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.videoStream;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const desc = document.getElementById('description').value;
      const token = localStorage.getItem('token');

      let photoFile = fileInput.files[0];

      
      if (!photoFile && this.videoStream) {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        photoFile = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      }

      
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        video.style.display = 'none';
        this.videoStream = null;
      }

      if (!photoFile) return alert('Mohon upload atau ambil gambar terlebih dahulu');

      await this.#presenter.sendStory({
        desc,
        photo: photoFile,
        lat: this.lat,
        lon: this.lon,
        token,
      });
    });
  }

  showLoading() {
    alert('Mengirim cerita...');
  }

  showSuccess() {
    alert('Cerita berhasil ditambahkan!');
    location.href = '#/';
  }

  showError(error) {
    alert('Gagal mengirim cerita: ' + error.message);
  }
}
