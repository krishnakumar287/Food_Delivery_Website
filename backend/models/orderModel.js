import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId:{type:String, required: true},
    items:{type:Array, required: true},
    amount:{type:Number, required: true},
    address:{type:Object, required: true},
    status:{type:String, default:"Food Processing"},
    date:{type:Date, default:Date.now()},
    payment:{type:Boolean, default:false},
    trackingHistory:[{
        status: {type: String},
        timestamp: {type: Date, default: Date.now}
    }]
}, { timestamps: true })

// Add a pre-save hook to update the tracking history when status changes
orderSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('status')) {
        this.trackingHistory.push({
            status: this.status,
            timestamp: new Date()
        });
    }
    next();
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

export default orderModel;
