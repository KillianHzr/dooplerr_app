import axios from "axios";

export const useComments = () => {
  const config = useRuntimeConfig();
  const urlBase = `${config.public.BASE_URL}`;

  // Ajouter un commentaire à un épisode
  async function addComment(episodeId: number, text: string) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${urlBase}/episodes/${episodeId}/comments`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }

  return { addComment };
};
