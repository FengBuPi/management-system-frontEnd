import { AxiosRequestConfig } from 'axios';
// axios 二次封装
import axios, { AxiosInstance } from 'axios'
import singletonPattern from '@/utils/singletonPattern'
// 刷新token逻辑类
import TokenRefresher from './TokenRefresher';

class AxiosRequest {
  private axiosInstance: AxiosInstance
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api',
      timeout: 50000
    })
    this.init()
  }
  // 初始化
  private init() {
    this.interceptorsRequest()
    this.interceptorsResponse()
  }
  // 请求拦截器
  private interceptorsRequest() {
    this.axiosInstance.interceptors.request.use((config: any) => {
      // 在发送请求之前做些什么
      // 把token放到请求头里面
      const accessToken = localStorage.getItem("access_token")
      // 存在短token的同时,并且当前请求不是在使用刷新短token的网络方法
      // 如果是在使用刷新短token的网络方法,会导致'/auth/refresh'请求中的authorization被旧authorization覆盖
      if (accessToken && !TokenRefresher.isRefreshQequest(config.url)) {
        config.headers.authorization = 'Bearer ' + accessToken;
      }
      return config;
    }, function (error: any) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });
  }
  // 响应拦截器
  private interceptorsResponse() {
    this.axiosInstance.interceptors.response.use((response: any) => {
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      return response;
    }, async (error: any) => {
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      switch (error.response?.status) {
        case 400:
          // 错误处理
          console.log('错误请求');
          break;
        case 401:
          // 未授权,刷新token
          await TokenRefresher.refreshToken(error)
          console.log('当前未授权');
          // if (TokenRefresher.isRefreshQequest(error.config?.url))
          break;
        // return Promise.reject(error);//返回错误，下方自动因为错误会在发送一次请求
        case 403:
          // 访问被拒绝
          console.log('访问被拒绝');
          break;
        case 404:
          // 请求不存在
          console.log('请求资源不存在');
          break;
        case 500:
          // 服务器错误
          console.log('服务器错误');
          break;
        default:
          console.log('其他错误', error.response.data.message);
          return Promise.reject(error);
        // break;
      }
    });
  }

  request(axiosRequestConfig: AxiosRequestConfig): Promise<any> {
    // 如果正在发送刷新token的请求中,并且不是发送刷新token
    // 就拦截掉所有的请求，并存储在“后续请求暂存队列”中(不存储刷新token的请求)
    if (TokenRefresher.isRefreshing && !TokenRefresher.isRefreshQequest(axiosRequestConfig.url)) {
      return new Promise((resolve, reject) => {
        TokenRefresher.temporaryQueue.push(this.axiosInstance(axiosRequestConfig).then(resolve).catch(reject))// 最后会在promise.allSettled处执行
      })
    }
    // 对aixos实例的二次封装
    return this.axiosInstance(axiosRequestConfig).catch(() => {
      // 出现错误了,就重新发请求
      return this.request(axiosRequestConfig)
    })
  }
  async get(url: string, config: AxiosRequestConfig = {}): Promise<{ data: any, status: number }> {
    try {
      const { data, status } = await this.request({
        url,
        method: 'get',
        ...config
      });
      return { data, status };
    } catch (error) {
      throw error
    }
  }

  async post(url: string, body?: object, config?: AxiosRequestConfig): Promise<{ data: any, status: number }> {
    try {
      const { data, status } = await this.request({
        url,
        method: 'post',
        data: body,
        ...config
      });
      return { data, status };
    } catch (error) {
      throw error
    }
  }
  async put(url: string, body: object | FormData, config?: AxiosRequestConfig): Promise<any> {
    try {
      const { data, status } = await this.request({
        url,
        method: 'put',
        ...config
      });
      return { data, status };
    } catch (error) {
      throw error
    }
  }

  async del(url: string, config?: AxiosRequestConfig): Promise<any> {
    try {
      const { data, status } = await this.request({
        url,
        method: 'delete',
        ...config
      });
      return { data, status };
    } catch (error) {
      throw error
    }
  }
}
// 封装成单例
const AxiosReq = singletonPattern(AxiosRequest)
export default new AxiosReq