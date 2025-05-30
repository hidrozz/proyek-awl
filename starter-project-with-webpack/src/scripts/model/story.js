import { BASE_URL } from '../config';

export async function getStories(token, withLocation = false) {
  try {
    const response = await fetch(`${BASE_URL}/stories?location=${withLocation ? 1 : 0}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'FETCH_STORIES_FAILED');
    return result;
  } catch (error) {
    throw new Error(error.message || 'FETCH_STORIES_FAILED');
  }
}

export async function getStoryDetail(id, token) {
  try {
    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'FETCH_DETAIL_FAILED');
    return result.story;
  } catch (error) {
    throw new Error(error.message || 'FETCH_DETAIL_FAILED');
  }
}

export async function postStory(formData, token) {
  try {
    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'POST_STORY_FAILED');
    return result;
  } catch (error) {
    throw new Error(error.message || 'POST_STORY_FAILED');
  }
}
