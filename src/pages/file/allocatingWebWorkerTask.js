import createChunksByWebWorker from './utile/createChunksByWebWorker';
self.onmessage = async function (e) {
  console.log("allocatingWebWorkerTask-start", e)
  const [file, chunkSize] = e.data
  const chunks = await createChunksByWebWorker(file, chunkSize)
  console.log("allocatingWebWorkerTask-end", chunks)
  self.postMessage(chunks);
}