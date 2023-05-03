global.fetch = require('node-fetch')

const func = require('./app')

const handlerName = process.argv[2]
const handlerEvent = eval('(' + process.argv[3] + ')') || {}
const handlerContext = eval('(' + process.argv[4] + ')') || {}

func[handlerName](handlerEvent, handlerContext)
.then((result: any) => {
  console.log(result)
})
.catch((error: any) => {
  console.error(error)
})
