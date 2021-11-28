require('dotenv').config()

const fs = require('fs');
const glob = require('glob')
const shasum = require('shasum')
const axios = require('axios')

axios.defaults.headers.common['Authorization'] = 'Bearer ' + process.env.NETLIFY_TOKEN

/*
axios.post('https://api.netlify.com/api/v1/sites').then(response => {
  console.log(response.data)
})
.catch(e => {
  console.log(e.response.data)
})
*/


glob('dist/**/*', async function(er, paths) {
  let files = paths.filter(path => {
    return fs.statSync(path).isFile()
  })

  let payload = {}

  for (let file of files) {
    let content = fs.readFileSync(file)
    payload[file.substr(4)] = shasum(content)
  }

  axios.post('https://api.netlify.com/api/v1/sites/' + process.env.NETLIFY_SITE_ID + '/deploys', {
    files: payload
  }).then(async (response) => {
    let deployId = response.data.id
    for(let file of files) {
      let content = fs.readFileSync(file)
      console.log(file)

      axios.put('https://api.netlify.com/api/v1/deploys/' + deployId  + '/files/' + file, content , {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      }).then(response => {
      
      }).catch(e => {
        console.log(e.response.status)
      })
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }).catch(e => {
    console.log(e.response.data)
  })
})

