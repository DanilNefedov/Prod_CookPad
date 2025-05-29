import mongoose, { Schema } from "mongoose";






const CommentsPopularSchema = new Schema(
    {
        id_comment: {
            type: String,
            required: true
        },
        id_author: {
            type: String,
            required: true
        },
        author_avatar:{
            type: String,
            required: true
        },
        author_name:{
            type: String,
            required: true
        },
        config_id: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        likes_count:{
            type: Number,
            required: true
        },
        // id_parent: {
        //     type: String,
        //     default: null,
        // },
        reply_count:{
            type: Number,
            required: true
        },
    },
    {
        timestamps: true,
        collection: 'comment-popular'
    }
);


const CommentPopular = mongoose.models.CommentPopular || mongoose.model('CommentPopular', CommentsPopularSchema);
export default CommentPopular;