import mongoose, { Query, Schema } from 'mongoose';



const HistoryLinksSchema = new Schema(
  {
    recipe_id: {
      type: String,
      required: true
    },
    recipe_name: {
      type: String,
      required: true
    }
  }
)

const CookHistorySchema = new Schema(
  {
    connection_id: {
      type: String,
      required: true
    },
    history_links: [HistoryLinksSchema],



    is_deleted: {
      type: Boolean,
      default: false,
      required: true
    },
    deletedAt: { type: Date }
  },

  {
    timestamps: true,
    collection: 'cook-history'
  }
);


CookHistorySchema.index({ deletedAt: 1 }, { expireAfterSeconds: 100 });

CookHistorySchema.pre<Query<any, any>>(/^find/, function (next) {
  const opts = (this as any).options;
  if (opts?.withDeleted) return next();

  this.setQuery({ ...this.getQuery(), is_deleted: false });
  next();
});

// It is possible that there is a “race” error in the code. when the function to 
// cancel object deletion is executed at the moment when the database deleted the object.

// For this purpose, the timer is set for a longer time, hoping that the user will switch to another object. 

// IT IS IMPORTANT TO FIND A SOLUTION



//Delayed deletion if the user changes their mind or clicks the like button frequently

const CookHistory = mongoose.models.CookHistory || mongoose.model('CookHistory', CookHistorySchema);
export default CookHistory;