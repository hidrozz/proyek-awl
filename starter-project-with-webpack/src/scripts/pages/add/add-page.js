import { AddPresenter } from './add-presenter';
import { postStory } from '../../model/story';
import { getAccessToken } from '../../utils/auth';
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
          <button type="button" id="start-camera">Buka Kamera</button>
          <button type="button" id="stop-camera" style="display:none;">Tutup Kamera</button><br><br>
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
    const token = getAccessToken();
    if (!token) {
      alert('Token tidak ditemukan. Silakan login ulang.');
      location.hash = '/login';
      return;
    }

    this.#presenter = new AddPresenter(postStory, this);

    this.#setupMap();
    this.#setupCamera();
    this.#setupForm();
  }

  #setupMap() {
    this.#map = L.map('map').setView([-2.5489, 118.0149], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.#map);

    this.#map.on('click', (e) => {
      if (this.#marker) this.#map.removeLayer(this.#marker);

      this.#marker = L.marker(e.latlng, {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      }).addTo(this.#map).bindPopup('Lokasi dipilih').openPopup();

      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
    });
  }

  #setupCamera() {
    const startButton = document.getElementById('start-camera');
    const stopButton = document.getElementById('stop-camera');
    const video = document.getElementById('camera');

    startButton.addEventListener('click', async () => {
      if (!navigator.mediaDevices?.getUserMedia) return;

      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.videoStream;

      video.style.display = 'block';
      stopButton.style.display = 'inline-block';
      startButton.style.display = 'none';
    });

    stopButton.addEventListener('click', () => {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        this.videoStream = null;
      }

      video.srcObject = null;
      video.style.display = 'none';
      stopButton.style.display = 'none';
      startButton.style.display = 'inline-block';
    });
  }

  #setupForm() {
    const form = document.getElementById('add-form');
    const descInput = document.getElementById('description');
    const photoInput = document.getElementById('photo');
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const desc = descInput.value;
      let photoFile = photoInput.files[0];

      if (!photoFile && this.videoStream) {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        photoFile = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      }

      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        video.style.display = 'none';
        document.getElementById('stop-camera').style.display = 'none';
        document.getElementById('start-camera').style.display = 'inline-block';
        this.videoStream = null;
      }

      if (!photoFile) {
        alert('Mohon upload atau ambil gambar terlebih dahulu.');
        return;
      }

      await this.#presenter.sendStory({
        desc,
        photo: photoFile,
        lat: this.lat,
        lon: this.lon,
      });
    });
  }

  showLoading() {
    alert('Mengirim cerita...');
  }

  showSuccess() {
    alert('Cerita berhasil ditambahkan!');
    location.hash = '/';
  }

  showError(error) {
    alert('Gagal mengirim cerita: ' + error.message);
  }
}
