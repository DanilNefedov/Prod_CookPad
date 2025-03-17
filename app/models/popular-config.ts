import mongoose, { Schema } from 'mongoose';




export const RecipePopularConfigSchema = new Schema(
    {
        likes:{
            type:Number,
            required: true
        },
        saves:{
            type:Number,
            required: true
        },
        comments:{
            type:Number,
            required: true
        },
        views:{
            type:Number,
            required: true
        },
        categories:{
            type: [String],
            required: true
        },
        fully:{
            type:Number,
            required:true
        },
        creator: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Recipe', 
            required: true 
        }
    },
    {
        timestamps: true,
        collection: 'recipe-popular-config'
    }
)



const RecipePopularConfig = mongoose.models.RecipePopularConfig || mongoose.model('RecipePopularConfig', RecipePopularConfigSchema);
export default RecipePopularConfig;
