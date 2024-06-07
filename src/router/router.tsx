import { createBrowserRouter } from "react-router-dom"
import App from "@/App"
import Layout from '@/components/layout/Layout'
// 页面
import Home from '@/pages/home/Home'
import Result404 from '@/pages/404/404'
import Login from '@/pages/login/login'
import File from '@/pages/file/File'
import Other from '@/pages/other/Other'
const routers = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login></Login>
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/Home",
          element: <Home />,
        },
        {
          path: '/file',
          element: <File></File>
        },
        {
          path: '/other',
          element: <Other></Other>
        },
      ]
    },
    {
      path: '*',
      element: <Result404></Result404>
    },
  ])

export default routers
