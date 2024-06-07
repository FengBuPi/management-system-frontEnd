import axiosReq from '@/utils/axiosRequest'
export default class Login {
  // 登录请求
  static async login(body: object) {
    const res: any = await axiosReq.post('/auth/login', body)
    // console.log(res.data)
    localStorage.setItem('access_token', res.data?.access_token);
    localStorage.setItem('refresh_token', res.data?.refresh_token);
    return res.data
  }

  // token授权成功测试接口
  static async profile() {
    const res: any = await axiosReq.get('/auth/profile')
    return res.data
  }
}

