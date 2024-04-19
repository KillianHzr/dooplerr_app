import axios from "axios";

export const usePodcasts = () => {
  const config = useRuntimeConfig();
  const urlBase = "http://127.0.0.1:3306";

  async function getPodcasts() {
    try {
      const response = await axios.get(`${urlBase}/podcasts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      throw error;
    }
  }

  async function getPodcastEpisodes(id: string) {
    try {
      const response = await axios.get(`${urlBase}/podcasts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching podcast episodes:", error);
      throw error;
    }
  }

  return {
    getPodcasts,
    getPodcastEpisodes,
  };
};
