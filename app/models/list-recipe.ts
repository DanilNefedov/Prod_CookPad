import mongoose, { Schema } from "mongoose";
import { UnitsStateSchema } from "./list";



const IngredientsDataSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        media: {
            type: String,
            default: ''
        },
        shop_ingr: {
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
    }
)

const MediaRecipeSchema = new Schema(
    {
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }
)

const RecipeDataSchema = new Schema(
    {
        recipe_id: {
            type: String,
            required: true
        },
        recipe_name: {
            type: String,
            required: true
        },
        recipe_media: {
            type: MediaRecipeSchema,
            required: true
        },//only main | if we dont have it - first
        recipe_shop: {
            type: Boolean,
            required: true
        },
        ingredients_list: {
            type: [IngredientsDataSchema],
            required: true
        },
        // list: [String]
    }
)

const ListRecipeSchema = new Schema(
    {
        connection_id: {
            type: String,
            required: true
        },
        recipe: {
            type: RecipeDataSchema,
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
        collection: 'list-recipe'
    },
);


ListRecipeSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 100 });
// It is possible that there is a “race” error in the code. when the function to 
// cancel object deletion is executed at the moment when the database deleted the object.

// For this purpose, the timer is set for a longer time, hoping that the user will switch to another object. 

// IT IS IMPORTANT TO FIND A SOLUTION



//Delayed deletion if the user changes their mind or clicks the like button frequently




const ListRecipe = mongoose.models.ListRecipe || mongoose.model('ListRecipe', ListRecipeSchema);

export default ListRecipe;