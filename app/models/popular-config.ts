import mongoose, { Schema } from 'mongoose';




export const RecipePopularConfigSchema = new Schema(
    {
        likes: {
            type: Number,
            required: true
        },
        saves: {
            type: Number,
            required: true
        },
        comments: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            required: true
        },
        categories: {
            type: [String],
            required: true
        },
        fully: {
            type: Number,
            required: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
            required: true
        },




        is_deleted: {
            type: Boolean,
            default: false,
            required: true
        },
        deletedAt: { type: Date }
    },
    {
        timestamps: true,
        collection: 'recipe-popular-config'
    }
)




RecipePopularConfigSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 100 });
// It is possible that there is a “race” error in the code. when the function to 
// cancel object deletion is executed at the moment when the database deleted the object.

// For this purpose, the timer is set for a longer time, hoping that the user will switch to another object. 

// IT IS IMPORTANT TO FIND A SOLUTION



//Delayed deletion if the user changes their mind or clicks the like button frequently


const RecipePopularConfig = mongoose.models.RecipePopularConfig || mongoose.model('RecipePopularConfig', RecipePopularConfigSchema);
export default RecipePopularConfig;
