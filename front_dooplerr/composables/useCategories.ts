import axios from "axios";

export const useCategories = () => {
  const config = useRuntimeConfig();
  const urlBase = `${config.public.BASE_URL}`;

  async function getCategories() {
    try {
      const response = await axios.get(`${urlBase}/categories`);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async function getCategoryPodcasts(categoryId: string) {
    try {
      const response = await axios.get(`${urlBase}/categories/${categoryId}/podcasts`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching podcasts for category ${categoryId}:`, error);
      throw error;
    }
  }

  return {
    getCategories,
    getCategoryPodcasts,
  };
};
