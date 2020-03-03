import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify' 
import {Plano} from './planos.model'
import {NotFoundError} from 'restify-errors'

class PlanosRouter extends ModelRouter<Plano> {

    constructor() {
        super(Plano)
    }

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
