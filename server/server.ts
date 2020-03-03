import * as restify from 'restify'
import corsMiddleware from 'restify-cors-middleware'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch-parser'
import { handleError } from './error.handler'

import mongoose from 'mongoose'

const corsOptions: corsMiddleware.Options = {
    preflightMaxAge: 86400,
    origins: ['*'],
    allowHeaders: ['authorization'],
    exposeHeaders: ['x-custom-header']
}

const cors: corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions)

export class Server {

    application: restify.Server = restify.createServer({
        name: 'telzir-api',
        version: '1.0.0'
    })

    initializeDb() {

        this.application.pre(cors.preflight)

        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application.use(cors.actual)
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
            } catch (error) {
                reject(error)
            }

            // routes
            routers.forEach(router => {
                router.applyRoutes(this.application)
            });


            this.application.listen(environment.server.port, () => {
                resolve(this.application)
            })

            this.application.on('restifyError', handleError)
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this))
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}