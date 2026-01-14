import mongoose, { Query, Schema } from 'mongoose';




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




        is_deleted:{
            type: Boolean,
            default: false,
            required: true
        },
        deletedAt: { type: Date }
    },
    {
        timestamps: true,
        collection: 'reply-comment'
    }
);


ReplyCommentSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 100 }); 
// It is possible that there is a “race” error in the code. when the function to 
// cancel object deletion is executed at the moment when the database deleted the object.

// For this purpose, the timer is set for a longer time, hoping that the user will switch to another object. 

// IT IS IMPORTANT TO FIND A SOLUTION



//Delayed deletion if the user changes their mind or clicks the like button frequently




ReplyCommentSchema.pre<Query<unknown, unknown>>(/^find/, function (next) {
  const opts = this.getOptions() as { withDeleted?: boolean };

  if (!opts.withDeleted) {
    this.where({ is_deleted: false });
  }

  next();
});

//withDeleted - flag. What to get when searching is_deleted: false or is_deleted: true



const ReplyComment = mongoose.models.ReplyComment || mongoose.model('ReplyComment', ReplyCommentSchema);
export default ReplyComment;