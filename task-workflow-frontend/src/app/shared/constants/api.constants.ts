export const API_BASE_URL = 'http://localhost:8080/api';

export const API_URLS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`
  },

   USERS: {
    ME: `${API_BASE_URL}/users/me`,
    ALL: `${API_BASE_URL}/users/all`,
    ALLUSERS: `${API_BASE_URL}/users/all-users`,
    REGISTER: `${API_BASE_URL}/users/register`,
    DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,
    MAKE_MANAGER: (id: number) => `${API_BASE_URL}/users/${id}/make-manager`,
    DEMOTE_MANAGER: (id: number) => `${API_BASE_URL}/users/${id}/demote-manager`
  },

  TASKS: {
    BASE: `${API_BASE_URL}/tasks`,
    ALL: `${API_BASE_URL}/tasks`,
    BY_ID: (id: number) => `${API_BASE_URL}/tasks/${id}`,
    CREATE: `${API_BASE_URL}/tasks`,
    UPDATE_STATUS: (id: number) => `${API_BASE_URL}/tasks/${id}/status`
  },

  DASHBOARD: {
    ADMIN: `${API_BASE_URL}/dashboard/admin`,
    MANAGER: `${API_BASE_URL}/dashboard/manager`,
    USER: `${API_BASE_URL}/dashboard/user`
  }
};
