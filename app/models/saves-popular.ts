import mongoose, { Schema } from "mongoose";







const SavesSchema = new Schema(
    {
        user_id:{
            type: String,
            required: true
        },
        config_id:{
            type: String,
            required: true
        },
        is_deleted:{
            type: Boolean,
            default: false,
            required: true
        },
        deletedAt: { type: Date }
    },
    {
        timestamps: true,
        collection: 'saves-popular'
    }
);

SavesSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 100 }); 
// It is possible that there is a “race” error in the code. when the function to 
// cancel object deletion is executed at the moment when the database deleted the object.

// For this purpose, the timer is set for a longer time, hoping that the user will switch to another object. 

// IT IS IMPORTANT TO FIND A SOLUTION



//Delayed deletion if the user changes their mind or clicks the like button frequently

//Delayed deletion if the user changes their mind or clicks the like button frequently

const SavesPopular = mongoose.models.SavesPopular || mongoose.model('SavesPopular', SavesSchema);
export default SavesPopular;

