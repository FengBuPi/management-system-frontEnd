// 方案一
// interface chunk {
//   file: Blob,
//   fileName: string,
//   uploaded: boolean,
//   startIndex: number,
//   endIndex: number,
// }
// /**
//  * 文件按需切片
//  * @param file 文件
//  * @param chunkSize 每一片文件的大小
//  * @param start 文件切割起始位置
//  * @param end 文件切割结束位置
//  * @returns 文件切片
//  */
// const createChunks = (file: File, chunkSize: number, start: number, end: number): Array<chunk> => {
//   const { name, size } = file;
//   const chunks = [];
//   let startIndex = Math.max(0, start);
//   let endIndex = Math.min(size, end);
//   for (let i = startIndex; i < endIndex; i += chunkSize) {
//     // 确保不会超过文件大小
//     let actualEnd = Math.min(i + chunkSize, endIndex);
//     let curChunk = file.slice(i, actualEnd);
//     let chunkIndex = 0;
//     chunks.push({
//       file: curChunk,
//       fileName: `${name}_chunk_${chunkIndex + 1}`, // 为每个切片命名，显示它是第几个切片
//       uploaded: false,
//       startIndex: i,
//       endIndex: actualEnd,
//     });
//     chunkIndex++;
//     // 更新startIndex为下一次迭代的起始位置
//     startIndex = actualEnd;
//   }
//   return chunks;
// }
// export default createChunks
// // 文件切片 worker 线程
// self.onmessage = function (e) {
//   const chunks = createChunks(...e.data)
//   self.postMessage(chunks);
// }




// 方案二
import createChunksBychunkSize from './utile/createChunksBychunkSize';
self.onmessage = function (e) {
  console.log("fileCutWorker-start", e)
  const [partFile, chunkSize, webWorkerSign] = e.data
  const chunks = createChunksBychunkSize(partFile, chunkSize, webWorkerSign)
  console.log("fileCutWorker-end", chunks)
  self.postMessage(chunks);
}