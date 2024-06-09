interface chunk {
  file: Blob,
  fileHash: string,
  uploaded: boolean,
  startIndex: number
}
/**
 * 根据chunkSize均分文件
 * @param file 文件
 * @param chunkSize 每一片文件切片的大小
 * @param webWorkerSign 工作线程标记
 * @returns 文件切片
 */
export default function createChunksBychunkSize(partFile: Blob, chunkSize: number, webWorkerSign?: string): Array<chunk> {
  const { size } = partFile;
  const chunks = [];
  for (let i = 0; i < size; i) {
    let curChunk = partFile.slice(i, i += chunkSize);
    chunks.push({
      file: curChunk,
      fileHash: `fileHash`, // 为每个切片命名，显示它是第几个切片
      uploaded: false,
      startIndex: i,
    });
  }
  console.log("createChunksBychunkSize-end", chunks)
  return chunks;
}