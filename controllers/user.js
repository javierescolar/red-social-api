var User = require("../models/user");


function pruebas(req,res){
    res.status(200).send({
        message:"acción de pruebas en el servidor desde el controlador"
    });
}


module.exports = {
    pruebas
}
