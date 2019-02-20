var User = require("../models/user");
const bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");


function pruebas(req,res){
    res.status(200).send({
        message:"acción de pruebas en el servidor desde el controlador"
    });
}

function saveUser(req,res){
    var params= req.body;
    var user = new User();

    if (params.name && params.surname 
        && params.email && params.password 
        && params.nick){

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email.toLowerCase();
        user.role = "USER_ROLE";
        user.image = null;

        User.findOne({$or:[
            {email:user.email},
            {nick:user.nick}
        ]}).exec((err,users)=>{

            if (err) return res.status(500).send({message:"Error al comprobar Usuario"});
            if (users){
                return res.status(200).send({message:"Usuario con email o nick ya existe"});
            } else {
                bcrypt.hash(params.password,null,null,(err,hash)=>{
                    user.password=hash;
        
                    user.save((err,userstore)=>{
                        if (err) return res.status(500).send({message:"Error al guardar Usuario"});
                        if (userstore) {
                            res.status(200).send({
                                message:"Usuario guardado",
                                user:userstore
                            });
                        } else {
                            res.status(404).send({
                                message:"Usuario no registrado"
                            });
                        }
                    });
                });
            }
        });
        
    } else {
        res.status(200).send({
            message:"Envía todos los campos necesarios"
        });
    }
}

function loginUser(req,res){
    var params = req.body,
        email = params.email.toLowerCase(),
        password = params.password;
    User.findOne({email:email}).exec((err,user)=>{
        if (err) return res.status(500).send({message:"Error al Logearse"});
        if (user){

            bcrypt.compare(password,user.password,(err,check)=>{
                if (check){
        
                    if (params.gettoken){
                        //generar y devler el token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    } else {
                        user.password=undefined;
                        res.status(200).send({
                            message:"Usuario Logeado correctemente",
                            user:user
                        });
                    }
                } else {
                    return res.status(500).send({message:"Error al Logearse"});
                }
            });
            
        } else {
            res.status(404).send({
                message:"Usuario no registrado"
            });
        }
    })

}

module.exports = {
    pruebas,
    saveUser,
    loginUser
}
