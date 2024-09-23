const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommand,
    ScanCommand
} = require("@aws-sdk/lib-dynamodb")
const logger = require("../util/logger")
const client = new DynamoDBClient({region: "us-east-2"});

const documentClient = DynamoDBDocumentClient.from(client);


async function postUser(Item) {
    const command = new PutCommand({
        TableName: "loginTable",
        Item
    });
    try{
        const data = await documentClient.send(command);
        logger.info(`PUT command to database complete ${JSON.stringify(data)}`);
        return data;
    }catch(err){
        console.error(err);
    }

}


async function scanUserID(userID){
    const command = new ScanCommand({
        TableName: "loginTable",
        FilterExpression: "#u = :u",
        ExpressionAttributeNames: {
            "#u": "userID"
        },	
        ExpressionAttributeValues: {
            ":u": userID
        }
    })
    try{
        const data = await documentClient.send(command);
        return data.Items[0];
    }catch(err){
        console.error(err);
    }
}

async function scanTicketByID(userID){
    const command = new ScanCommand({
        TableName: "Ticket_Table",
        FilterExpression: "#u = :u",
        ExpressionAttributeNames: {
            "#u": "userID"
        },	
        ExpressionAttributeValues: {
            ":u": userID
        }
    })
    try{
        const data = await documentClient.send(command);
        return data.Items;
    }catch(err){
        console.error(err);
    }
}

async function scanTicketStatus() {
    const command = new ScanCommand({
        TableName: "Ticket_Table",
        FilterExpression: "#t = :t",
        ExpressionAttributeNames: {
            "#t": "status"
        },
        ExpressionAttributeValues: {
            ":t": "pending"
        }
    })

    try{
        const data = await documentClient.send(command);
        return data.Items;
    }catch(err){
        console.error(err);
    }
} 

async function updateTicketStatus(item) {
    const command = new UpdateCommand({
        TableName: "Ticket_Table",
        Key: {
            "Index": item.Index,
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
             "#status": "status"
        },
        ExpressionAttributeValues: {
            ":status": item.status
        },
        ReturnValues: "ALL_NEW"
    });

    try{
        const data = await documentClient.send(command);
        return data;
    }catch(err){
        console.error(err);
    }
}

async function getTicketById(item){
    const command = new QueryCommand({
        TableName: "Ticket_Table",
        KeyConditionExpression: "#Index = :Index",
        ExpressionAttributeNames: {"#Index": "Index"},
        ExpressionAttributeValues: {":Index": item.Index}
    });

    try{
        const data = await documentClient.send(command);
        return data.Items[0].status;
    }catch(err){
        logger.error(err);
    }
};

async function postTicket(Item) {
    const command = new PutCommand({
        TableName:'Ticket_Table',
        Item
    });
    try{
        const data = await documentClient.send(command);
        logger.info(`PUT command to database complete ${JSON.stringify(data)}`);
        return data;
    } catch(err) {
        logger.error(err);
    }
}

async function getAllTicket(){
    const command = new ScanCommand({
        TableName: 'Ticket_Table'
    });

    try{
        const data = await documentClient.send(command);
        return data.Items;
    }catch(err){
        logger.error(err);
    }
}


module.exports = {
    postUser,
    getTicketById,
    getAllTicket,
    postTicket,
    scanUserID,
    scanTicketStatus,
    updateTicketStatus,
    scanTicketByID
}