import 'jest'
const request = require('supertest');

const urlTest: string = (<any>global).urlTest

describe('<<<<<<<<<<< Telzir API - Testing Localidades >>>>>>>>>>', () => {

  test('get /localidades', () => {
    return request(urlTest)
      .get('/localidades')
      .then((response: { status: any; body: { items: any; }; }) => {
        expect(response.status).toBe(200)
        expect(response.body.items).toBeInstanceOf(Array)
      })
      .catch(fail)
  })

  test('get /localidades/:id', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '067'
      }).then((response: { body: { _id: any; }; }) => request(urlTest)
        .get(`/localidades/${response.body._id}`))
      .then((response: { status: any; body: { ddd: any; }; }) => {
        expect(response.status).toBe(200)
        expect(response.body.ddd).toBe('067')
      })
      .catch(fail)
  })

  test('get /localidades/invalidId - id not found', () => {
    return request(urlTest)
      .get('/localidades/invalidId')
      .then((response: { status: any; }) => {
        expect(response.status).toBe(404)
      })
      .catch(fail)
  })

  test('post /localidades', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '048'
      })
      .then((response: { body: { _id: any; ddd: any; }; }) => {
        expect(response.body._id).toBeDefined()
        expect(response.body.ddd).toBe('048')
      })
      .catch(fail)
  })

  test('post /localidades - required field', () => {
    return request(urlTest)
      .post('/localidades')
      .send({

      })
      .then((response: { status: any; body: { errors: { message: any; }[]; }; }) => {
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeInstanceOf(Array)
        expect(response.body.errors[0].message).toContain('ddd')
      })
      .catch(fail)
  })

  test('post /localidades - unique field duplicated', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '055'
      }).then((response: any) =>
        request(urlTest)
          .post('/localidades')
          .send({
            ddd: '055'
          }))
      .then((response: { status: any; body: { message: any; }; }) => {
        expect(response.status).toBe(400)
        expect(response.body.message).toContain('E11000 duplicate key')
      })
      .catch(fail)
  })

  test('post /localidades - short field validation', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '05'
      })
      .then((response: { status: any; body: { message: any; errors: { message: any; }[]; }; }) => {
        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Validation error while processing your request')
        expect(response.body.errors[0].message).toContain('is shorter than the minimum allowed length (3)')
      })
      .catch(fail)
  })

  test('post /localidades - longer field validation', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '0555'
      })
      .then((response: { status: any; body: { message: any; errors: { message: any; }[]; }; }) => {
        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Validation error while processing your request')
        expect(response.body.errors[0].message).toContain('is longer than the maximum allowed length (3)')
      })
      .catch(fail)
  })

  test('patch /localidades/:id', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '052'
      })
      .then((response: { body: { _id: any; }; }) => request(urlTest)
        .patch(`/localidades/${response.body._id}`)
        .send({
          ddd: '068'
        }))
      .then((response: { status: any; body: { _id: any; ddd: any; }; }) => {
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.ddd).toBe('068')
      })
      .catch(fail)
  })

  test('patch /localidades/invalidId - id not found', () => {
    return request(urlTest)
      .patch('/localidades/invalidId')
      .then((response: { status: any; }) => {
        expect(response.status).toBe(404)
      })
      .catch(fail)
  })

  test('delete /localidades:/id', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '058'
      }).then((response: { body: { _id: any; }; }) => request(urlTest)
        .delete(`/localidades/${response.body._id}`))
      .then((response: { status: any; }) => {
        expect(response.status).toBe(204)
      })
      .catch(fail)

  })

  test('delete /localidades/invalidId - id not found', () => {
    return request(urlTest)
      .delete(`/localidades/invalidId`)
      .then((response: { status: any; }) => {
        expect(response.status).toBe(404)
      }).catch(fail)
  })

  test('get /localidades/byOrigem/:origem', () => {
    return request(urlTest)
      .post('/localidades')
      .send({
        ddd: '030'
      }).then((responsePlanoOrigem: { body: { _id: any; }; }) => {
        request(urlTest)
          .post('/localidades')
          .send({
            ddd: '031'
          }).then((responsePlanoDestino: { body: { _id: any; }; }) => {
            request(urlTest)
              .post('/planos')
              .send({
                origem: responsePlanoOrigem.body._id,
                destino: responsePlanoDestino.body._id,
                valor: '1.95'
              }).then((responsePlanos: { body: { _id: any; }; }) => {
                request(urlTest)
                  .get(`/localidades/byOrigem/${responsePlanoOrigem.body._id}`)
                  .then((response: { status: any; body: { ddd: any; }[]; }) => {
                    expect(response.status).toBe(200)
                    expect(response.body[0].ddd).toBe('031')
                  })
              })
          })
      }).catch(fail)
  })

})