import React, { ReactNode, useEffect } from 'react'
import Login from '@/api/login/login'
import { Link } from 'react-router-dom'
const home = () => {
  // useEffect(() => {
  //   console.log()
  // }, [])
  async function login(body: object): Promise<any> {
    console.log("发起登录")
    const res = await Login.login(body)
    console.log("登录结果", res)
  }
  async function profile(): Promise<any> {
    for (let i = 0; i < 5; i++) {
      const res = await Login.profile()
      console.log(res)
    }

  }
  async function refresh(): Promise<any> {
    // const res = await Login.refresh()
  }
  interface User {
    username: string,
    password: string
  }
  const user: User = {
    username: "xhf",
    password: "132456"
  }
  return (
    <div className='flex gap-3 mt-2'>
      <span className='text-cyan-50'>我是登录页面</span>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => login(user)}>登录</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => profile()}>受保护的接口</button>
      <Link to='/home' rel="stylesheet" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">去首页</Link>
    </div>
  )
}

export default home
