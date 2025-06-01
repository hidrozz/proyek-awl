import { BASE_URL } from '../config';

function validateToken(token) {
  if (!token || token === 'null' || token === 'undefined') {
    throw new Error('Token tidak valid. Silakan login ulang.');
  }
}


export async function getStories(token, withLocation = false) {
  try {
    validateToken(token);

    const response = await fetch(`${BASE_URL}/stories?location=${withLocation ? 1 : 0}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengambil daftar cerita.');
    return result;
  } catch (error) {
    throw new Error(error.message || 'FETCH_STORIES_FAILED');
  }
}


export async function getStoryDetail(id, token) {
  try {
    validateToken(token);

    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengambil detail cerita.');
    return result.story;
  } catch (error) {
    throw new Error(error.message || 'FETCH_DETAIL_FAILED');
  }
}


export async function postStory(formData, token) {
  try {
    validateToken(token);

    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal menambahkan cerita.');
    return result;
  } catch (error) {
    throw new Error(error.message || 'POST_STORY_FAILED');
  }
}
