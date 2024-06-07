import React from 'react'
import Header from './Header/Header'
import Sider from './Sider/Sider'
import Content from './Content/Content'
import Footer from './Footer/Footer'
const Layout = () => {
  return (
    <>
      <div className='grid h-screen grid-cols-1 grid-rows-[100px_1fr_50px]'>
        <header className='bg-gray-200 '>
          <Header></Header>
        </header>
        <main className='grid grid-cols-[200px_1fr] grid-rows-1'>
          <aside className='bg-slate-400'>
            <Sider />
          </aside>
          <article className='bg-slate-800'>
            <Content></Content>
          </article>
        </main>
        <footer className='bg-gray-200'>
          <Footer></Footer>
        </footer>
      </div>
    </>
  )
}

export default Layout
