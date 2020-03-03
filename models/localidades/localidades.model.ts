import mongoose from 'mongoose'

export interface Localidade extends mongoose.Document {
    ddd: string
}

const localidadeSchema = new mongoose.Schema({
    ddd: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 3
    }
})

export const Localidade = mongoose.model<Localidade>('Localidade', localidadeSchema)