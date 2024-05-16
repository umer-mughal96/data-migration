const mongoose = require('mongoose');

const LandSchema = mongoose.Schema(
    {
        registrationNo: {
            type: String,
            unique: true
        },
        blockName: {
            type: String
        },
        houseNo: {
            type: String
        },
        plotNo: {
            type: String
        },
        dimension: {
            type: String
        },
        paymentCode: {
            type: String
        },
        streetNo: {
            type: String
        },
        type: {
            type: String
        },
        bookingDate: {
            type: String
        },
        categoryAndSize: {
            type: String
        },
        netPrice: {
            type: String
        },
        pdcAmount: {
            type: String
        },
        totalReceived: {
            type: String
        },
        receiveAmount: {
            type: String
        },
        outstandingAmount: {
            type: String
        },
        holdAmount: {
            type: String
        },
        overDueAmount: {
            type: String
        },
        bookings: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Booking',
        }],
        installments: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Installment',
        }],
        histories: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'History',
        }],
        alerts: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Alert',
        }],
        subTotal: {
            type: Object
        },
        grandTotal: {
            type: Object
        },
    },
    {
        timestamps: true,
    }
);




const Land = mongoose.model('Land', LandSchema);

module.exports = Land;
