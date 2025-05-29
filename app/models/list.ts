import mongoose, { Schema } from 'mongoose';

//---------------------------------change constants to one of ingr or list---------------------------------
 export const UnitsStateSchema = new Schema({
    choice:{
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    shop_unit:{
        type: Boolean,
        required: true
    },
   
})


//---------------------------------change constants to one of ingr or list---------------------------------

const ListSchema = new Schema(
    {
        connection_id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        media: { 
            type: String, 
            default: '' 
        },
        shop_ingr:{
            type: Boolean,
            required: true
        },
        units: {
            type: [UnitsStateSchema],
            required: true
        },
        list: {
            type: [String],
            required: true
        },
        
    },
    {
        timestamps: true,
        collection: 'list-ingredients'
    }
);


const ListIngredients = mongoose.models.ListIngredients || mongoose.model('ListIngredients', ListSchema);
export default ListIngredients;



