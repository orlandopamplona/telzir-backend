import mongoose from 'mongoose'

/**
 * @description Interface that establishes the Produto document structure.
*/
export interface Produto extends mongoose.Document {
    descricao: string,
    minutos: number,
    acrescimo: number
}

const produtoSchema = new mongoose.Schema({
    descricao: {
        type: String,
        required: true
    },
    minutos: {
        type: Number,
        required: true
    },
    acrescimo: {
        type: Number,
        required: true
    }
})

export const Produto = mongoose.model<Produto>('Produto', produtoSchema)