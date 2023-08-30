export function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(() => resolve(true), milliseconds))
}

export async function promiseTimeout(promise, milliseconds) {
  // Create a promise that resolves null in <ms> milliseconds
  const timeout = new Promise((resolve) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      resolve(null)
    }, milliseconds)
  })
  const result = await Promise.race([promise, timeout])
  return result
}
