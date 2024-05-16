const fs = require('fs');


const createJsonFile = (name, data) => {
    fs.writeFileSync(name, data);

}





module.exports = { createJsonFile }