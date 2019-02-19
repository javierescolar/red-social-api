
const ENV = require('./environment');
const mongoose = require('mongoose');
const app = require("./app");

mongoose.connect('mongodb://localhost:27017/red-social',{useNewUrlParser:true})
    .then(()=>{
        console.log("Conexión a DB red social realizado correctamente");
        //creación del servidor
        app.listen(ENV.PORT,()=>{
            console.log('Servidor corriendo en http://localhost'+ENV.PORT)
        });
    }).catch(err=> console.log(err));

