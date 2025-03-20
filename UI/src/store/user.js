import { act as ACT, api as API } from '../instance'
import { encrypt } from '../utils'
import Cookies from 'js-cookie'

export default {
   namespaced: true,
   state: () => ({
      token: localStorage.getItem('token') || null,
      tokenExpiration: localStorage.getItem('tokenExpiration') || null,
      tokenIssuedAt: localStorage.getItem('tokenIssuedAt') || null,
      user_info: localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info')) : null,
      error: null
   }),
   mutations: {
      setToken(state, token) {
         state.token = token
         localStorage.setItem('token', token)
      },
      setTokenExpiration(state, tokenExpiration) {
         state.tokenExpiration = tokenExpiration
         localStorage.setItem('tokenExpiration', tokenExpiration)
      },
      setTokenIssuedAt(state, tokenIssuedAt) {
         state.tokenIssuedAt = tokenIssuedAt
         localStorage.setItem('tokenIssuedAt', tokenIssuedAt)
      },
      clearToken(state) {
         localStorage.removeItem('token')
         localStorage.removeItem('tokenExpiration')
         localStorage.removeItem('tokenIssuedAt')
         state.token = null
         state.tokenExpiration = null
         state.tokenIssuedAt = null
      },
      loadToken(state) {
         state.token = localStorage.getItem('token') || null
         state.tokenExpiration = localStorage.getItem('tokenExpiration') || null
         state.tokenIssuedAt = localStorage.getItem('tokenIssuedAt') || null
      },
      setUserInfo(state, user_info) {
         state.user_info = user_info
         localStorage.setItem('user_info', JSON.stringify(user_info))
      },
      clearUserInfo(state) {
         state.user_info = null
         localStorage.removeItem('user_info')
      },
      setError(state, error) {
         state.error = error
      },
      clearError(state) {
         state.error = null
      }
   },
   actions: {
      initializeStore({ commit }) {
         commit('loadToken')
      },
      login: async ({ commit, dispatch }, { id, password }) => {
         commit('clearError')
         try {
            const response = await (await ACT.post('/login', { id, password }, {
               headers: {
                  'x-neoxr-token': encrypt(id + '.' + password)
               },
               withCredentials: true
            })).data
            if (!response.status) {
               commit('setError', response.msg)
               return false
            }
            commit('setToken', response.data.token)
            commit('setTokenExpiration', response.data.expired_at)
            commit('setTokenIssuedAt', response.data.created_at)
            await dispatch('getUserInfo', response.data.token)
            commit('setError', null) // clear error if login is successful
            return true
         } catch (e) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      },
      register: async ({ commit, dispatch }, { username, email, password }) => {
         commit('clearError')
         try {
            const response = await (await ACT.post('/register', { username, email, password }, {
               withCredentials: true,
               headers: {
                  'x-neoxr-token': encrypt(username + '.' + email + '.' + password)
               }
            })).data
            if (!response.status) {
               commit('setError', response.msg)
               return false
            }
            commit('setError', null) // clear error if register is successful
            return true
         } catch (e) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      },
      changePass: async ({ commit, dispatch }, { oldpass, newpass, confirmpass, token }) => {
         commit('clearError')
         try {
            const response = await (await ACT.post('/change-password', { oldpass, newpass, confirmpass, token }, {
               headers: {
                  'Authorization': `Bearer ${token}`,
                  'x-neoxr-token': encrypt(oldpass + '.' + newpass + '.' + confirmpass)
               }
            })).data
            if (!response.status) {
               commit('setError', response.msg)
               return false
            }
            commit('setToken', response.data.token)
            commit('setTokenExpiration', response.data.tokenExpiration)
            commit('setTokenIssuedAt', Date.now())
            await dispatch('getUserInfo', response.data.token)
            commit('setError', null) // clear error if register is successful
            return true
         } catch (e) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      },
      getUserInfo: async ({ commit }, { token }) => {
         commit('clearError')
         try {
            if (!token) return
            const response = await (await API.get('/user_info', {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            })).data
            if (!response.status) {
               commit('setError', response.msg)
               return false
            }
            commit('setUserInfo', response.data)
            return true
         } catch (e) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      },
      logout: async ({ commit }, { token }) => {
         commit('clearError')
         try {
            ACT.post('/logout', null, {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            })
            Cookies.remove('token')
            commit('clearInvoice')
            commit('clearToken')
            commit('clearUserInfo')
            return true
         } catch (e) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      }
   },
   getters: {
      error: state => state.error,
      data: state => {
         if (!state.token || !state.tokenExpiration || !state.tokenIssuedAt) return null
         return {
            token: state.token,
            tokenExpiration: state.tokenExpiration,
            tokenIssuedAt: state.tokenIssuedAt,
            user_info: state.user_info
         }
      },
      isTokenValid: state => state.tokenExpiration ? ((+new Date - state.tokenIssuedAt) < state.tokenExpiration) : false
   }
}