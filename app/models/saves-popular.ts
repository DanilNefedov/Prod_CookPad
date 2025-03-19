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
    },
    {
        timestamps: true,
        collection: 'save-popular'
    }
);


const SavesPopular = mongoose.models.SavesPopular || mongoose.model('SavesPopular', SavesSchema);
export default SavesPopular;

