import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {
    setCurrentUser: (state, data) => {
      // console.log('mutations setCurrentUser', data)
      Vue.set(state, 'currentUser', data)
    }
  },
  actions: {

  }
})
