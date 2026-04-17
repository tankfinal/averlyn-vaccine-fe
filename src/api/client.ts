import axios from "axios";
import { supabase } from "../auth/supabaseClient";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

// Attach auth token to every request
apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

// Handle 401/403 — sign out and redirect
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
