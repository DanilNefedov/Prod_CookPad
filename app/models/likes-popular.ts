import mongoose, { Schema } from "mongoose";




const LikesPopularSchema = new Schema(
    {
        user_id: {
            type: String,
            required: true
        },
        config_id: {
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
        collection: 'likes-popular'
    }
);

LikesPopularSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 3 }); 

const LikesPopular = mongoose.models.LikesPopular || mongoose.model('LikesPopular', LikesPopularSchema);
export default LikesPopular;

