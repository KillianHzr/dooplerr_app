export default defineNuxtRouteMiddleware((to, from, next) => {
  if (process.client) {
    // Check for token in local storage
    const existingToken = localStorage.getItem('token');
    const indicator = document.querySelector('#auth-indicator');

    if (indicator) {
      indicator.style.backgroundColor = existingToken ? 'green' : 'red';
    }
    
    // Check for token in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      window.location.href = '/';
    } else {
      next();
    }
  } else {
    next();
  }
});
