import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'

/**
 * @description Abstract class that presents the methods that handle the return of
 * requests, dealing with the pagination and JSON structure of the responses.
*/
export abstract class Router {

    abstract applyRoutes(application: restify.Server): any

    /**
     * @param {any} document Generic document that will be treated in the implementation of the method.
     * @returns {any} Document pagination according to the implementation performed.
     * @description Abstract method that implements pagination for unique elements.
    */
    envelope(document: any): any {
        return document
    }

    /**
     * @param {any} documents Generic documents that will be treated in the implementation of the method.
     * @param {any} options Generic manipulation options, such as, for example, defining
     * whether all paging elements should be displayed, differentiating the first and the
     * last records that do not have previous and next respectively.
     * @returns {any} Document pagination according to the implementation performed.
     * @description Abstract method that implements pagination for Collections.
    */
    envelopeAll(documents: any[], options: any = {}): any {
        return documents
    }

    /**
     * @param {restify.Request} req Method request, receives the corresponding input.
     * @param {restify.Response} resp Method response, returns the corresponding output.
     * @description Abstract method that manipulates the response structure of requests.
    */
    render(resp: restify.Response, next: restify.Next) {
        return (document: any) => {
            if (document) {
                resp.json(this.envelope(document))
            } else {
                throw new NotFoundError('Document not found')
            }
            return next(false)
        }
    }

    /**
     * @param {restify.Request} req Method request, receives the corresponding input.
     * @param {restify.Response} resp Method response, returns the corresponding output.
     * @param {any} options Generic manipulation options, such as, for example, defining
     * whether all paging elements should be displayed, differentiating the first and the
     * last records that do not have previous and next respectively.
     * @description Abstract method that manipulates the response structure of requests
     * when the response is made up of a listing.
    */
    renderAll(resp: restify.Response, next: restify.Next, options: any = {}) {
        return (documents: any[]) => {
            if (documents) {
                resp.json(this.envelopeAll(documents, options))
            } else {
                resp.json(this.envelopeAll([]))
            }
            return next(false)
        }
    }
}