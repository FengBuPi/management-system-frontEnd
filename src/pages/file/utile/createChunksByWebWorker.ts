import WebWorker from '@/utils/WebWorker';
interface chunk {
  file: Blob,
  fileName: string,
  uploaded: boolean,
  chunkIndex: number,
}
/**
 * 根据电脑cpu最大核心数量减去一，再创建webWorker线程进行切片，返回每一个线程的切片结果
 * @param file 
 * @param chunkSize 
 * @returns 
 */
export default async function createChunksByWebWorker(file: File, chunkSize: number): Promise<chunk[]> {
  // 电脑cpu最大核心数量
  const maxWorkersCount = WebWorker.maxWorkers.length;
  // 每一份需要webworker处理的量
  const portion = Math.ceil(file.size / maxWorkersCount)
  // 汇总每一个线程最后的结果：[[chunk,...],[chunk],[chunk],....]]
  const allWebWorkerCutChunkList = Promise.all(WebWorker.maxWorkers.map((undefined, index) => {
    return new Promise(async (resolve, reject) => {
      if (index !== maxWorkersCount - 1) {
        try {
          const start = index * portion;
          const end = (index * portion) + portion;
          const partFile = file.slice(start, end);
          console.log("我是其中一个线程产出的一个切片", partFile)
          const fileCutWorker = new WebWorker(new URL('../fileCutWorker.js', import.meta.url));
          console.log("我创建好线程了");
          const { data: workerChunks } = await fileCutWorker.executer(partFile, chunkSize, `webWorker${index}`);
          console.log("我是其中一个线程产出的一个切片集", workerChunks);
          resolve(workerChunks);
        } catch (error) {
          reject(error);
        }
      } else {
        // 处理 index === maxWorkersCount - 1 的情况
        resolve([]);
      }
    });
  }));
  console.log("createChunksByWebWorker-end", allWebWorkerCutChunkList)
  // 拍平数组,得到“传入文件”的最后切好片之后的数组
  return (await allWebWorkerCutChunkList).flat(Infinity) as chunk[]
}