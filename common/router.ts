import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'

export abstract class Router {

    abstract applyRoutes(application: restify.Server): any

    envelope(document: any): any {
        return document
    }

    envelopeAll(documents: any[], options: any = {}): any {
        return documents
    }

    render(resp: restify.Response, next: restify.Next) {
        return (document: any) => {
            if(document){
                resp.json(this.envelope(document))
              }else{
                throw new NotFoundError('Documento não encontrado')
              }
              return next(false)
        }
    }

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