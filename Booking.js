const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema(
    {
        land: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Land',
        },
        dueDate: {
            type: String
        },
        dueAmount: {
            type: String
        },
        rebatAmount: {
            type: String
        },
        receiveAmount: {
            type: String
        },
        osAmount: {
            type: String
        },
        receipNo: {
            type: String
        },
        receiptAmount: {
            type: String
        },
        date: {
            type: String
        },
        adjustmentAmount: {
            type: String
        },
    },
    {
        timestamps: true,
    }
);




const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
