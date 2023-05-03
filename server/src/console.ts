import { lambdaHandler } from './app'

lambdaHandler(null, null)
.then((result) => {
  console.log(result)
})
.catch((error) => {
  console.error(error)
})
