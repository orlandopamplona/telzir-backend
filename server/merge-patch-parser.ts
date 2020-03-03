import * as restify from 'restify'
import { BadRequestError } from 'restify-errors'

const mpContentType = 'application/merge-patch+json'

/**
 * @param {restify.Request} req Method request, receives the corresponding input.
 * @param {restify.Response} resp Method response, returns the corresponding output.
 * @param {restify.Next} next Used as notifier of the termination of the method execution.
 * @description Implements a plugin that will intercept requests for PATCH methods that
 * have the contentType defined by 'application / merge-patch + json'.
*/
export const mergePatchBodyParser = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    if (req.contentType() === mpContentType && req.method === 'PATCH') {
        (<any>req).rawBody = req.body
        try {
            req.body = JSON.parse(req.body)
        } catch (error) {
            return next(new BadRequestError(`Invalid content: ${error}`))
        }
    }
    return next()
}