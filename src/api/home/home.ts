import axiosReq from '@/utils/axiosRequest'
export default class Home {
  // 获取首页数据
  static async getHomeData() {
    const res = await axiosReq.get('/api/test')
    return res.data
  }
}

