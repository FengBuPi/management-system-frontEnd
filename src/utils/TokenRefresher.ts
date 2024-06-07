import axiosReq from '@/utils/axiosRequest'
export default class TokenRefresher {
  // 判断全局是否处于等待刷新token请求的状态中
  static isRefreshing: boolean = false
  // 使用刷新token后的“后续请求暂存队列”
  static temporaryQueue: Array<Promise<any>> = []
  // 刷新token请求的url地址
  private static refreshTokenURL: string = '/auth/refresh'

  // 入口函数
  static async refreshToken(error: any) {
    // 如果普通接口未授权(换句话说就是,不是刷新toekn的请求)，并且当前请求不是刷新token的请求，并且不处于刷新token中
    // 刷新token并跟新token的方法,并设置全局处于正在刷新token的请求中
    // 防止出现多次刷新的情况,并解决：
    // 当处于“刷新token的请求中”的时候, 后续还有请求进入, 将这些请求放入“后续请求暂存队列”
    if (!TokenRefresher.isRefreshQequest(error.config?.url) && !TokenRefresher.isRefreshing) {
      TokenRefresher.isRefreshing = true
      await this.refresh()
      this.executeTemporaryQueueAll()
    }

  }
  // 刷新token请求
  private static async refresh() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      // 携带刷新token去获取新的短token
      const res: any = await axiosReq.get(TokenRefresher.refreshTokenURL, { headers: { Authorization: 'Bearer ' + refreshToken } })
      localStorage.setItem('access_token', res.data?.access_token);
      localStorage.setItem('refresh_token', res.data?.refresh_token);
    } catch (error) {
      console.log("刷新token失效,返回首页")
      // return error
    }
  }

  // 把“后续请求暂存队列”中的执行了
  private static executeTemporaryQueueAll(): void {
    TokenRefresher.temporaryQueue.length !== 0 && Promise.allSettled(TokenRefresher.temporaryQueue);
    TokenRefresher.temporaryQueue = []
    TokenRefresher.isRefreshing = false
  }

  // 判断当前请求是否是刷新请求
  static isRefreshQequest(url: string | undefined): boolean {
    return url === TokenRefresher.refreshTokenURL
  }
}

