var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username : {type : String, require : true, maxLength : 100},
        password : {type : String, require : true, maxLength : 100},
        notepad : {type : String}
    }
);

UserSchema
    .virtual("url")
    .get(function() {
        return "/users/" + this._id;
    });

module.exports = mongoose.model("User", UserSchema);