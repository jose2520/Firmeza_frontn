const TOKEN_KEY = 'firmeza_auth_token';
const USER_KEY = 'firmeza_user_data';

export interface UserSession {
  id: string | number;
  email: string;
  name?: string;
  role?: string;
}

export const tokenStorage = {
  /**
   * Obtiene el token JWT almacenado.
   */
  async getToken(): Promise<string | null> {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    } catch (error) {
      console.warn('Error reading token from localStorage:', error);
      return null;
    }
  },

  /**
   * Guarda el token JWT de forma segura.
   */
  async setToken(token: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error saving token to localStorage:', error);
    }
  },

  /**
   * Elimina el token JWT (cierre de sesión).
   */
  async removeToken(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  },

  /**
   * Guarda los datos del usuario en sesión.
   */
  async setUser(user: UserSession): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  },

  /**
   * Obtiene los datos del usuario en sesión.
   */
  async getUser(): Promise<UserSession | null> {
    try {
      if (typeof window === 'undefined') return null;
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Error reading user data from localStorage:', error);
      return null;
    }
  },

  /**
   * Elimina los datos del usuario.
   */
  async removeUser(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY);
      }
    } catch (error) {
      console.error('Error removing user data from localStorage:', error);
    }
  },

  /**
   * Limpia toda la sesión (token y usuario).
   */
  async clearSession(): Promise<void> {
    await Promise.all([this.removeToken(), this.removeUser()]);
  },
};

export default tokenStorage;
