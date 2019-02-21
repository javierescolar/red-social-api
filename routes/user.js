

const express = require("express");
const UserController = require("../controllers/user");
var md_auth = require("../middlewares/authenticate");

const api = express.Router();

api.get("/pruebas",md_auth.ensureAuth,UserController.pruebas);
api.post("/register",UserController.saveUser);
api.post("/login",UserController.loginUser);
api.get("/user/:id",md_auth.ensureAuth, UserController.getUser);
api.get("/users/:page?",md_auth.ensureAuth, UserController.getUsers);
api.put("/user/:id",md_auth.ensureAuth, UserController.updateUser);


module.exports = api;