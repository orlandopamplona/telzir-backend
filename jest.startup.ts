import * as jestCli from 'jest-cli'

import { Server } from './server/server'
import { environment } from './common/environment'
import { localidadesRouter } from './models/localidades/localidades.router'
import { Localidade } from './models/localidades/localidades.model'
import { planosRouter } from './models/planos/planos.router'
import { Plano } from './models/planos/planos.model'
import { produtosRouter } from './models/produtos/produtos.router'
import { Produto } from './models/produtos/produtos.model'

let server: Server
const beforeAllTests = () => {
  environment.db.url = environment.dbTest.url
  environment.server.port = environment.serverTest.port
  server = new Server()
  return server.bootstrap([
    localidadesRouter,
    planosRouter,
    produtosRouter
  ])
    .then(() => Localidade.deleteMany({}).exec())
    .then(() => Plano.deleteMany({}).exec())
    .then(() => Produto.deleteMany({}).exec())
}

const afterAllTests = () => {
  return server.shutdown()
}

beforeAllTests()
  .then(() => jestCli.run())
  .then(() => afterAllTests())
  .catch(console.error)
