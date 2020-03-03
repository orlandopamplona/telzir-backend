import 'jest'
import { TestScheduler } from 'jest';
const request = require('supertest');

const urlTest: string = (<any>global).urlTest

describe('<<<<<<<<<<< Telzir API - Testing Produtos >>>>>>>>>>', () => {

  test('get /produtos', () => {
    return request(urlTest)
      .get('/produtos')
      .then((response: { status: any; body: { items: any; }; }) => {
        expect(response.status).toBe(200)
        expect(response.body.items).toBeInstanceOf(Array)
      })
      .catch(fail)
  })

  test('get /produtos/:id', () => {
    return request(urlTest)
      .post('/produtos')
      .send({
        "descricao": "FaleMais30",
        "minutos": 30,
        "acrescimo": 10
      }).then((response: { body: { _id: any; }; }) => request(urlTest)
        .get(`/produtos/${response.body._id}`))
      .then((response: { status: any; body: { descricao: any; minutos: any; acrescimo: any; }; }) => {
        expect(response.status).toBe(200)
        expect(response.body.descricao).toBe('FaleMais30')
        expect(response.body.minutos).toBe(30)
        expect(response.body.acrescimo).toBe(10)
      })
      .catch(fail)
  })

  test('get /produtos/invalidId - id not found', () => {
    return request(urlTest)
      .get('/produtos/invalidId')
      .then((response: { status: any; }) => {
        expect(response.status).toBe(404)
      })
      .catch(fail)
  })

  test('post /produtos', () => {
    return request(urlTest)
      .post('/produtos')
      .send({
        "descricao": "FaleMais60",
        "minutos": 60,
        "acrescimo": 10
      })
      .then((response: { body: { _id: any; descricao: any; minutos: any; acrescimo: any; }; }) => {
        expect(response.body._id).toBeDefined()
        expect(response.body.descricao).toBe('FaleMais60')
        expect(response.body.minutos).toBe(60)
        expect(response.body.acrescimo).toBe(10)
      })
      .catch(fail)
  })

  test('post /produtos - required field', () => {
    return request(urlTest)
      .post('/produtos')
      .send({

      })
      .then((response: { status: any; body: { errors: any; message: any; }; }) => {
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeInstanceOf(Array)
        expect(response.body.errors).toHaveLength(3)
        expect(response.body.message).toContain('Validation error while processing your request')
      })
      .catch(fail)
  })

  test('patch /produtos/:id', () => {
    return request(urlTest)
      .post('/produtos')
      .send({
        "descricao": "FaleMais120",
        "minutos": 120,
        "acrescimo": 10
      })
      .then((response: { body: { _id: any; }; }) => request(urlTest)
        .patch(`/produtos/${response.body._id}`)
        .send({
          "acrescimo": 20
        }))
      .then((response: { status: any; body: { _id: any; descricao: any; minutos: any; acrescimo: any; }; }) => {
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.descricao).toBe('FaleMais120')
        expect(response.body.minutos).toBe(120)
        expect(response.body.acrescimo).toBe(20)
      })
      .catch(fail)
  })

  test('patch /produtos/invalidId - id not found', () => {
    return request(urlTest)
      .patch('/produtos/invalidId')
      .then((response: { status: any; }) => {
        expect(response.status).toBe(404)
      })
      .catch(fail)
  })

  test('delete /produtos:/id', () => {
    return request(urlTest)
      .post('/produtos')
      .send({
        "descricao": "FaleMais45",
        "minutos": 45,
        "acrescimo": 10
      }).then((response: { body: { _id: any; }; }) => request(urlTest)
        .delete(`/produtos/${response.body._id}`))
      .then((response: { status: any; }) => {
        expect(response.status).toBe(204)
      })
      .catch(fail)

  })

  test('delete /produtos/invalidId - id not found', () => {
    return request(urlTest)
      .delete(`/produtos/invalidId`)
      .then((response: { status: any; }) => {
        expect(response.status).toBe(404)
      }).catch(fail)
  })

  test('simulate /produtos/simular/:produto/:origem/:destino/:duracao', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '020'
      }).then((responsePlanoOrigem: { body: { _id: any; }; }) => {
        request(urlTest)
          .post('/localidades')
          .send({
            ddd: '021'
          }).then((responsePlanoDestino: { body: { _id: any; }; }) => {
            request(urlTest)
              .post('/planos')
              .send({
                origem: responsePlanoOrigem.body._id,
                destino: responsePlanoDestino.body._id,
                valor: '1.95'
              }).then((responsePlanos: { body: { _id: any; }; }) => {
                request(urlTest)
                  .post('/produtos')
                  .send({
                    "descricao": "FaleMais 30", "minutos": "30", "acrescimo": "10"
                  }).then((responseProduto: { body: { _id: any; }; }) => {
                    request(urlTest)
                      .get(`/produtos/simular/${responseProduto.body._id}/${responsePlanoOrigem.body._id}/${responsePlanoDestino.body._id}/40`)
                      .then((response: { status: any; body: { origem: any; destino: any; duracao: any; produto: any; comFaleMais: any; semFaleMais: any; }; }) => {
                        expect(response.status).toBe(200)
                        expect(response.body.origem).toBe('020')
                        expect(response.body.destino).toBe('021')
                        expect(response.body.duracao).toBe('40')
                        expect(response.body.produto).toBe('FaleMais 30')
                        expect(response.body.comFaleMais).toBe(21.45)
                        expect(response.body.semFaleMais).toBe(78)
                      })

                  })
              })
          })
      }).catch(fail)
  })

})