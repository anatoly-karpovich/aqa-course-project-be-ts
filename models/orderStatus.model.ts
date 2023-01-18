import mongoose from "mongoose";

const orderStatus = new mongoose.Schema( {
    order_status: {type: String, unique: true, required: true}
})

export default mongoose.model('OrderStatus', orderStatus)