const serverlessDAO = require('../repository/serverlessDAO')
const uuid = require('uuid');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = require("../util/key")


async function createEmployee(item){
    
    const saltRounds = 10;
    let encryptPassword = await bcrypt.hash(item.passWord, saltRounds);
    let scanData = await serverlessDAO.scanUserID(item.userID);
    if(validatelogin(item) && !scanData){
        let data = await serverlessDAO.postUser({
            userID: item.userID,
            passWord: encryptPassword,
            employeeStatus: 'employee',
            id: uuid.v4()
        });
        return data;
    }
    return null;
};

async function createTicket(item, userID) {
    if(validateTicket(item)) {
        let data = await serverlessDAO.postTicket({
           ...item,
           status: 'pending',  
           Index: uuid.v4(),
           userID: userID
        });
        return data;
    } 
    return null;
}

async function loginCred(item) {
    let databased = await serverlessDAO.scanUserID(item.userID);
    if(item.userID != databased.userID || !(await bcrypt.compare(item.passWord, databased.passWord))) {
        return false;
    } else {
        const token = jwt.sign(
            {
                id: databased.id,
                userID: databased.userID,
                employeeStatus: databased.employeeStatus
            },
            secretKey,
            {
                expiresIn: "240m", 
            }
        );

        return token;
    }

}

async function viewAllPending(){
    let data = await serverlessDAO.scanTicketStatus();
    return data;
}

async function changeStatus(item) {
    if(await serverlessDAO.getTicketById(item) == "pending") {
        let data = await serverlessDAO.updateTicketStatus(item)
        return data;
    }else return null
     
}

async function viewTicketHistroy(item) {
    let data = await serverlessDAO.scanTicketByID(item.userID);
    return data;
}

async function decodeJWT(token){
    try{
        const user = await jwt.verify(token, secretKey)
        return user;
    }catch(err){
        console.error(err);
    }
}


function validatelogin(item){
    return (item.userID && item.passWord);
}

function validateTicket(item){
    return (item.price && item.description);
}


module.exports = {
    createEmployee,
    createTicket,
    viewAllPending,
    loginCred,
    decodeJWT,
    changeStatus,
    viewTicketHistroy
}