import mongoose, { Schema } from 'mongoose';


export const UnitsSchema = new Schema({
  choice: String,
  amount:Number,
  list: [String]
})

export const MediaRecipeSchema = new Schema({
  main:Boolean,
  media_url:{
    type:String,
    required: true 
  },
  media_id:{
    type:String,
    required: true 
  },
  media_type:{
    type:String,
    required: true 
  },
})

const IngredientSchema = new Schema({
  ingredient_id: {
    type:String,
    required: true 
  },
  name:{
    type:String,
    required: true 
  },
  // open_for_link:Boolean,
  media:String,
  units: UnitsSchema,
  check_open_link:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ingredients'
  }
});



const RecipeSchema = new Schema(
  {
    connection_id: {
      type:String,
      required: true 
    },
    recipe_id:{
      type:String,
      required: true 
    },
    name:{
      type:String,
      required: true
    },
    time:{
      hours:String, 
      minutes:String
    },
    media:[MediaRecipeSchema],
    recipe_type:{
      type:String,
      required: true 
    },
    description:String,
    sorting:{
      type:[String],
      required:true
    },
    instruction:String,
    favorite:{
      type:Boolean,
      required:true
    },
    ingredients:{
      type:[IngredientSchema],
      required:true
    },
    recipe_popular_config:{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'RecipePopularConfig' 
    }
  },
  {
    timestamps:true
  }
)


const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
export default Recipe;
