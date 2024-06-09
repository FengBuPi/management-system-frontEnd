import React, { useEffect, useRef } from 'react'
import FileAPI from '@/api/file/File'
import WebWorker from '@/utils/WebWorker';
const File = () => {
  // 切片
  interface chunk {
    file: Blob,
    fileName: string,
    uploaded: boolean,
    chunkIndex: number,
  }
  // 设置每一片的大小
  const chunkSize = 1024 * 1024 * 1;//1m
  const fileRef = useRef<any>(null);
  // 单文件分片上传
  const uploadFile = (chunk: chunk) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { file, fileName, uploaded, chunkIndex } = chunk
        const formData = new FormData();
        formData.append('file', file);
        formData.set('fileName', `${fileName} - ${chunkIndex}`);
        formData.set('uploaded', `${uploaded}`);
        const result = await FileAPI.uploadFile(formData)
        chunk.uploaded = true;
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }

  async function createChunks(file: File): Promise<chunk[]> {
    // 电脑cpu最大核心数量
    const maxWorkersCount = WebWorker.maxWorkers.length;
    // 每一份需要webworker处理的量
    const portion = Math.ceil(file.size / maxWorkersCount)
    // 汇总每一个线程最后的结果：[[chunk,...],[chunk],[chunk],....]]
    const allWebWorkercutChunkList = Promise.all(WebWorker.maxWorkers.map((undefined, index) => {
      // 根据电脑cpu最大核心数量创建webWorker线程,分配任务后切片，返回每一个线程的切片结果
      return new Promise(async (resolve, reject) => {
        try {
          const fileCutWorker = new WebWorker(new URL('./fileCutWorker.js', import.meta.url))
          const start = index * portion
          const end = Math.min(start + portion, file.size);
          // 根据开始结束的范围切文件
          const { data: workerChunks } = await fileCutWorker.executer(file, chunkSize, start, end);
          // 获得其中一个线程产出的一个切片集
          resolve(workerChunks)
        } catch (error) {
          reject(error)
        }
      })
    }))
    // 拍平数组,得到“传入文件”的最后切好片之后的数组
    return (await allWebWorkercutChunkList).flat() as chunk[]
  }
  const executeUploadFile = async () => {
    const file = fileRef.current.files[0];
    const chunks = await createChunks(file)
    console.log(chunks)
    // 打包好了并发出去
    Promise.allSettled(chunks.map(chunk => uploadFile(chunk)))
  }
  return (
    <>
      <span className='text-cyan-50'>我是文件上传页面</span>
      <input className="text-white" ref={fileRef} type="file" id="file" />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => executeUploadFile()}>上传一个文件</button>
    </>
  )
}

export default File
