import axios from "axios";

export const usePodcasts = () => {
  const config = useRuntimeConfig();
  const urlBase = `${config.public.BASE_URL}`;

  // Récupérer les podcasts
  async function getPodcasts() {
    try {
      const response = await axios.get(`${urlBase}/podcasts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      throw error;
    }
  }

  // Récupérer les épisodes d'un podcast
  async function getPodcastEpisodes(id: string) {
    try {
      const response = await axios.get(`${urlBase}/podcasts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching podcast episodes:", error);
      throw error;
    }
  }

  // Récupérer les podcasts d'un utilisateur
  async function getUserPodcasts(userId: string) {
    try {
      const response = await axios.get(`${urlBase}/users/${userId}/podcasts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user podcasts:", error);
      throw error;
    }
  }

  // Ajouter un podcast
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

  // Mettre à jour un podcast
  async function updatePodcast(id: string, formData: FormData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${urlBase}/admin/podcasts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating podcast:", error);
      throw error;
    }
  }

  // Supprimer un podcast
  async function deletePodcastById(id: string) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${urlBase}/admin/podcasts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting podcast:", error);
      throw error;
    }
  }

  return {
    getPodcasts,
    getPodcastEpisodes,
    getUserPodcasts,
    addPodcast,
    updatePodcast,
    deletePodcastById,
  };
};