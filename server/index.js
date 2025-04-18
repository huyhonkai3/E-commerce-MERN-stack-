// CLI : npm install express body - parser --save
const express = require ('express') ;
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
app.listen ( PORT , () => {
    console.log (`Server listening on ${PORT}`) ;
}) ;
// middlewares
const bodyParser = require ('body-parser') ;
const MongooseUtil = require('./utils/MongooseUtil.js');
app.use ( bodyParser.json ({ limit : '10 mb' }) ) ;
app.use ( bodyParser.urlencoded ({ extended : true , limit : '10 mb' }) ) ;

app.use(session({
    secret: 'toang', // Một chuỗi bí mật để mã hóa session
    resave: false,             // Không lưu lại session nếu không thay đổi
    saveUninitialized: true,
    store: MongooseUtil.sessionStore,   // Lưu session mới chưa được khởi tạo
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // Thời gian sống của cookie (1 ngày)
        secure: false // Nếu sử dụng HTTPS, hãy đặt secure: true
    }  
}));

// apis
app.get ('/hello', (req , res ) => {
    res.json ({ message : 'Hello from server!' }) ;
}) ;

app.use ('/api/admin', require('./api/admin.js')) ;

app.use ('/api/customer', require('./api/customer.js')) ;