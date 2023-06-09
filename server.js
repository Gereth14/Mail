require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");
const PORT = 3000;

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended : true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const FirstName = req.body.FN;
    const LastName = req.body.LN;
    const Email = req.body.Email;
    const data = {
        members:[
            {
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: FirstName,
                    LNAME: LastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url ="https://us10.api.mailchimp.com/3.0/lists/" + process.env.listid;
    const options = {
        method: "POST",
        auth: "Gereth:" + process.env.apikeys
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/Fail.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    })
    request.write(jsonData);
    request.end();
    

});

app.listen(process.env.PORT || PORT, function(){
    console.log(`Server is running on: http://localhost:${PORT}`);
});