
const jwt = require("jwt-simple");
const moment = require("moment");
const secret = require("../environment").secret;

exports.ensureAuth = function(req,res,next) {
    if(!req.headers.authorization){
        return res.status(403).send({
            message:"La petición no tiene la cabecerá de autorización"
        })
    }

    var token = req.headers.authorization.replace(/['"]+/g,"");
    try{
        var payload = jwt.decode(token,secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message:"El token ha expirado"
            });
        } 
    } catch(ex){
        return res.status(500).send({
            message:"Error al decodificar token o token no válido"
        });
    }

    req.user = payload;
    next();
}