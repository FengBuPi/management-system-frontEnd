import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import singletonPattern from '@/utils/singletonPattern'
import RefresherAxiosRequest from './RefresherAxiosRequest';

type BaseResponse<T> = {
  data: T,
  status: string
}

class AxiosRequest {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api',
      timeout: 50000
    })
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  // 请求拦截器
  private interceptorsRequest() {
    this.axiosInstance.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem("access_token")
      config.headers.authorization = 'Bearer ' + accessToken;
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
  }

  // 响应拦截器
  private interceptorsResponse() {
    this.axiosInstance.interceptors.response.use((response) => {
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      return response;
    }, async (error) => {
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      switch (error.response?.status) {
        case 400:
          // 错误处理
          console.log('错误请求');
          break;
        case 401:
          // 未授权,刷新token
          // 必须await,阻塞当前请求再在刷新完后重发请求
          if (await RefresherAxiosRequest.refresh('/auth/refresh')) return Promise.reject(error); // 刷新完成才可重发请求
          break;
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
          break;
      }
    });
  }

  async request<T>(axiosRequestConfig: AxiosRequestConfig): Promise<BaseResponse<T>> {
    // 当正在刷新token,将当前请求放入暂存队列中
    if (RefresherAxiosRequest.isRefreshing) {
      console.log('当前请求正在刷新token,暂存请求')
      return new Promise((resolve, reject) => {
        RefresherAxiosRequest.temporaryQueue.push(this.axiosInstance(axiosRequestConfig).then(res => {
          resolve({
            status: res.status.toString(),
            data: res.data,
          });
        }).catch(reject))// 最后会在promise.allSettled处执行
      })
    }
    console.log('当前请求没有刷新token开始请求')
    return new Promise((resolve) => {
      this.axiosInstance(axiosRequestConfig).catch(() => {
        // 出现非200状态的错误,就重新发请求
        return this.request(axiosRequestConfig)
      }).then(res => {
        resolve({
          status: res.status.toString(),
          data: res.data,
        });
      })
    })
  }

  async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<BaseResponse<T>> {
    const { data, status } = await this.request<T>({
      ...config,
      url,
      method: 'get',
    });
    return { data, status };
  }

  async post<T>(url: string, body?: object, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const { data, status } = await this.request<T>({
      ...config,
      url,
      method: 'post',
      data: body,
    });
    return { data, status };
  }

  async put<T>(url: string, body: object | FormData, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const { data, status } = await this.request<T>({
      ...config,
      url,
      method: 'put',
    });
    return { data, status };
  }

  async del<T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const { data, status } = await this.request<T>({
      ...config,
      url,
      method: 'delete',
    });
    return { data, status };
  }
}

// 封装成单例
const AxiosReq = singletonPattern(AxiosRequest)
export default new AxiosReq