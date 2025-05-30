const BASE_URL = 'https://story-api.dicoding.dev/v1';

// Ambil semua story (dengan atau tanpa lokasi)
export async function getStories(token, withLocation = false) {
  const res = await fetch(`${BASE_URL}/stories?location=${withLocation ? 1 : 0}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('FETCH_STORIES_FAILED');
  return res.json();
}

// Ambil detail story berdasarkan ID
export async function getStoryDetail(id, token) {
  const res = await fetch(`${BASE_URL}/stories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('FETCH_STORY_DETAIL_FAILED');
  return res.json();
}

// Kirim story baru (deskripsi, foto, opsional lat/lon)
export async function postStory(formData, token) {
  const res = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error('POST_STORY_FAILED');
  return res.json();
}
