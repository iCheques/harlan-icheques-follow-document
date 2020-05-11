const fetchHandler = res => {
    if (JSON.parse(res).processing) throw Error('Api error!')
    return JSON.parse(res)
  }
  
  const delay = time => data =>
    new Promise((resolve, reject) =>
      setTimeout(() => resolve(data), time)
    )
  
  const retry = (fn, retries = 3, time = 2000) =>
    fn().catch(err =>
      delay(time)().then(() =>
        retries > 1
          ? retry(fn, retries - 1, time)
          : Promise.reject(err))
    )
  
  module.exports = { fetchHandler, delay, retry }
  