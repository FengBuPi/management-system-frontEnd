import React from 'react'
import ReactDOM from 'react-dom/client'
// 全局样式
import './index.css'
//  react路由
import { RouterProvider } from "react-router-dom"
import routers from "@/router/router.tsx"
// redux
import store from '@/store'
import { Provider } from 'react-redux'
import Utils from "./utils/Utils"
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={routers} />
    </React.StrictMode>
  </Provider>
)
