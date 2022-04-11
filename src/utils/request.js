const baseUrl = 'http://localhost:3000/api'

const request = (url, data, method = 'POST') => {
  console.log('执行');
  return new Promise((resolve, reject) => {
    uni
      .request({
        url: baseUrl + url,
        data,
        method: method
        // header: {
        //   token: token
        // }
      })
      .then(response => {
       let [error, res] = response;
        console.log('成功.')
        console.log(res)

        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default request