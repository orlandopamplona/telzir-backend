import { Router } from './router'
import mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors'
import * as restify from 'restify'

/**
 * @description Class that implements the abstract methods of the Router class
 * and presents the standard methods of manipulating documents (insert, delete, edit, etc.).
*/
export abstract class ModelRouter<D extends mongoose.Document> extends Router {

  basePath: string

  pageSize: number = 2

  constructor(protected model: mongoose.Model<D>) {
    super()
    this.basePath = `/${model.collection.name}`
  }

  /**
 * @param {mongoose.DocumentQuery<D | null, D>} query Query corresponding to the triggered router.
 * @returns { mongoose.DocumentQuery<D | null, D>} Query corresponding to the triggered router changed.
 * @description It allows a specialized class to change the default query, simply overlaying it with
 * the necessary code (using a populate for example).
*/
  protected prepareOne(query: mongoose.DocumentQuery<D | null, D>): mongoose.DocumentQuery<D | null, D> {
    return query
  }

  /**
   * @param {any} document Generic document that will be treated in the implementation of the method.
   * @returns {any} Document pagination according to the implementation performed.
   * @description Method that implements the pagination structure for a single registered,
   * that is, only the self attribute is presented.
  */
  envelope(document: any): any {
    let resource = Object.assign({ _links: {} }, document.toJSON())
    resource._links.self = `${this.basePath}/${resource._id}`
    return resource
  }

  /**
   * @param {any} documents Generic documents that will be treated in the implementation of the method.
   * @param {any} options Generic manipulation options, such as, for example, defining
   * whether all paging elements should be displayed, differentiating the first and the
   * last records that do not have previous and next respectively.
   * @returns {any} Document pagination according to the implementation performed.
   * @description Method that implements pagination for Collections.
  */
  envelopeAll(documents: any[], options: any = {}): any {
    const resource: any = {
      _links: {
        self: `${options.url}`
      },
      items: documents
    }
    if (options.page && options.count && options.pageSize) {
      if (options.page > 1) {
        resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
      }
      const remaining = options.count - (options.page * options.pageSize)
      if (remaining > 0) {
        resource._links.next = `${this.basePath}?_page=${options.page + 1}`
      }
    }
    return resource
  }

  /**
   * @param {restify.Request} req Method request, receives the corresponding input.
   * @param {restify.Response} resp Method response, returns the corresponding output.
   * @param {restify.Next} next Used as notifier of the termination of the method execution.
   * @description For all methods that take the id as parameter, perform a validation to
   * confirm if the value is a valid ObjectId.
  */
  validateId = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    if (mongoose.Types && !mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError('Document not found'))
    } else {
      next()
    }
  }

  /**
  * @param {restify.Request} req Method request, receives the corresponding input.
  * @param {restify.Response} resp Method response, returns the corresponding output.
  * @param {restify.Next} next Used as notifier of the termination of the method execution.
  * @description Main method that searches for documents considering pagination in the response.
 */
  findAll = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    let page = parseInt(req.query._page || 1)
    page = page > 0 ? page : 1

    const skip = (page - 1) * this.pageSize

    this.model
      .countDocuments({}).exec()
      .then(count => this.model.find()
        .skip(skip)
        .limit(this.pageSize)
        .populate('origem')
        .populate('destino')
        .then(this.renderAll(resp, next, {
          page, count, pageSize: this.pageSize, url: req.url
        })))
      .catch(next)
  }

  /**
  * @param {restify.Request} req Method request, receives the corresponding input.
  * @param {restify.Response} resp Method response, returns the corresponding output.
  * @param {restify.Next} next Used as notifier of the termination of the method execution.
  * @description Method that queries a specific document using the given id.
 */
  findById = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    this.prepareOne(this.model.findById(req.params.id))
      .then(this.render(resp, next))
      .catch(next)
  }

  /**
  * @param {restify.Request} req Method request, receives the corresponding input.
  * @param {restify.Response} resp Method response, returns the corresponding output.
  * @param {restify.Next} next Used as notifier of the termination of the method execution.
  * @description Method that performs the persistence of a given document.
 */
  save = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    let document = new this.model(req.body)
    document.save()
      .then(this.render(resp, next))
      .catch(next)
  }

  /**
  * @param {restify.Request} req Method request, receives the corresponding input.
  * @param {restify.Response} resp Method response, returns the corresponding output.
  * @param {restify.Next} next Used as notifier of the termination of the method execution.
  * @description Method for updating a document, completely overlapping the original
  * with the information received.
 */
  replace = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    const options = { runValidators: true, overwrite: true }
    this.model.update({ _id: req.params.id }, req.body, options)
      .exec().then(result => {
        if (result.n) {
          return this.prepareOne(this.model.findById(req.params.id))
        } else {
          throw new NotFoundError('Document not found.')
        }
      }).then(this.render(resp, next))
      .catch(next)
  }

  /**
  * @param {restify.Request} req Method request, receives the corresponding input.
  * @param {restify.Response} resp Method response, returns the corresponding output.
  * @param {restify.Next} next Used as notifier of the termination of the method execution.
  * @description Method that performs the update of a document, performing a merge, that
  * is, maintaining the original values that have not been changed in the data received.
 */
  update = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    const options = { runValidators: true, new: true, useFindAndModify: false }
    this.model.findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(resp, next))
      .catch(next)
  }

  /**
  * @param {restify.Request} req Method request, receives the corresponding input.
  * @param {restify.Response} resp Method response, returns the corresponding output.
  * @param {restify.Next} next Used as notifier of the termination of the method execution.
  * @description Method that performs the deletion of a specific document, according to the given id.
 */
  delete = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    this.model.deleteOne({ _id: req.params.id }).exec().then((result: any) => {
      if (result.n) {
        resp.send(204)
      } else {
        throw new NotFoundError('Documento não encontrado')
      }
      return next()
    }).catch(next)
  }

}
