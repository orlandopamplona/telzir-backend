import 'jest'
const request = require('supertest');

const urlTest: string = (<any>global).urlTest

describe('<<<<<<<<<<< Telzir API - Testing Planos >>>>>>>>>>', () => {

    test('get /planos', () => {
        return request(urlTest)
            .get('/planos')
            .then((response: { status: any; body: { items: any; }; }) => {
                expect(response.status).toBe(200)
                expect(response.body.items).toBeInstanceOf(Array)
            })
            .catch(fail)
    })

    test('get /planos/:id', () => {
        return request(urlTest)
            .post('/localidades')
            .send({
                ddd: '090'
            }).then((responsePlanoOrigem: { body: { _id: any; }; }) => {
                request(urlTest)
                    .post('/localidades')
                    .send({
                        ddd: '095'
                    }).then((responsePlanoDestino: { body: { _id: any; }; }) => {
                        request(urlTest)
                            .post('/planos')
                            .send({
                                origem: responsePlanoOrigem.body._id,
                                destino: responsePlanoDestino.body._id,
                                valor: '1.95'
                            }).then((response: { body: { _id: any; }; }) =>
                                request(urlTest)
                                    .get(`/planos/${response.body._id}`)
                            ).then((responsePlanos: { status: any; body: { valor: any; }; }) => {
                                expect(responsePlanos.status).toBe(200)
                                expect(responsePlanos.body.valor).toBe(1.95)
                            })
                    })
            })
            .catch(fail)
    })


    test('get /planos/invalidId - id not found', () => {
        return request(urlTest)
            .get('/planos/invalidId')
            .then((response: { status: any; }) => {
                expect(response.status).toBe(404)
            })
            .catch(fail)
    })

    test('post /planos', () => {
        return request(urlTest)
            .post('/localidades')
            .send({
                ddd: '080'
            }).then((responsePlanoOrigem: { body: { _id: any; }; }) => {
                request(urlTest)
                    .post('/localidades')
                    .send({
                        ddd: '085'
                    }).then((responsePlanoDestino: { body: { _id: any; }; }) => {
                        request(urlTest)
                            .post('/planos')
                            .send({
                                origem: responsePlanoOrigem.body._id,
                                destino: responsePlanoDestino.body._id,
                                valor: '1.85'
                            }).then((response: { body: { _id: any; origem: any; destino: any; valor: any; }; }) => {
                                expect(response.body._id).toBeDefined()
                                expect(response.body.origem).toBe(responsePlanoOrigem.body._id)
                                expect(response.body.destino).toBe(responsePlanoDestino.body._id)
                                expect(response.body.valor).toBe(1.85)
                            })
                    })
            })
            .catch(fail)
    })

    test('post /planos - required field', () => {
        return request(urlTest)
            .post('/planos')
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

    test('patch /planos/:id', () => {
        return request(urlTest)
            .post('/localidades')
            .send({
                ddd: '070'
            }).then((responsePlanoOrigem: { body: { _id: any; }; }) => {
                request(urlTest)
                    .post('/localidades')
                    .send({
                        ddd: '075'
                    }).then((responsePlanoDestino: { body: { _id: any; }; }) => {
                        request(urlTest)
                            .post('/planos')
                            .send({
                                origem: responsePlanoOrigem.body._id,
                                destino: responsePlanoDestino.body._id,
                                valor: '1.95'
                            }).then((response: { body: { _id: any; }; }) => {
                                request(urlTest)
                                    .patch(`/planos/${response.body._id}`)
                                    .send({
                                        valor: '1.96'
                                    }).then((response: { status: any; body: { _id: any; origem: any; destino: any; valor: any; }; }) => {
                                        expect(response.status).toBe(200)
                                        expect(response.body._id).toBeDefined()
                                        expect(response.body.origem).toBe(responsePlanoOrigem.body._id)
                                        expect(response.body.destino).toBe(responsePlanoDestino.body._id)
                                        expect(response.body.valor).toBe(1.96)
                                    })
                            })
                    })
            }).catch(fail)
    })

    test('patch /planos/invalidId - id not found', () => {
        return request(urlTest)
            .patch('/planos/invalidId')
            .then((response: { status: any; }) => {
                expect(response.status).toBe(404)
            })
            .catch(fail)
    })

    test('delete /planos:/id', () => {
        return request(urlTest)
            .post('/localidades')
            .send({
                ddd: '050'
            }).then((responsePlanoOrigem: { body: { _id: any; }; }) => {
                request(urlTest)
                    .post('/localidades')
                    .send({
                        ddd: '051'
                    }).then((responsePlanoDestino: { body: { _id: any; }; }) => {
                        request(urlTest)
                            .post('/planos')
                            .send({
                                origem: responsePlanoOrigem.body._id,
                                destino: responsePlanoDestino.body._id,
                                valor: '1.55'
                            }).then((response: { body: { _id: any; }; }) =>
                                request(urlTest)
                                    .delete(`/planos/${response.body._id}`)
                            ).then((responsePlanos: { status: any; }) =>
                                expect(responsePlanos.status).toBe(204)
                            )
                    })
            })
            .catch(fail)
    })

    test('delete /planos/invalidId - id not found', () => {
        return request(urlTest)
            .delete(`/planos/invalidId`)
            .then((response: { status: any; }) => {
                expect(response.status).toBe(404)
            }).catch(fail)
    })

    test('get /planos/byorigemdestino/:origem/:destino', () => {
        return request(urlTest)
            .post('/localidades')
            .send({
                ddd: '088'
            }).then((responsePlanoOrigem: { body: { _id: any; }; }) => {
                request(urlTest)
                    .post('/localidades')
                    .send({
                        ddd: '089'
                    }).then((responsePlanoDestino: { body: { _id: any; }; }) => {
                        request(urlTest)
                            .post('/planos')
                            .send({
                                origem: responsePlanoOrigem.body._id,
                                destino: responsePlanoDestino.body._id,
                                valor: '1.90'
                            }).then((responsePlanos: { body: { _id: any; }; }) => {
                                request(urlTest)
                                    .get(`/planos/byorigemdestino/${responsePlanoOrigem.body._id}/${responsePlanoDestino.body._id}`)
                                    .then((response: { status: any; body: { _id: any; }[]; }) => {
                                        expect(response.status).toBe(200)
                                        expect(response.body[0]._id).toBe(responsePlanos.body._id)
                                    })
                            })
                    })
            }).catch(fail)
    })

})