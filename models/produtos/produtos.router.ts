import { ModelRouter } from '../../common/model-router'
import * as restify from 'restify'
import { Produto } from './produtos.model'
import { Plano } from '../planos/planos.model'
import { NotFoundError } from 'restify-errors'

class ProdutoRouter extends ModelRouter<Produto> {

    constructor() {
        super(Produto)
    }

    simular = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        const reqProduto = req.params.produto
        const reqDuracao = req.params.duracao
        const reqOrigem = req.params.origem
        const reqDestino = req.params.destino

        Plano.find({ origem: reqOrigem, destino: reqDestino })
            .populate('origem')
            .populate('destino')
            .then(resultPlano => {
                if (!resultPlano || resultPlano.length === 0) {
                    throw new NotFoundError('Plano not found')
                } else {
                    Produto.findById(reqProduto).then(resultProduto => {
                        if (!resultProduto) {
                            throw new NotFoundError('Produto not found')
                        } else {
                            const minutos = resultProduto.minutos
                            const acrescimo = resultProduto.acrescimo
                            const tempoFinal = reqDuracao - minutos
                            const valorAcrescimo = (resultPlano[0].valor * (100 + acrescimo)) / 100
                            const semFaleMais = resultPlano[0].valor * reqDuracao
                            const comFaleMais = tempoFinal > 0 ? valorAcrescimo * tempoFinal : 0 
                            resp.json({
                                origem: resultPlano[0].origem.ddd,
                                destino: resultPlano[0].destino.ddd,
                                duracao: reqDuracao,
                                produto: resultProduto.descricao,
                                comFaleMais: comFaleMais,
                                semFaleMais: semFaleMais
                            })
                            return next()
                        }
                    })
                }
            }).catch(next)
        return next()
    }

    applyRoutes(application: restify.Server) {
        application.get('/produtos', this.findAll)
        application.get('/produtos/:id', [this.validateId, this.findById])
        application.post('/produtos', this.save)
        application.put('/produtos/:id', [this.validateId, this.replace])
        application.patch('/produtos/:id', [this.validateId, this.update])
        application.del('/produtos/:id', [this.validateId, this.delete])

        application.get('/produtos/simular/:produto/:origem/:destino/:duracao', this.simular)
    }
}

export const produtosRouter = new ProdutoRouter()
