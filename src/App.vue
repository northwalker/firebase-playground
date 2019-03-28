<template>
  <div id="app">
    <v-app>
      <router-view/>
    </v-app>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
html, body {
  margin: 0;
  padding: 0;
}
#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-family: 'source-han-sans-traditional', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #ffffff;
}
</style>
