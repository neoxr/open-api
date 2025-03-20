import { api as API } from '../instance'

export default {
   namespaced: true,
   state: () => ({
      stats: {},
      setting: {
         name: 'Open API',
         description: 'Simplify your processes with our API. Designed for developers and businesses.',
         logo: 'URL_ADDRESS'
      },
      faq: localStorage.getItem('faq') ? JSON.parse(localStorage.getItem('faq')) : null,
      collections: null,
      changelogs: null,
      error: null
   }),
   mutations: {
      setData(state, data) {
         state.stats = data
      },
      clearData(state) {
         state.stats = {}
      },
      setError(state, error) {
         state.error = error
      },
      clearError(state) {
         state.error = null
      },
      setCollection(state, data) {
         state.collections = data
      },
      setChangelog(state, data) {
         state.changelogs = data
      }
   },
   actions: {
      stats: async ({ commit }) => {
         commit('clearData')
         const response = await API.get('/latest')
         commit('setData', response.data)
      },
      collections: async ({ commit, state }) => {
         commit('clearError')
         try {
            if (!state.collections) {
               const json = await (await API.get('/collections')).data
               if (!json.status) {
                  commit('setError', json.msg)
                  return false
               }
               commit('setCollection', json?.data)
            }
         } catch (e) {
            commit('setError', e.message)
         }
      },
      faqs: async ({ commit, state }) => {
         commit('clearError')
         try {
            if (!state.faq) {
               const json = await (await API.get('/faq')).data
               if (!json.status) {
                  commit('setError', json.msg)
                  return false
               }
               state.faq = json.data
               localStorage.setItem('faq', JSON.stringify(json.data))
            }
         } catch (e) {
            commit('setError', e.message)
         }
      },
      changelogs: async ({ commit, state }) => {
         commit('clearError')
         try {
            if (!state.changelogs) {
               const json = await (await API.get('/changelogs')).data
               if (!json.status) {
                  commit('setError', json.msg)
                  return false
               }
               commit('setChangelog', json?.data)
            }
         } catch (e) {
            commit('setError', e.message)
         }
      }
   },
   getters: {
      stats: state => state.stats,
      collections: state => state.collections,
      faq: state => state.faq,
      changelogs: state => state.changelogs,
      setting: state => state.setting,
      error: state => state.error
   }
}