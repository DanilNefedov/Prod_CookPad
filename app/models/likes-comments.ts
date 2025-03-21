import mongoose, { Schema } from 'mongoose';





const LikesCommentsSchema = new Schema(
    {
        id_author: {
            type: String,
            required: true
        },
        id_comment: {
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
        collection: 'likes-comments'
    }
);

LikesCommentsSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 3 }); 


const LikesComments = mongoose.models.LikesComments || mongoose.model('LikesComments', LikesCommentsSchema);
export default LikesComments;