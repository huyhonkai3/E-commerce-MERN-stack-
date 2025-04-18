const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const MyConstants = require('./MyConstants');

// Tạo chuỗi kết nối
const uri = 'mongodb+srv://' + MyConstants.DB_USER + ':' + MyConstants.DB_PASS + '@' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE;

// Kết nối đến MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE);
    })
    .catch((err) => {
        console.error(err);
    });

module.exports = {
    connection: mongoose.connection, // Kết nối chính tới MongoDB
    sessionStore: MongoStore.create({ mongoUrl: uri }) // Lưu trữ session
};