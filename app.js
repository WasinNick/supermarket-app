const express = require('express');
const path = require('path');
const app = express();

app.set('view engine',"ejs");
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

const PORT = process.env.PORT || 3000 ;
app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});