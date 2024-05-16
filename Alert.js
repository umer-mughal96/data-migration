const mongoose = require('mongoose');

const AlertSchema = mongoose.Schema(
    {
        land: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Land',
        },
        narration: {
            type: String
        },
        postBy: {
            type: String
        },
        postingDate: {
            type: String
        },
    },
    {
        timestamps: true,
    }
);




const Alert = mongoose.model('Alert', AlertSchema);

module.exports = Alert;
