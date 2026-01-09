import mongoose, { Schema } from 'mongoose';


export const UnitsSchema = new Schema({
  choice: String,
  amount: Number,
  list: [String]
})

export const MediaRecipeSchema = new Schema({
  main: Boolean,
  media_url: {
    type: String,
    required: true
  },
  media_id: {
    type: String,
    required: true
  },
  media_type: {
    type: String,
    required: true
  },
})

const IngredientSchema = new Schema({
  ingredient_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // open_for_link:Boolean,
  media: String,
  units: UnitsSchema,
  check_open_link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredients'
  }
});



const RecipeSchema = new Schema(
  {
    connection_id: {
      type: String,
      required: true
    },
    recipe_id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    time: {
      hours: String,
      minutes: String
    },
    media: [MediaRecipeSchema],
    recipe_type: {
      type: String,
      required: true
    },
    description: String,
    sorting: {
      type: [String],
      required: true
    },
    instruction: String,
    favorite: {
      type: Boolean,
      required: true
    },
    ingredients: {
      type: [IngredientSchema],
      required: true
    },
    recipe_popular_config: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecipePopularConfig'
    },





    is_deleted: {
      type: Boolean,
      default: false,
      required: true
    },
    deletedAt: { type: Date }
  },
  {
    timestamps: true
  }
)



RecipeSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 100 });
// It is possible that there is a “race” error in the code. when the function to 
// cancel object deletion is executed at the moment when the database deleted the object.

// For this purpose, the timer is set for a longer time, hoping that the user will switch to another object. 

// IT IS IMPORTANT TO FIND A SOLUTION



//Delayed deletion if the user changes their mind or clicks the like button frequently




const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
export default Recipe;
