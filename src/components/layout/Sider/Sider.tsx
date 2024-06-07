import React from 'react'
import { Link } from 'react-router-dom'
const Sider = () => {
  return (
    <>
      <div className='flex flex-col'>
        <Link to='/home'>去首页</Link>
        <Link to='/file'>去文件上传页面</Link>
        <Link to='/other'>去其他页面</Link>
      </div>

    </>
  )
}

export default Sider
