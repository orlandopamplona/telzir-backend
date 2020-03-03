import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify' 
import {Plano} from './planos.model'
import {NotFoundError} from 'restify-errors'

/**
 * @description Implements the routes for the Plano document.
*/
class PlanosRouter extends ModelRouter<Plano> {

    constructor() {
        super(Plano)
    }

    /**
    * @param {restify.Request} req Method request, receives the corresponding input.
    * @param {restify.Response} resp Method response, returns the corresponding output.
    * @param {restify.Next} next Used as notifier of the termination of the method execution.
    * @description Search plans according to the source and destination filter informed.
    */
    findByOrigemDestino = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
      Plano.find({ origem: req.params.origem, destino: req.params.destino })
         .populate('origem')
         .populate('destino')
         .then(result => {
           if(!result || result.length === 0) {
             throw new NotFoundError('Plano not found')
           } else {
             resp.json(result)
             return next()
           }
         }).catch(next)
    }

    /**
     * @description List of routes available for the document.
     */
    applyRoutes(application: restify.Server) {
        application.get('/planos', this.findAll)
        application.get('/planos/:id', [this.validateId, this.findById])
        application.post('/planos', this.save)
        application.put('/planos/:id', [this.validateId, this.replace])
        application.patch('/planos/:id', [this.validateId, this.update])
        application.del('/planos/:id', [this.validateId, this.delete])

        application.get('/planos/byorigemdestino/:origem/:destino', this.findByOrigemDestino)
    }    
}

export const planosRouter = new PlanosRouter()
