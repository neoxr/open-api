import axios, { AxiosRequestConfig } from 'axios'

class Fetcher {
   async _get(url: string, options: AxiosRequestConfig = {}): Promise<any> {
      const result = await (await axios.get(url, options)).data
      return result
   }

   async _post(url: string, payload: any, options: AxiosRequestConfig = {}): Promise<any> {
      const result = await (await axios.post(url, payload, options)).data
      return result
   }

   async _direct(url: string, options: AxiosRequestConfig = {}): Promise<string> {
      const result = await (await axios.get(url, options)).request.res.responseUrl
      return result
   }
}

export default new Fetcher()