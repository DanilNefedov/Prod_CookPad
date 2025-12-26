import mongoose, { Schema } from "mongoose";






const CategorySchema = new Schema(
    {
        name:{
            type: String,
            required: true
        },
        slug:{
            type: String,
            required: true
        },
        popularity:{
            type: Number,
            required: true
        },
       
    },
    {
        timestamps: true,
    }
) 


const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export default Category;