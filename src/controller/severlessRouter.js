const express = require("express");
const router = express.Router();

const serverlessService = require("../service/serverlessService");

router.post("/register", async (req, res) => {
    const data = await serverlessService.createEmployee(req.body);
    if(data){
        res.status(201).json({message: `Created Item ${JSON.stringify(req.body)}`});
    }else{
        res.status(400).json({message: "Was not created, username already exist or username, password can not be empty", receivedData: req.body});
    }
});

router.post("/login", async (req, res)=> {
    const data = await serverlessService.loginCred(req.body);
    if(data == false) {
        res.status(401).json({message: "Invalid Credentials"}); 
    } else {
        res.json(data);
    }
})

router.post("/ticket", async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        res.status(401).json({message: "Unauthorized Access"});
    } else {
        const user = await serverlessService.decodeJWT(token);
        req.user = user;
        const data = await serverlessService.createTicket(req.body, user.userID);
        if(data){
             res.status(201).json({message: `Create ticket ${JSON.stringify(req.body)}`});
        }else {
            res.status(400).json({message: "is not created, price or description missing", receivedData: req.body});
        }
    }
});

router.get("/ticket/status", async (req, res) => {
    const data = await serverlessService.viewAllPending();
    res.status(201).json(data);
})



router.post("/ticket/update", async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        res.status(401).json({message: "Unauthorized Access"});
    }else{
        const user = await serverlessService.decodeJWT(token);
        if (user.employeeStatus !== "manager"){
            res.status(403).json({message: "Forbidden Access"});
        } else {
        req.user = user;
        const data = await serverlessService.changeStatus(req.body);
        console.log(data);
            if(!data) {
                res.status(400).json({message:"It is not pending status"});
            } else {
                res.status(200).json({message: "update successful"});
            }
        }
        

    }
    
})

router.get("/history", async (req, res) =>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token){
        res.status(401).json({message: "Unauthorized Access"});
    } else {
        const user = await serverlessService.decodeJWT(token);
        req.user = user;
        const data = await serverlessService.viewTicketHistroy(user);
        res.status(201).json(data);
    }
})

module.exports = router;
