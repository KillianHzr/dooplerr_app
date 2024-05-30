import axios from "axios";

export const usePodcasts = () => {
  const config = useRuntimeConfig();
  const urlBase = `${config.public.BASE_URL}`;

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

  async function getUserPodcasts(userId: string) {
    try {
      const response = await axios.get(`${urlBase}/users/${userId}/podcasts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user podcasts:", error);
      throw error;
    }
  }

  async function addPodcast(formData: FormData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${urlBase}/admin/podcasts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding podcast:", error);
      throw error;
    }
  }

  return {
    getPodcasts,
    getPodcastEpisodes,
    getUserPodcasts,
    addPodcast,
  };
};