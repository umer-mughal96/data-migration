const express = require('express');
const { ocrSpace } = require('ocr-space-api-wrapper');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
const JSONSCHEMA = require('./new.json');
const { createJsonFile } = require('./functions');
const mongoose = require('mongoose');
const { schema, memberInformation, plotInformation, paymentCode, netPrice, receiveAmount, outstandingAmount, bookingAndInstallmants, history, alerts } = require('./utils');
const Table = require('./Table');
const Land = require('./Land');
const Booking = require('./Booking');
const Installment = require('./Installment');
const Alert = require('./Alert');
const Transfer = require('./Transfer');
const app = express();





async function main() {
    mongoose.connect("mongodb+srv://salesforcefreelancing96:169pSRT1smrDi6Wr@cluster0.map59fw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(async () => {
        console.log('Connected to MongoDB');
        try {
            const extarctTableEndpoint = 'https://trigger.extracttable.com';
            const API_KEY = 'yOgAHZ5nljQ8kkjN5avWLlEybJNx836PwvaDSIj6';



            let plotArray = []
            let plotData;
            let registrationNumber;
            const files = fs.readdirSync(__dirname + '/files');
            // for (const file of files) {
            //     try {
            //         // response = await axios.get('https://validator.extracttable.com', {
            //         //     headers: {
            //         //         'x-api-key': API_KEY
            //         //     }
            //         // });
            //         // console.log("🚀 ~ main ~ response:", response.data)
            //         const form = new FormData();
            //         const imageData = fs.readFileSync(__dirname + '/files/' + file);
            //         form.append('input', imageData, { filename: file });
            //         form.append('dup_check', 'False');
            //         console.log("======> SENDING REQUEST TO EXTRACT TABLE FOR   " + file)

            //         response = await axios.post(
            //             extarctTableEndpoint,
            //             form,
            //             {
            //                 headers: {
            //                     ...form.getHeaders(),
            //                     'x-api-key': 'Ud28vy99lusitBefcQ9KeicH52OwPGUS6F3IszSH'
            //                 }
            //             }
            //         );
            //         console.log("=======> REQUEST SUCCEEDED TO EXTRACT TABLE FOR  " + file)
            //         plotData = response.data;
            //         plotData.Lines[0].LinesArray.forEach((line, index) => {
            //             if (line.Line == "Registration No:") {
            //                 registrationNumber = plotData.Lines[0].LinesArray[index + 1].Line;
            //             }
            //         })
            //         Table.create({ registrationNumber, data: plotData })
            //         plotArray.push(plotData)
            //     } catch (error) {
            //         console.log("🚀 ~ main ~ error:", error)

            //     }
            // }
            // return;

            let res = await Table.find({});
            for (const plot of res) {
                plotArray.push(plot.data)
            }

            for (const plot of plotArray) {
                const processSchema = { ...plot };

                const gatherData = (table) => {
                    if (table.TableJson['0']['0'] == "Registration No:") {
                        memberInformation(table.TableJson);
                    }
                    if (table.TableJson['0']['0'] == "Block Name:") {
                        plotInformation(table.TableJson);

                    }
                    if (table.TableJson['0']['0'] == "Payment Code:") {
                        paymentCode(table.TableJson);

                    }
                    // if (table.TableJson['0']['0'] == "Net Price :") {
                    //     netPrice(table.TableJson);

                    // }
                    // if (table.TableJson['0']['0'] == "Receive Amount :") {
                    //     receiveAmount(table.TableJson);

                    // }
                    // if (table.TableJson['0']['0'] == "Outstanding Amt.") {
                    //     outstandingAmount(table.TableJson);

                    // }

                    if (table.TableJson['0']['0'] == "Payment Desc") {
                        bookingAndInstallmants(table.TableJson);

                    }
                    if (table.TableJson['0']['0'] == "Sr.No" || table.TableJson['0']['0'] == "Sr.No.") {
                        history(table.TableJson);

                    }
                    if (table.TableJson['0']['0'] == "Alert No") {
                        alerts(table.TableJson);
                    }


                }

                processSchema.Tables.forEach((table) => {
                    gatherData(table);
                })
                //Gather Missing Data
                let subTotal = {};
                let grandTotal = {};

                let re = /(?:[-+() ]*\d){10,13}/gm;
                processSchema.Lines[0].LinesArray.forEach((line, index) => {
                    if (line.Line.includes("Mobile")) {
                        const mobile = processSchema.Lines[0].LinesArray[index].Line.match(re)?.map(function (s) { return s.trim(); });
                        if (mobile?.length > 0) {
                            schema.mobile = mobile[0];
                        }
                    }
                    if (line.Line.includes("Net Price :") || line.Line.includes("Price :")) {
                        console.log("netpppppprice", processSchema.Lines[0].LinesArray[index + 1].Line)
                        schema.netPrice = processSchema.Lines[0].LinesArray[index + 1].Line;
                    }
                    if (line.Line.includes("Receive Amount :")) {
                        schema.receiveAmount = processSchema.Lines[0].LinesArray[index + 1].Line;
                    }
                    if (line.Line.includes("Outstanding Amt.")) {
                        schema.outstandingAmount = processSchema.Lines[0].LinesArray[index + 1].Line;
                    }
                    if (line.Line.includes("PDC Amount :")) {
                        schema.pdcAmount = processSchema.Lines[0].LinesArray[index + 1].Line;
                    }
                    if (line.Line.includes("Hold Amount :")) {
                        schema.holdAmount = processSchema.Lines[0].LinesArray[index + 1].Line;
                    }
                    if (line.Line.includes("Over Due Amt:")) {
                        schema.overDueAmount = processSchema.Lines[0].LinesArray[index + 1].Line;
                    }
                    if (line.Line.includes("Total Received:")) {
                        schema.totalReceived = processSchema.Lines[0].LinesArray[index + 1].Line;
                    }
                    if (line.Line.includes('Sub Total =>>') || line.Line.includes('Sub Total')) {

                        subTotal.dueAmount = processSchema.Lines[0].LinesArray[index + 1].Line;
                        subTotal.receieveAmount = processSchema.Lines[0].LinesArray[index + 3].Line;
                        subTotal.adjustmentAmount = processSchema.Lines[0].LinesArray[index + 5].Line;
                        schema.summary.subTotal = subTotal;
                    }
                    if (line.Line.includes('Grand Total =>>') || line.Line.includes('Grand Total')) {

                        grandTotal.dueAmount = processSchema.Lines[0].LinesArray[index + 1].Line;
                        grandTotal.receieveAmount = processSchema.Lines[0].LinesArray[index + 3].Line;
                        grandTotal.adjustmentAmount = processSchema.Lines[0].LinesArray[index + 5].Line;
                        schema.summary.grandTotal = grandTotal;
                    }
                })
                let bookingIds = [];
                let installmentIds = [];
                let historyIds = [];
                let alertIds = [];

                let land;


                console.log("=======> LOCAL SCHEMA HAS BEEN MADE SUCCESSFULLY")
                console.log("=======> STARTED MAINTAINING DATABASE OF REGISTRATION NUMBER ", schema);
                // return;

                land = await Land.findOne({ registrationNo: plot.registrationNumber });

                if (!land) {
                    land = await Land.create({ ...schema, subTotal: schema.summary.subTotal, grandTotal: schema.summary.grandTotal });
                }
                if (schema.cnic) {
                    await Transfer.create({ ...schema, land: land._id, currentOwner: true });// This Could Be Optional
                }
                if (schema.summary.payment.length > 0) {
                    for (const booking of schema.summary.payment) {
                        const bookin = await Booking.create({ ...booking, land: land._id });
                        bookingIds.push(bookin._id);
                    }
                }
                if (schema.summary.installments.length > 0) {
                    for (const inst of schema.summary.installments) {

                        const installment = await Installment.create({ ...inst, land: land._id })
                        installmentIds.push(installment._id);
                    }
                }
                if (schema.history.length > 0) {
                    for (const hist of schema.history) {
                        const history = await Transfer.create({ ...hist, land: land._id })
                        historyIds.push(history._id);
                    }
                }
                if (schema.alert.length > 0) {
                    for (const al of schema.alert) {
                        const alert = await Alert.create({ ...al, land: land._id })
                        alertIds.push(alert._id);
                    }
                }
                land.installments = installmentIds;
                land.bookings = bookingIds;
                land.alerts = alertIds;
                land.histories = historyIds;
                console.log("🚀 ~ main ~ land:", land);
                await land.save();
                console.log("=======> ENDED OF REGISTRATION NUMBER   ", land.registrationNo);


                schema.registrationNo = "";
                schema.cnic = "";
                schema.name = "";
                schema.sonOf = "";
                schema.address = "";
                schema.blockName = "";
                schema.houseNo = "";
                schema.plotNo = "";
                schema.dimension = "";
                schema.type = "";
                schema.paymentCode = "";
                schema.streetNo = "";
                schema.categoryAndSize = "";
                schema.bookingDate = "";
                schema.netPrice = "";
                schema.pdcAmount = "";
                schema.totalReceived = "";
                schema.receiveAmount = "";
                schema.holdAmount = "";
                schema.outstandingAmount = "";
                schema.overDueAmount = "";
                schema.mobile = "";
                schema.history = [];
                schema.alert = [];
                schema.summary.payment = [];
                schema.summary.installments = [];
                schema.summary.subTotal = {};
                schema.summary.grandTotal = {};

            }


        } catch (error) {
            console.log("🚀 ~ main ~ error:", error)

        }
    })
        .catch((err) => {
            console.log("🚀 ~ .catccch ~ err:", err)

        })

}

main();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
