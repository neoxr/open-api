import { act as ACT, api as API } from '../lib/instance'
import { encrypt } from '../lib/utils'
// import { ActionContext } from 'vuex'

// type MyActionContext = ActionContext<State, any>

interface UserInfo {
   id: string
   username: string
   email: string
   // add any additional user properties here
}

interface State {
   token: string | null
   tokenExpiration: string | null
   tokenIssuedAt: string | null
   user_info: UserInfo | null
   error: string | null
}

interface Response {
   status: boolean
   msg: string
   data: any
}

export default {
   namespaced: true,
   state: (): State => ({
      token: localStorage.getItem('token') || null,
      tokenExpiration: localStorage.getItem('tokenExpiration') || null,
      tokenIssuedAt: localStorage.getItem('tokenIssuedAt') || null,
      user_info: localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info') as string) : null,
      error: null
   }),
   mutations: {
      setToken(state: State, token: string) {
         state.token = token
         localStorage.setItem('token', token)
      },
      setTokenExpiration(state: State, tokenExpiration: string) {
         state.tokenExpiration = tokenExpiration
         localStorage.setItem('tokenExpiration', tokenExpiration)
      },
      setTokenIssuedAt(state: State, tokenIssuedAt: string) {
         state.tokenIssuedAt = tokenIssuedAt
         localStorage.setItem('tokenIssuedAt', tokenIssuedAt)
      },
      clearToken(state: State) {
         localStorage.removeItem('token')
         localStorage.removeItem('tokenExpiration')
         localStorage.removeItem('tokenIssuedAt')
         state.token = null
         state.tokenExpiration = null
         state.tokenIssuedAt = null
      },
      loadToken(state: State) {
         state.token = localStorage.getItem('token') || null
         state.tokenExpiration = localStorage.getItem('tokenExpiration') || null
         state.tokenIssuedAt = localStorage.getItem('tokenIssuedAt') || null
      },
      setUserInfo(state: State, user_info: UserInfo) {
         state.user_info = user_info
         localStorage.setItem('user_info', JSON.stringify(user_info))
      },
      clearUserInfo(state: State) {
         state.user_info = null
         localStorage.removeItem('user_info')
      },
      setError(state: State, error: string) {
         state.error = error
      },
      clearError(state: State) {
         state.error = null
      }
   },
   actions: {
      initializeStore({ commit }) {
         commit('loadToken')
      },
      login: async ({ commit, dispatch }, { id, password }: { id: string, password: string }): Promise<boolean> => {
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
            commit('setError', null)
            return true
         } catch (e: any) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      },
      register: async ({ commit, dispatch }, { username, email, password }: { username: string, email: string, password: string }): Promise<boolean> => {
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
            commit('setError', null)
            return true
         } catch (e: any) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      },
      getUserInfo: async ({ commit }, { token }: { token: string }): Promise<boolean> => {
         commit('clearError')
         try {
            if (!token) return false
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
         } catch (e: any) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      },
      logout: async ({ commit }, { token }: { token: string }): Promise<boolean> => {
         commit('clearError')
         try {
            await ACT.post('/logout', null, {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            })
            commit('clearToken')
            commit('clearUserInfo')
            return true
         } catch (e: any) {
            const message = e.response?.data?.msg || e.response?.statusText || 'Unknown error'
            commit('setError', message)
            return false
         }
      }
   },
   getters: {
      error: (state: State) => state.error,
      data: (state: State) => {
         if (!state.token || !state.tokenExpiration || !state.tokenIssuedAt) return null
         return {
            token: state.token,
            tokenExpiration: state.tokenExpiration,
            tokenIssuedAt: state.tokenIssuedAt,
            user_info: state.user_info
         }
      },
      isTokenValid: (state: State) => state.tokenExpiration ? ((+new Date - +new Date(state.tokenIssuedAt)) < +new Date(state.tokenExpiration)) : false
   }
}