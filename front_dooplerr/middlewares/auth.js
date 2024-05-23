export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // Vérifie le token existant dans le local storage
    const existingToken = localStorage.getItem('token');
    const indicator = document.querySelector('#auth-indicator');
    console.log(existingToken);

    if (indicator) {
      indicator.style.backgroundColor = existingToken ? 'green' : 'red';
    }
    
    // Vérifie le token dans les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.location.href = '/';
    }
  }
});
