var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mysql       = require('mysql'),
    cors        = require('cors'),
    bcrypt      = require('bcrypt'),
    crypto      =require('crypto'),
    morgan      = require('morgan');

var conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"manager"
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.post("/app/user",function(req,res)
{
    var username=req.body.username;
    var password=req.body.password;
    if(username.length==0||password.length==0)
    {
        res.send({status:'Failed'});
    }
    else
    {
        // console.log(username+"  "+password);
        bcrypt.hash(password,10).then(function(hash) 
        {
            var sql="insert into users (username,password) values (\""+username+"\",\""+hash+"\")";
            // console.log(sql);
            conn.query(sql,function(err,resp)
            {
                if(err)
                {
                    console.log(err);
                    res.send({status:'Failed'});
                }
                else
                {
                    console.log("User Created !!");
                    res.send({status:'account created'});
                }
            });  
        });
    }
});
app.post("/app/user/auth",function(req,res)
{
    var username=req.body.username;
    var password=req.body.password;
    if(username.length==0||password.length==0)
    {
        res.send({status:'Failed'});
    }
    else
    {
        var dbpass="";
        conn.query("select * from users where username =\""+username+"\"",function(err,result)
        {
            if(err)
            {
                console.log(err);
                res.send({status:'Failed'});
            }
            else
            {
                if(result.length==0)
                {
                    res.send({status:'No user found'});
                }
                else
                {
                    // console.log(result[0].password);
                    hash=result[0].password;
                    bcrypt.compare(password,hash).then(function(resultc) 
                    {
                        // console.log(resultc);
                        if(resultc)
                        {
                            res.send({status:"success",userID:result[0].id});
                        }
                        else
                        {
                            res.send({status:'Failed'});
                        }
                    });
                }
            }
        });
    }
});
app.post("/app/sites",function(req,res)
{
    var userID=req.query.user;
    var webiste=req.body.website;
    var username=req.body.username;
    var password=req.body.password;
    if(username.length==0||password.length==0||webiste.length==0)
    {
        res.send({status:'Failed'});
    }
    else
    {
        conn.query("select * from users where id="+userID,function(err,result1)
        {
            if(err)
            {
                console.log(err)
                res.send({status:'Failed'});
            }
            else
            {
                if(result1.length==0)
                {
                    res.send({status:'Failed User Does Not Exist'});
                }
                else
                {
                    var mykey = crypto.createCipher('aes-128-cbc','Rusty is a good dog');
                    var cpass=mykey.update(password,'utf8', 'hex');
                    cpass+=mykey.final('hex');
                    var sql="insert into data values ("+userID+",\""+webiste+"\","+"\""+username+"\","+"\""+cpass+"\")";
                    conn.query(sql,function(err,result2)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            res.send({status:'success'});
                        }
                    });
                }
            }
        });
    }
});
app.get("/app/sites/list",function(req,res)
{
    var userID=req.query.user;
    conn.query("select website,username,password from data where id="+userID,function(err,result)
    {
        if(result.length==0)
        {
            res.send({status:'Failed'});
        }
        else
        {
            var promise = new Promise(function(resolve, reject) { 
                var temp="";
                for(var i=0;i<result.length;i++)
                {
                    var deskey = crypto.createDecipher('aes-128-cbc', 'Rusty is a good dog');
                    temp=deskey.update(result[i]["password"],'hex','utf8');
                    temp+=deskey.final('utf-8');
                    // console.log(temp);
                    result[i]["password"]=temp;
                    temp="";
                }
                resolve();
              }); 
              promise. 
                  then(function () 
                  { 
                      res.send(result);
                  }). 
                  catch(function ()
                   { 
                      console.log('Some error has occured'); 
                      res.send({status:'Failed'});
                  }); 
        }
    });
});
app.listen(3000,function()
{
    console.log("The Password Manager Started!");
});