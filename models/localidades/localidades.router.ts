import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'

import { ModelRouter } from '../../common/model-router'
import { Localidade } from './localidades.model'
import { Plano } from '../../models/planos/planos.model'



class LocalidadesRouter extends ModelRouter<Localidade> {

    constructor() {
        super(Localidade)
    }

    findByOrigem = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        Plano.find({ origem: req.params.id }, {
            "_id": 0,
            "destino": 1
        }).then(result => {
            const listDestino = result.map(item => {
                return item.destino
            })
            Localidade.find({ _id: { "$in": listDestino } }).then((result => {
                if (!result || result.length === 0) {
                    throw new NotFoundError('Localidade not found')
                } else {
                    result.length > 0 ? resp.json(result) : resp.json([result])
                    return next()
                }
            }))

        }).catch(next)
    }

    applyRoutes(application: restify.Server) {
        application.get('/localidades', this.findAll)
        application.get('/localidades/:id', [this.validateId, this.findById])
        application.post('/localidades', this.save)
        application.put('/localidades/:id', [this.validateId, this.replace])
        application.patch('/localidades/:id', [this.validateId, this.update])
        application.del('/localidades/:id', [this.validateId, this.delete])

        application.get('/localidades/byOrigem/:id', [this.validateId, this.findByOrigem])
    }
}

export const localidadesRouter = new LocalidadesRouter()
