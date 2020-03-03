import mongoose from 'mongoose'
import {Localidade} from '../localidades/localidades.model'

export interface Plano extends mongoose.Document {
    origem: Localidade,
    destino: Localidade,
    valor: number
}

const planoSchema = new mongoose.Schema({
    origem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Localidade',
        required: true
    },
    destino: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Localidade',
        required: true
    },
    valor: {
        type: Number,
        required: true
    }
})

export const Plano = mongoose.model<Plano>('Plano', planoSchema)