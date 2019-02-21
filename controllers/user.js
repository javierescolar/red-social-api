var User = require("../models/user");
const bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var mongoose_pagination = require("mongoose-pagination");

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
                        //generar y devolver el token
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

function getUser(req,res){
    var id_user = req.params.id;
    User.findById(id_user,(err,user)=>{
        if (err) return res.status(500).send({message:"Error en la petición de usuario"});
        if(!user) return res.status(404).send({message:"Usuario no existe"});
        return res.status(200).send({user});
    });
}


function getUsers(req,res){

    var identity_user_id = req.user.sub;
    var page=1;
    var items_per_page = 3;

    if(req.params.page){
        page = req.params.page;
    }

    User.find().sort("_id").paginate(page,items_per_page,(err,users,total)=>{
        if (err) return res.status(500).send({message:"Error en la petición de usuarios"});
        if(!users) return res.status(404).send({message:"Usuarios no existen"});
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/items_per_page)
        });
    });
}

function updateUser(req,res){
    var id_user = req.params.id;
    var update = req.body;
    delete update.password;

    if(id_user != req.user.sub){
        return res.status(401).send({message:"No tiene permisos para editar otro usuario"}); 
    }

    User.findOneAndUpdate(id_user,update,{new:true},(err,user)=>{
        if (err) return res.status(500).send({message:"Error al actualizar usuario"});
        if(!user) return res.status(404).send({message:"Usuarios no existen o no se ha podido actualizar"});
        return res.status(200).send({
            message:"Usuario actualizado",
            user
        });
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser
}
