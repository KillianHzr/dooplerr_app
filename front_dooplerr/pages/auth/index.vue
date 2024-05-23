<template>
    <div class="main-auth-page text-white">
      <h1>Welcome</h1>
      <div>
        <nuxt-link to="/auth/login">
          <button>Login</button>
        </nuxt-link>
        <nuxt-link to="/auth/register">
          <button>Register</button>
        </nuxt-link>
        <button @click="loginWithGoogle" class="google-login">Login with Google</button>
      </div>
    </div>
  </template>
  
  <script setup>
  const config = useRuntimeConfig();
  const urlBase = `${config.public.BASE_URL}`;
  
  const loginWithGoogle = () => {
    window.location.href = `${urlBase}/auth/google`;
  };
  </script>
  
  <style scoped>
  .main-auth-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  .google-login {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #db4437;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .google-login:hover {
    background-color: #c23321;
  }
  button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #ccc;
  }
  </style>
  