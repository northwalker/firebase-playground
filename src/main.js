import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import firebase from 'firebase/app'
import 'firebase/auth'

import Vuetify from 'vuetify'
Vue.use(Vuetify)

// Initialize Firebase
const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIM,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID
}
firebase.initializeApp(config)
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
//   .then(function() {
//     console.log('setPersistence done')
//   })
firebase.auth().onAuthStateChanged((user) => {
  console.log('Firebase onAuthStateChanged', user)
  if (user) {
    // User is signed in.
    const userObj = {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      providerId: user.providerId,
      providerData: user.providerData,
      refreshToken: user.refreshToken
    }
    store.commit('setCurrentUser', userObj)
    router.push('/welcome')
  } else {
    // No user is signed in.
    store.commit('setCurrentUser', undefined)
  }
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = await firebase.auth().currentUser
  console.log('beforeEach', requiresAuth, to.name, currentUser)
  if (currentUser) {
    console.log('currentUser')
    if (to.name === 'signin' || to.name === 'signup') {
      next('/welcome')
    } else {
      next()
    }
  } else {
    // Not logged
    if (requiresAuth) {
      next('/signin')
    } else {
      next()
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
