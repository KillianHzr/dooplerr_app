import axios from 'axios';

export const useEpisodes = () => {
  const config = useRuntimeConfig();
  const urlBase = "http://127.0.0.1:3306";

  async function getEpisodes() {
    try {
      const response = await axios.get(`${urlBase}/episodes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching episodes:", error);
      throw error; // Renvoyer l'erreur pour gérer les erreurs dans le composant appelant
    }
  }

  async function getEpisodeById(id: string) {
    try {
      const response = await axios.get(`${urlBase}/episodes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching episode by id:", error);
      throw error;
    }
  }

  return {
    getEpisodes,
    getEpisodeById,
  };
};
