import mongoose, { Schema } from 'mongoose';



const IngredientsSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        count: {
            type: Number,//BigInt
            required: true
        },
        media:{
            type: String,
            required: false,//check client logic
            default:''
        },
        units: {
            type: [String],
            required: true
        },
        open_for_link: {
            type: Boolean,
            required: true
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
        cat_id: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true
    }
);



// IngredientsSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 86400 }); //24 h
IngredientsSchema.index(
    { deletedAt: 1 },
    { expireAfterSeconds: 0 }
);

// 30 * 24 * 60 * 60 = 30 days


const Ingredients = mongoose.models.Ingredients || mongoose.model('Ingredients', IngredientsSchema);
export default Ingredients;