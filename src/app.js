const express = require("express");
const logger = require("../src/util/logger");
const router = require("../src/controller/severlessRouter");
const app = express();
const PORT = 3000;

app.use(express.json());


app.use("/", router);

//register
app.post("/register", (req, res)=> {
    res.send('reister request successful')
});

//create ticket
app.post("/ticket", (req, res)=> {
    res.send('ticket post request successful')
})

//check pending tickets
app.get("/ticket/status", (req, res) => {
    res.send('pending ticket displayed')
})

//login
app.post("/login", (req, res) => {

})


//update ticket status (approve, or deny)
app.post("/ticket/update", (req, res) => {

})

//view all tickets from specific ID
app.get("/history", (req, res) => {
    
})

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});


