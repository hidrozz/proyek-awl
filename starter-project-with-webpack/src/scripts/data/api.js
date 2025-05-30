import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  ME: `${BASE_URL}/users/me`,
  STORIES: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  POST_STORY: `${BASE_URL}/stories`,
};


export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
  };
}


export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
  };
}


export async function getMyUserInfo() {
  const token = getAccessToken();

  const response = await fetch(ENDPOINTS.ME, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
  };
}


export async function getStories(token) {
  const response = await fetch(`${ENDPOINTS.STORIES}?location=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  return json;
}


export async function getStoryDetail(id, token) {
  const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();
  return json;
}


export async function postStory(formData, token) {
  const response = await fetch(ENDPOINTS.POST_STORY, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();
  return {
    ...json,
    ok: response.ok,
  };
}
