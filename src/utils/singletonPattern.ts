/**
 * 单例工具函数
 * 返回一个被proxy代理后类,确保该类为全局唯一
 * @param oldConstructor 
 * @returns T
 */

// T extends new (...args: any[] 确保T是一个构造函数
export default function singletonPattern<T extends new (...args: any[]) => any>(oldConstructor: T): T {
  // 唯一实例
  let onlyInstance: InstanceType<T>;

  // 创建一个Proxy来代理构造函数，确保只有一个实例被创建
  const proxyConstructor: T = new Proxy(oldConstructor, {
    construct(target, args) {
      // 如果存在实例直接返回当前实例
      if (onlyInstance) return onlyInstance;
      onlyInstance = Reflect.construct(target, args);
      return onlyInstance;
    },
  }) as T;

  return proxyConstructor;
}