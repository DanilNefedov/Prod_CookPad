import mongoose, { Schema } from 'mongoose';



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
    history_links: [HistoryLinksSchema]
  },
  {
    timestamps: true,
    collection: 'cook-history'
  }
);


const CookHistory = mongoose.models.CookHistory || mongoose.model('CookHistory', CookHistorySchema);
export default CookHistory;