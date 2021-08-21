const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
mongoose.connect('mongodb+srv://mperkins808:57Bfield57@cluster0.yymy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
//Server url
//https://quiet-plains-44536.herokuapp.com/
//MONGOOSE RELATED CODE
const iServerDBSchema = mongoose.Schema(
    {   _id:Number,
        country: {type: String,
            required:true},
        fname: {type: String,
            required:true},
        lname: {type: String,
            required:true},
        email:{type: String,
            trim:true,
            lowercase:true,
            validate(value){
                if (!validator.isEmail(value)){
                    throw new Error('Email Not Valid')
                }
            }},
        password:{type: String,
            required:true,
            minlength:8},
        confirmPassword:{type: String,
            required:true,},
        address1: {type: String,
            required:true},
        address2: {type: String,
            required:false},
        city: {type: String,
            required:true},
        state: {type: String,
            required:true},
        zipcode: {type: String,
            required:false},
        phoneNumber: {type: String,
            required:false},
    }
)
const iServiceDB = new mongoose.model('iServiceDB', iServerDBSchema)

//EXPRESS RELATED CODE
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/html/index.html")
})
app.post('/', (req, res) => {
        const salt = bcrypt.genSaltSync(10)
        var infoCheck = false
        //Extracts a random id to assign
        const _id = Math.floor(Math.random() * 1000000)
        const country = req.body.country
        const fname = req.body.first_name
        const lname = req.body.last_name
        const passwordHash = bcrypt.hashSync(String(req.body.password), salt)
        const confirmPasswordHash = bcrypt.hashSync(String(req.body.confirmPassword), salt)
        const email = req.body.email
        const address1 = req.body.address1
        const address2 = req.body.address2
        const city = req.body.city
        const state = req.body.state
        const zipcode = req.body.zipcode
        const phoneNumber = req.body.phoneNumber
        if (passwordHash != confirmPasswordHash && confirmPasswordHash != null)
        {
        infoCheck = true
        }

    //Executes when clicking the signup button from the signup page
    if (req.body.signup == 1)
    {
        //Switching to the signup page
        res.sendFile(__dirname + "/public/html/signup.html")
    }
    //Executes when clicking the login button from the signup page
    else if (req.body.login == 2)
    {
        const emailLogin = req.body.emailLogin
        const passwordLogin = req.body.passwordLogin
        iServiceDB.findOne({ email : emailLogin}, (err, docs) => {
            //Query was empty
            if (err) 
            {
                console.log("Query was empty")
            }
            //Handles the results of the query
            else if (docs != null)
            {
                if (bcrypt.compareSync(passwordLogin, docs.password))
                {
                    res.sendFile(__dirname + "/public/html/custtask.html")
                } 
                else
                {
                    console.log("Password was incorrect")
                }

            }

        })
    }
    //ONLY EXECUTES if on signup page and the signup button is selected
    else if (req.body.signupcommit == 3)
    {
        console.log("Hash 1: " + passwordHash)
        console.log("Hash 2: " + confirmPasswordHash)
        const dbEntry = new iServiceDB(
            {
                _id:_id,
                country:country,
                fname:fname,
                lname:lname,
                email:email,
                password:passwordHash,
                confirmPassword:confirmPasswordHash,
                address1:address1,
                address2:address2,
                city:city,
                state:state,
                zipcode:zipcode,
                phoneNumber:phoneNumber    
            })
        if (!infoCheck)
        {
        dbEntry.save((err) =>{
        if (err) {
            console.log(err)
            infoCheck = true
        }
        else{
            console.log('Success')
            res.sendFile(__dirname + "/public/html/index.html")
            infoCheck = false;
        }
        })
        }
        else
        {
        res.send("<H1>You did not enter a field correctly</H1>")
        }
    }
    
})
let port = process.env.PORT
if (port == null || port == "")
{
    port = 5000;
}
app.listen(port, (req, res)=> {
    console.log("Server running succesfully")
})