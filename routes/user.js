

const express = require("express");
const UserController = require("../controllers/user");
var md_auth = require("../middlewares/authenticate");

const api = express.Router();

api.get("/pruebas",md_auth.ensureAuth,UserController.pruebas);
api.post("/register",UserController.saveUser);
api.post("/login",UserController.loginUser);


module.exports = api;