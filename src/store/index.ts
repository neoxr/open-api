import { createStore } from 'vuex'
import user from './user'
import website from './website'

export default createStore({
   modules: {
      user,
      website,
   }
})