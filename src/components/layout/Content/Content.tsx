import React from 'react'
import { Link, Outlet } from 'react-router-dom';
const Content = () => {
  return (
    <>
      {/* 所有主页内容的入口 */}
      <Outlet />
    </>
  )
}

export default Content
