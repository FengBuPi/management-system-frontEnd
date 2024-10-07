import { AxiosRequestConfig } from 'axios';
import axios, { AxiosInstance } from 'axios'

type RefreshToken = {
  access_token: string,
  refresh_token: string
}

class RefresherAxiosRequest {
  private refresherAxiosInstance: AxiosInstance // 专门刷新token的axios实例
  public isRefreshing: boolean = false // 是否正在刷新token
  public temporaryQueue: Array<Promise<any>> = []; // 暂存队列,当处于刷新token的时间中时,后续请求全部push进该队列中

  constructor() {
    this.refresherAxiosInstance = axios.create({
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
    this.refresherAxiosInstance.interceptors.request.use((config) => {
      return config;
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });
  }

  // 响应拦截器
  private interceptorsResponse() {
    this.refresherAxiosInstance.interceptors.response.use((response) => {
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
          // 长token失效,跳转登录页面
          console.log('长token失效,跳转登录页面')
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
      return Promise.reject(error);
    });
  }

  private request(axiosRequestConfig: AxiosRequestConfig): Promise<any> {
    return this.refresherAxiosInstance(axiosRequestConfig);
  }

  // 刷新token的请求
  public async refresh(url: string = '/auth/refresh', config: AxiosRequestConfig = {}): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      this.isRefreshing = true; // 标记正在刷新token
      console.log('开始刷新token')
      const { data, status } = await this.request({
        ...config,
        url,
        method: 'get',
        headers: {
          authorization: 'Bearer ' + refreshToken, // 把refreshToken放到请求头里面
        },
      });
      console.log('刷新token成功', data, status)
      Promise.allSettled(this.temporaryQueue)
      localStorage.setItem('access_token', data?.access_token);
      localStorage.setItem('refresh_token', data?.refresh_token);
      return Promise.resolve(true);
    }
    catch (error) {
      console.warn('刷新token失败', error)
      return Promise.resolve(false);
    }
    finally {
      this.isRefreshing = false; // 标记刷新token完成
    }
  }
}

export default new RefresherAxiosRequest