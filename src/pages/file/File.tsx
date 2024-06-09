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
  const chunkSize = 1024 * 1024 * 0.1;//1m
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
  const executeUploadFile = async () => {
    const file = fileRef.current.files[0];
    console.time('allocatingWebWorkerTask')
    const allocatingWebWorkerTask = new WebWorker(new URL('./allocatingWebWorkerTask.js', import.meta.url))
    const { data: chunks } = await allocatingWebWorkerTask.executer(file, chunkSize);
    console.timeEnd('allocatingWebWorkerTask')
    console.log(chunks)
    // 打包好了并发出去
    // Promise.allSettled(chunks.map((chunk: chunk) => uploadFile(chunk)))
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
