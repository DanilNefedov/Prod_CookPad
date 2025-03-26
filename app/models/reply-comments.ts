import mongoose, { Schema } from 'mongoose';




const ReplyCommentSchema = new Schema(
    {
        id_comment: {
            type: String,
            required: true
        },
        id_author: {
            type: String,
            required: true
        },
        id_branch: {
            type: String,
            required: true
        },
        
        author_avatar: String,

        author_name: {
            type: String,
            required: true
        },
        id_parent: {
            type: String,
            required: true
        },

        name_parent: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        },
        likes_count: {
            type: Number,
            required: true
        },
        // id_parent: {
        //     type: String,
        //     default: null,
        // },
        // answer_count:Number
    },
    {
        timestamps: true,
        collection: 'reply-comment'
    }
);



const ReplyComment = mongoose.models.ReplyComment || mongoose.model('ReplyComment', ReplyCommentSchema);
export default ReplyComment;