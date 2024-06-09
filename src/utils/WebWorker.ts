import { WorkerOptions as OriginalWorkerOptions } from 'worker_threads';

interface WorkerOptions extends OriginalWorkerOptions {
  type?: "classic" | "module";
}

// 工作线程封装
export default class WebWorker {
  private webWorkerInstance: Worker
  // 获取当前环境cpu内核数量(根据内核数量开启webworker),并继承forEach方法(用于辅助开启多线程)
  static readonly maxWorkers: Array<number> = new Array(navigator.hardwareConcurrency || 4).fill(undefined).map((undefined, index) => index);
  // 默认设置为ES6的模块化导入
  constructor(url: URL, options: WorkerOptions = { type: 'module' }) {
    this.webWorkerInstance = new Worker(url, options)
  }
  // 执行器
  public async executer(...args: any[]): Promise<any> {
    try {
      this.postWebWorkerMessage(...args)
      return await this.getWebWorkerMessage()
    } catch (error) {
      throw error
    }
  }
  // 发送给webworker的数据
  private postWebWorkerMessage(...args: any[]) {
    this.webWorkerInstance.postMessage(args)
  }

  // webworker返回的结果
  private getWebWorkerMessage() {
    return new Promise((resolve, reject) => {
      this.webWorkerInstance.onmessage = (data: MessageEvent) => {
        resolve(data)
        // this.webWorkerInstance.terminate()
      }
      this.webWorkerInstance.onerror = (error) => {
        reject(error)
        this.webWorkerInstance.terminate()
      }
    })
  }
}


// 使用
// const fileCutWorker = new WebWorker(new URL('./fileCuteWorker.ts', import.meta.url))