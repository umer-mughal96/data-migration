const mongoose = require('mongoose');

const InstallmentSchema = mongoose.Schema(
    {
        land: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Land',
        },
        installmentNo: {
            type: String
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




const Installment = mongoose.model('Installment', InstallmentSchema);

module.exports = Installment;
