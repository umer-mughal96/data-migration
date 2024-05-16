const mongoose = require('mongoose');

const HistorySchema = mongoose.Schema(
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
    },
    {
        timestamps: true,
    }
);




const History = mongoose.model('History', HistorySchema);

module.exports = History;
