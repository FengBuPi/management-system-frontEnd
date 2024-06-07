import React from 'react'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <>
      <div className='min-h-full min-w-full flex items-center justify-around'>
        疯不皮的个人财务管理系统
        <Link to='/login' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">回登录页</Link>
      </div>

    </>
  )
}

export default Header
