import * as restify from 'restify'

/**
 * @param {restify.Request} req Method request, receives the corresponding input.
 * @param {restify.Response} resp Method response, returns the corresponding output.
 * @param {any} err Error message that will be handled.
 * @param {any} callback Used as notifier of the termination of the method execution,
 * method being executed on completion.
 * @description Method that handles system error messages, standardizing in a unified format.
*/
export const handleError = (req: restify.Request, resp: restify.Response, err: any, callback: any) => {
  err.toJSON = () => {
    return {
      name: err.name,
      message: err.message
    }
  }
  switch (err.name) {
    case 'MongoError':
      if (err.code === 11000) {
        err.statusCode = 400
      }
      break
    case 'ValidationError':
      err.statusCode = 400
      const messages: any[] = []
      for (let name in err.errors) {
        messages.push({ name: name, message: err.errors[name].message })
      }
      err.toJSON = () => ({
        message: 'Validation error while processing your request',
        errors: messages
      })
      break
  }
  resp.send(err);
  callback()
}