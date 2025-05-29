import mongoose, { Schema } from 'mongoose';



const IngredientsSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        count: {
            type: BigInt,
            required: true
        },
        units: {
            type: [String],
            required: true
        },
        open_for_link: {
            type: Boolean,
            required: true
        },
        deletedAt: {
            type: Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true
    }
);

IngredientsSchema.pre('save', function (next) {
    // if (!this.isModified('count')) {
    //     return next();
    // }
    if (this.count <= 1) {
        this.deletedAt = new Date();
    } else {
        this.deletedAt = null;
    }

    next();
});



// IngredientsSchema.pre('save', function (next) {
//     if (!this.isModified('open_for_link')) {
//         return next();
//     }
//     if (this.open_for_link === false) {
//         this.deletedAt = new Date();
//     } else {
//         this.deletedAt = null;
//     }

//     next();
// });


IngredientsSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 86400 }); //24 h

// 30 * 24 * 60 * 60 = 30 days


const Ingredients = mongoose.models.Ingredients || mongoose.model('Ingredients', IngredientsSchema);
export default Ingredients;