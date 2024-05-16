const schema = {
    registrationNo: "",
    cnic: "",
    name: "",
    sonOf: "",
    address: "",
    blockName: "",
    houseNo: "",
    plotNo: "",
    dimension: "",
    type: "",
    paymentCode: "",
    streetNo: "",
    categoryAndSize: "",
    bookingDate: "",
    netPrice: "",
    pdcAmount: "",
    totalReceived: "",
    receiveAmount: "",
    holdAmount: "",
    outstandingAmount: "",
    overDueAmount: "",
    summary: {
        payment: [],
        installments: [
        ],
        subTotal: {
            dueAmount: "",
            rebatAmount: "",
            receieveAmount: "",
            osAmount: "",
            adjustmentAmount: ""
        },
        grandTotal: {
            dueAmount: "",
            rebatAmount: "",
            receieveAmount: "",
            osAmount: "",
            adjustmentAmount: ""
        }
    },
    history: [],
    alert: []

}






const memberInformation = (obj) => {
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(nestedKey => {
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Registration No:") {
                schema.registrationNo = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "CNIC No.") {
                schema.cnic = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Member Name:") {
                schema.name = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "S/O :") {
                schema.sonOf = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Address:") {
                schema.address = obj[key][nestedKey];
            }
        });

    })
}
const plotInformation = (obj) => {
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(nestedKey => {
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Block Name:") {
                schema.blockName = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "HOUSE No.:") {
                schema.houseNo = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "PLOT No.:" || nestedKey == 1 && obj[key][nestedKey - 1] == "No.:") {
                schema.plotNo = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Type:") {
                schema.type = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Dimension:") {
                schema.dimension = obj[key][nestedKey];
            }
        });

    })
}
const paymentCode = (obj) => {
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(nestedKey => {
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Payment Code:") {
                schema.paymentCode = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Street # :") {
                schema.streetNo = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Category & Size:") {
                schema.categoryAndSize = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Booking Date:") {
                schema.bookingDate = obj[key][nestedKey];
            }
        });

    })
}
const netPrice = (obj) => {
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(nestedKey => {
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Net Price :") {
                schema.netPrice = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "PDC Amount :") {
                schema.pdcAmount = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Total Received:") {
                schema.totalReceived = obj[key][nestedKey];
            }
        });

    })
}
const receiveAmount = (obj) => {
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(nestedKey => {
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Receive Amount :") {
                schema.receiveAmount = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Hold Amount :") {
                schema.holdAmount = obj[key][nestedKey];
            }
        });

    })
}
const outstandingAmount = (obj) => {
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(nestedKey => {
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Outstanding Amt.") {
                schema.outstandingAmount = obj[key][nestedKey];
            }
            if (nestedKey == 1 && obj[key][nestedKey - 1] == "Over Due Amt:") {
                schema.overDueAmount = obj[key][nestedKey];
            }
        });

    })
}
let bookingKey = 1;
const bookingAndInstallmants = (obj) => {
    Object.keys(obj).forEach(key => {
        let booking = {};
        let subTotal = {};
        let grandTotal = {};
        let installment = {};

        if (key == bookingKey) {
            booking.dueDate = obj[key]['2']
            booking.dueAmount = obj[key]['4']
            booking.rebatAmount = obj[key]['5']
            booking.receieveAmount = obj[key]['6']
            booking.osAmount = obj[key]['7']
            booking.receipNo = obj[key]['8']
            booking.receiptAmount = obj[key]['9']
            booking.date = obj[key]['10']
            booking.adjustmentAmount = obj[key]['11']
            schema.summary.payment.push(booking);
            if (!obj[+key + 1]['0'] && !obj[+key + 1]['1']) {
                bookingKey += 1;
            }
        }

        if (key > bookingKey) {
            if (parseInt(obj[key]['1'])) {
                installment.installmentNo = obj[key]['1']
                installment.dueDate = obj[key]['2']
                installment.dueAmount = obj[key]['4']
                installment.rebatAmount = obj[key]['5']
                installment.receieveAmount = obj[key]['6']
                installment.osAmount = obj[key]['7']
                installment.receipNo = obj[key]['8']
                installment.receiptAmount = obj[key]['9']
                installment.date = obj[key]['10']
                installment.adjustmentAmount = obj[key]['11']
                schema.summary.installments.push(installment)
            }
        }

        if (obj[key]['1'] == 'Sub Total') {
            subTotal.dueAmount = obj[key]['4']
            subTotal.rebatAmount = obj[key]['5']
            subTotal.receieveAmount = obj[key]['6']
            subTotal.osAmount = obj[key]['7']
            subTotal.adjustmentAmount = obj[key]['11']
            schema.summary.subTotal = subTotal;
        }
        if (obj[key]['1'] == 'Grand Total') {
            grandTotal.dueAmount = obj[key]['4']
            grandTotal.rebatAmount = obj[key]['5']
            grandTotal.receieveAmount = obj[key]['6']
            grandTotal.osAmount = obj[key]['7']
            grandTotal.adjustmentAmount = obj[key]['11']
            schema.summary.grandTotal = grandTotal;
        }


    })
}

const history = (obj) => {
    // console.log("🚀 ~ bookingAndInstallmants ~ obj:", obj)
    Object.keys(obj).forEach(key => {
        let history = {};
        if (key > 0) {
            history.idNo = obj[key]['1']
            history.name = obj[key]['2']
            history.sdw = obj[key]['3']
            history.fatherHusbandName = obj[key]['4']
            history.transferDate = obj[key]['5']
            history.transferCharges = obj[key]['6']
            schema.history.push(history);
        }
    })
}

const alerts = (obj) => {
    // console.log("🚀 ~ bookingAndInstallmants ~ obj:", obj)
    Object.keys(obj).forEach(key => {
        let alert = {};
        if (key > 0) {
            schema.alert.push({ narration: obj[key]['1'], postBy: obj[key]['2'], postingDate: obj[key]['3'] });
        }
    })
}

module.exports = { alerts, history, bookingAndInstallmants, outstandingAmount, receiveAmount, netPrice, paymentCode, plotInformation, memberInformation, schema }