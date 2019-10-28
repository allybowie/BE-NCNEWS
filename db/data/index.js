const ENV = process.env.NODE_ENV || 'development';
const testData = require("./test-data/index");
const developmentData = require("./development-data/index")

const data = {
    test : testData,
    development : developmentData
}

module.exports = data[ENV];