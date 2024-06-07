import { configureStore } from '@reduxjs/toolkit'
// 导入子模块
import counterStore from './counterStore'
const store = configureStore({
  reducer: {
    counter: counterStore
  }
})
export default store