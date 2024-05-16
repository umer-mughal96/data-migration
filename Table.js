const mongoose = require('mongoose');

const tableSchema = mongoose.Schema(
    {
        registrationNumber: {
            type: String
        },
        data: {
            type: Object
        },
    },
    {
        timestamps: true,
    }
);




const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
