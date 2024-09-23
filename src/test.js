const { scanUserID } = require("./repository/serverlessDAO");
const { createEmployee } = require("./service/serverlessService");

let key = {
    "userID":"initialID",
    "passWord": "123123213"
}

console.log(JSON.stringify(scanUserID(key.userID)));

if(scanUserID(key.userID)) {
    console.log(true);
} else if(!scanUserID(key.userID)) 
    return console.log(JSON.stringify(scanUserID(key.userID)));

