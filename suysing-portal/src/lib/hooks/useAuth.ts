// Authentication store using Zustand
import { create } from 'zustand';
import { authService } from '@/services/api';

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create Zustand store for authentication
export const useAuth = create<AuthState>((set) => {
  // Initialize state from localStorage if available
  const loadInitialState = () => {
    if (typeof window === 'undefined') {
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    }

    const storedAuth = localStorage.getItem('auth');
    if (!storedAuth) {
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    }

    try {
      const authData = JSON.parse(storedAuth);
      return {
        isAuthenticated: true,
        user: authData.user,
        token: authData.token
      };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    }
  };

  const initialState = loadInitialState();

  return {
    isAuthenticated: initialState.isAuthenticated,
    user: initialState.user,
    token: initialState.token,
    isLoading: false,
    error: null,
    
    // Login action
    login: async (username: string, password: string) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await authService.login(username, password);
        
        if (response.success) {
          // Store auth data in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth', JSON.stringify({
              token: response.data.access_token,
              user: response.user
            }));

            document.cookie = `auth=${localStorage.getItem("auth")}; path=/;`;
          }
          
          set({
            isAuthenticated: true,
            user: response.user,
            token: response.data.access_token,
            isLoading: false
          });
          
          return true;
        } else {
          set({
            isLoading: false,
            error: response.message || 'Login failed'
          });
          
          return false;
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        set({
          isLoading: false,
          error: 'An error occurred during login'
        });
        
        return false;
      }
    },
    
    // Logout action
    logout: async () => {
      try {
        await authService.logout();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        console.error('Logout error occurred');
      }
      
      set({
        isAuthenticated: false,
        user: null,
        token: null
      });
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
        localStorage.removeItem('is_force_logout');
        document.cookie = `auth=; path=/;`;
      }
    },


    clearDocumentCookie: async () => {
      if (typeof window !== 'undefined') {
        document.cookie = `auth=; path=/;`;
      }
    }


  };
});
