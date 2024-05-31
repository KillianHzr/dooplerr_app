import axios from 'axios';

export const useEpisodes = () => {
  const config = useRuntimeConfig();
  const urlBase = `${config.public.BASE_URL}`;

  async function getEpisodes() {
    try {
      const response = await axios.get(`${urlBase}/episodes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching episodes:", error);
      throw error;
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

  async function getPodcastById(id: string) {
    try {
      const response = await axios.get(`${urlBase}/podcasts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching podcast by id:", error);
      throw error;
    }
  }

  async function addEpisode(formData: FormData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${urlBase}/admin/episodes`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding episode:", error);
      throw error;
    }
  }

  return {
    getEpisodes,
    getEpisodeById,
    getPodcastById,
    addEpisode,
  };
};
