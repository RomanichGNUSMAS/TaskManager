const { default: mongoose } = require("mongoose");
const { userModel } = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { createKey } = require("../utils/jwt");

exports.AuthRepository = class {
    static async signup(rawData){
        const found = await userModel.findOne({ email:rawData.email })
        if(found) return null;
        const user = new userModel({...rawData,password:(await hashPassword(rawData.password))});
        return await user.save();
    }
    
    static async signin(rawData) {
        const found = await userModel.findOne({ email:rawData.email });
        if(!found) return 404;
        const compareResult = await comparePassword(rawData.password,found.password);
        if(!compareResult) return 400;
        return createKey(found.email);
    }
}


