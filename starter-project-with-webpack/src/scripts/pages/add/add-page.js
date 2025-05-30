import { AddPresenter } from './add-presenter';
import { postStory } from '../../model/story';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export class AddPage {
  #presenter = null;
  #map = null;
  #marker = null;
  videoStream = null;

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
          <canvas id="canvas" style="display:none;"></canvas>
          <input type="file" id="photo" name="photo" accept="image/*" capture="environment" />

          <div id="map" style="height: 300px; margin: 16px 0;"></div>

          <button type="submit">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddPresenter(postStory, this);

    // Inisialisasi peta
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

    // Kamera
    const startButton = document.getElementById('start-camera');
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const fileInput = document.getElementById('photo');

    startButton.addEventListener('click', async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Browser tidak mendukung kamera. Gunakan HTTPS atau localhost.');
        return;
      }
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = this.videoStream;
        video.style.display = 'block';
        canvas.style.display = 'none';
        startButton.textContent = 'Ambil Gambar';

        startButton.addEventListener('click', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          canvas.toBlob((blob) => {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
          }, 'image/jpeg');
          video.style.display = 'none';
          canvas.style.display = 'block';
          this.videoStream.getTracks().forEach((track) => track.stop());
        }, { once: true });
      } catch (error) {
        alert('Tidak dapat mengakses kamera: ' + error.message);
      }
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
