import { Server } from './server/server'
import {planosRouter} from './models/planos/planos.router'
import {produtosRouter} from './models/produtos/produtos.router'
import {localidadesRouter} from './models/localidades/localidades.router'

const server = new Server()

server.bootstrap([
    planosRouter,
    produtosRouter,
    localidadesRouter
]).then(server => {
    console.log('Server is listenning on: ', server.application.address())
}).catch(error => {
    console.log('Failed to start')
    console.error(error)
    process.exit(1)
})





