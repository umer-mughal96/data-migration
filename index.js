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
const History = require('./History');
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
            for (const file of files) {
                try {
                    // response = await axios.get('https://validator.extracttable.com', {
                    //     headers: {
                    //         'x-api-key': API_KEY
                    //     }
                    // });
                    // console.log("🚀 ~ main ~ response:", response.data)
                    const form = new FormData();
                    const imageData = fs.readFileSync(__dirname + '/files/' + file);
                    form.append('input', imageData, { filename: file });
                    form.append('dup_check', 'False');
                    console.log("======> SENDING REQUEST TO EXTRACT TABLE FOR   " + file)

                    response = await axios.post(
                        extarctTableEndpoint,
                        form,
                        {
                            headers: {
                                ...form.getHeaders(),
                                'x-api-key': 'Ud28vy99lusitBefcQ9KeicH52OwPGUS6F3IszSH'
                            }
                        }
                    );
                    console.log("=======> REQUEST SUCCEEDED TO EXTRACT TABLE FOR  " + file)
                    plotData = response.data;
                    plotData.Lines[0].LinesArray.forEach((line, index) => {
                        if (line.Line == "Registration No:") {
                            plotData.registrationNumber = plotData.Lines[0].LinesArray[index + 1].Line;
                        }
                    })
                    Table.create({ registrationNumber, data: plotData })
                    plotArray.push(plotData)
                } catch (error) {
                    console.log("🚀 ~ main ~ error:", error)

                }
            }
            // return;

            // let {data} = await Table.findOne({ _id: "6645ee0c7c35b04db10cacc2" });
            // plotArray.push(data)


            for (const plot of plotArray) {
                const processSchema = plot;

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
                    if (table.TableJson['0']['0'] == "Net Price :") {
                        netPrice(table.TableJson);

                    }
                    if (table.TableJson['0']['0'] == "Receive Amount :") {
                        receiveAmount(table.TableJson);

                    }
                    if (table.TableJson['0']['0'] == "Outstanding Amt.") {
                        outstandingAmount(table.TableJson);

                    }

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
                let bookingIds = [];
                let installmentIds = [];
                let historyIds = [];
                let alertIds = [];
                let land;
                // console.log("🚀 ~ main ~ response:", schema)
                // const JSONSchema = JSON.stringify(schema);
                // createJsonFile('plot1.json', JSONSchema)
                console.log("=======> LOCAL SCHEMA HAS BEEN MADE SUCCESSFULLY")
                console.log("=======> STARTED MAINTAINING DATABASE OF REGISTRATION NUMBER ", plot.registrationNumber)
                land = await Land.findOne({ registrationNo: plot.registrationNumber })
                if (!land) {
                    land = await Land.create({ ...schema, subTotal: schema.summary.subTotal, grandTotal: schema.summary.grandTotal });
                }
                await History.create({ ...schema, land: land._id, currentOwner: true });
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
                        const history = await History.create({ ...hist, land: land._id })
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
                console.log("=======> ENDED OF REGISTRATION NUMBER   ", land.registrationNo)

            }


        } catch (error) {
            console.error(error);
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
