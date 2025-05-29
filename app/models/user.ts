


import mongoose, { Schema } from 'mongoose';



const UserPopularConfigSchema = new Schema(
  {
    history_length_average: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    multiplier: {
      type: [Number],
      required: true
    },
  }
);





const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true
    },
    img: String,
    connection_id: {
      type: String,
      required: true
    },
    popular_config: [UserPopularConfigSchema]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || mongoose.model('User', UserSchema);
export default User;