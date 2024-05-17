const mongoose = require('mongoose');

const TransferSchema = mongoose.Schema(
    {
        currentOwner: {
            type: Boolean,
            default: false
        },
        land: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Land',
        },
        cnic: {
            type: String
        },
        name: {
            type: String
        },
        sdw: {
            type: String
        },
        sonOf: {
            type: String
        },
        fatherHusbandName: {
            type: String
        },
        transferDate: {
            type: String
        },
        transferCharges: {
            type: String
        },
        address: {
            type: String
        },
        mobile: {
            type: String
        },
    },
    {
        timestamps: true,
    }
);




const Transfer = mongoose.model('Transfer', TransferSchema);

module.exports = Transfer;
