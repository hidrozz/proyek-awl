import { BASE_URL } from '../config';

export async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'LOGIN_FAILED');
    return result;
  } catch (error) {
    throw new Error(error.message || 'LOGIN_FAILED');
  }
}

export async function register(name, email, password) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'REGISTER_FAILED');
    return result;
  } catch (error) {
    throw new Error(error.message || 'REGISTER_FAILED');
  }
}
