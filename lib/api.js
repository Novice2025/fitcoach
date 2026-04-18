// lib/api.js
const FALLBACK_API_BASE_URL = "http://localhost:5000";

const envApiBaseUrl =
  typeof globalThis !== 'undefined' &&
  globalThis.process &&
  globalThis.process.env &&
  globalThis.process.env.NEXT_PUBLIC_API_BASE_URL;

// Esta é a única linha correta para a definição de API_BASE_URL
export const API_BASE_URL = (envApiBaseUrl || FALLBACK_API_BASE_URL).replace(/\/$/, "");

export function getApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function requestJson(path, init = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    };

    const response = await fetch(getApiUrl(path), {
      ...init,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    let payload = null;
    if (contentType.includes("application/json")) {
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const message =
        payload && typeof payload.error === "string"
          ? payload.error
          : `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return payload;
  } catch (err) {
    // For network errors, return null instead of throwing
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      return null;
    }
    throw err;
  }
}

// Existing: Function to delete a student
export async function deleteStudent(id) {
  return requestJson(`/students/${id}`, {
    method: 'DELETE',
  });
}

// Existing: Function to update a student
export async function updateStudent(id, data) {
  return requestJson(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// New: Function to delete a workout
export async function deleteWorkout(id) {
  return requestJson(`/workouts/${id}`, {
    method: 'DELETE',
  });
}

// New: Function to update a workout
export async function updateWorkout(id, data) {
  return requestJson(`/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// New: Function to fetch all exercise categories
export async function fetchExerciseCategories() {
  return requestJson('/exercises/categories');
}

// New: Function to fetch exercises by category
export async function fetchExercisesByCategory(category) {
  return requestJson(`/exercises/${category}`);
}

// New: Function to add a custom exercise
export async function addCustomExercise(name, category) {
  return requestJson('/exercises', {
    method: 'POST',
    body: JSON.stringify({ name, category }),
  });
}