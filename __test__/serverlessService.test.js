const severlessService = require("../src/service/serverlessService");
const severlessDAO = require("../src/repository/serverlessDAO")


describe("Testing user registeration", () => {
    beforeEach(()=> {
        jest.clearAllMocks()
    })
    
    test("summit a userInfo and complete registeration", async() => {

        //registration sucessful
        const submitUserInfo = {
            userID:"user5",
            passWord:"pass5"
        };

        let sucessfulResult = await severlessService.createEmployee(submitUserInfo);
        expect(sucessfulResult).toBeTruthy();

    })

    test("submit a missing userID when register", async() => {

        //register with missing ID
        const missingID = {
            userID: "",
            passWord: "pass12"
        };

        let missingIdResult = await severlessService.createEmployee(missingID);
        expect(missingIdResult).toBeFalsy();
    }) 

    test("submit a missing PassWord when register", async() => {
        
        //register with missing passWord
        const missingPassword = {
            userID: "randomUser",
            passWord: ""
        }

        let missingPasswordResult = await severlessService.createEmployee(missingPassword);
        expect(missingPasswordResult).toBeFalsy();
    })
    
    test("submit a already existing userID when regsiter", async() => {
        //register with already existingID
        const existingID = {
            userID: "user1",
            passWord: "pass1"
        }

        let existingIdResult = await severlessService.createEmployee(existingID);
        expect(existingIdResult).toBeFalsy();
    })

})

describe("submitting ticket", () => {
    beforeEach(()=> {
        jest.clearAllMocks()
    }) 

    test("submit a ticket sucessfully", async() => {
        //submitting right information
        const userID = "user2";
        const goodTicket = {
            price: "3.00",
            description: "This is a example"
        }
        
        let goodCreatedTicket = await severlessService.createTicket(goodTicket, userID);
        expect(goodCreatedTicket).toBeTruthy();
    })

    test("missing a price section", async() => {
        //submitting without price
        const userID = "user2";
        const missingPrice = {
            price: "",
            description: "This is a example"
        }

        let missingPriceTicket = await severlessService.createTicket(missingPrice, userID);
        expect(missingPriceTicket).toBeFalsy();
    })

    test("missing a description section", async() =>{
        //submitting without description
        const userID = "user2";
        const missingDescription = {
            price: "3.00",
            description: ""
        }

        let missingDescriptionTicket = await severlessService.createTicket(missingDescription, userID);
        expect(missingDescriptionTicket).toBeFalsy();
    })
})

    describe("login credential test", () => {
        beforeEach(()=> {
            jest.clearAllMocks()
        }) 
        //successfully login
        test("Good credential", async() =>{

            let rightLogin = {
                userID:"user1",
                passWord:"pass1",
            }
            
            let successfulLogin = await severlessService.loginCred(rightLogin);
            expect(successfulLogin).toBeTruthy();
        })
        //No such userID
        test("ID do not exist", async() =>{
           
            let wrongId = {
                userID:"noSuchID",
                Password:"pass1",
            }

            let badIdLogin = await severlessService.loginCred(wrongId);
            expect(badIdLogin).toBeFalsy();
        })


        //wrong passWord
        test("Password do not match", async() =>{
            
            let wrongPassword = {
                userID: "user1",
                passWord: "wrongPassword"
            }
            let badPasswordLogin = await severlessService.loginCred(wrongPassword);
            expect(badPasswordLogin).toBeFalsy();

        })

    })    

