const mongoose = require('mongoose');

const MemberSchema = mongoose.Schema(
    {
        cnic: {
            type: String
        },
        name: {
            type: String
        },
        sonOf: {
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




const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
