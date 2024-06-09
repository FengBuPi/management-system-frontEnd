import axiosReq from '@/utils/axiosRequest'
export default class File {
  // 获取首页数据
  static async uploadFile(formData: FormData) {
    const res = await axiosReq.post('/file/uploadFile', formData)
    return res
  }
}