import * as restify from 'restify'
import corsMiddleware from 'restify-cors-middleware'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch-parser'
import { handleError } from './error.handler'

import mongoose from 'mongoose'

/**
 * @descriptionStandard CORS configuration providing full access to any server.
*/
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

    /**
     * @description Establishes the connection with the database and applies the configuration
     * for access control through CORS.
    */
    initializeDb() {

        this.application.pre(cors.preflight)

        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    }

    /**
     * @param {Router[]} routers List with the list of all routers (models / documents) that are manipulated in the API.
     * @returns {Promise<any>} Promise of the application element that provides the API methods query interface
     * @description Method executed at the initialization of the API responsible for exposing the routes of all
     * entities manipulated in operations. It also starts plugins that are automatically activated as the
     * corresponding request is received.
    */
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

    /**
     * @param {Router[]} routers List with the list of all routers (models / documents) that are manipulated in the API.
     * @returns {Promise<any>} Promise of the application element that provides the API methods query interface
     * @description API initialization method that performs successful validation to obtain the connection to the
     * database and only then, executes the start exposing the available routes.
    */
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this))
    }

    /**
     * @description Method to release the connection to the database and download the API server, ending its execution.
    */
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}