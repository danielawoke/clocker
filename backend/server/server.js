const http = require('http');
var mysql = require('mysql');
const crypto = require('crypto');
const { register } = require('module');
const ipAdress = "xxxxxxx"
const user = 'xxxxxxx'
const sqlPass = 'xxxxxxx'
const port = 'xxxxxxx'

const server = http.createServer((req,res) => {
    
    res.setHeader('Access-Control-Allow-Origin','*');
    res.writeHead(200, {'Content-Type':'text/plain'});

    let body = '';

    // Collect data chunks as they arrive

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', async () => {
        //This is a key-based return structure
        //id.info/data
        let key = body.split("~.&~");
        
        if(key[0] == "loadReplyR"){
            let ind = parseInt(key[2]);
            await getHash(key[1], async function(hash){
                if(hash.length > 0){
                    await fetchPostReplies(hash[0].ID, ind, async function(result){
                        res.end(JSON.stringify(result));
                    })
                }
            })
        }
        else if(key[0] == "RegUser"){
            await RegisterUser(key[1],key[2], async function(result){
                res.end(JSON.stringify(result))
            })
        }
        else if(key[0] == "postInfo"){
            await getPostInfo(key[1], async function(result){
                res.end(JSON.stringify(result))
            })
        }
        else if(key[0] == "insertReply"){

            await getHash(key[3], async function(result){
                if(result.length!=0){
                    await insertReply(result[0]["ID"], key[2], key[1], function(){
                        res.end("INSERTED")
                    })
                }else{
                    await getCurrRepIndex(async function(index){
                        currMax = index[0]["ReplyIndex"]
                        await addTable(currMax,key[3],async function(val){
                            await insertReply(currMax, key[2], key[1], function(){
                                res.end("INSERTED")
                            })
                        })
                        // make the table, insert, and update
                    })
                }
            })
            
            
        }
        else if(key[0] == "Log"){
            await fetchLog(key[1], key[2], async function(result){
                console.log(result)
                res.end(JSON.stringify(result));
            })
        }
        else if(key[0] == "loadReplyP"){

            let ind = parseInt(key[2]);
            await getHash(key[1], async function(hash){
                if(hash.length > 0){
                    await fetchPostReplies(hash[0].ID, ind, async function(result){
                        res.end(JSON.stringify(result));
                    })
                }
            })
            
        }
        else if(key[0] == "titleChunk"){
            let arr = [];
            let strt = parseInt(key[1])*5-5;
            
            if(strt>=0){
                console.log(strt)
                console.log(strt+5)
                var waiter = await (fetchPosts(strt, function(result){
                    if(result.length >0 ){
                        res.end(JSON.stringify(result));
                    }else{
                        res.end("none")
                    }
                }));
            }else{
                res.end("none")
            }
            
        }else if(key[0] == "CheckUser"){
            var waiter = await (check(key[1], function(result){
                    res.end(JSON.stringify(result));
            }));
        }else if(key[0] == "hashToUser"){
            var waiter = await (hashToUser(key[1], function(result){
                res.end(JSON.stringify(result));
            }));
        }else if(key[0] == "sumbitPost"){
            var waiter = await (hashToUser(key[3], async function(result){
                await pushPost(key[1], result[0]["username"], key[2], async function(data){
                    // putting the id-table ham
                    let time = data[0]["date"];
                    await getCurrRepIndex(async function(index){
                        currMax = index[0]["ReplyIndex"]
                        let hash = key[1]+"~T*&"+result[0]["username"]+"~T*&"+time
                        await addTable(currMax, hash, async function(val){
                            res.end(hash);
                        })
                        // make the table, insert, and update
                    })
                    
                })
            }));
        }else{
            res.end("NULL")
        }
    });

}).listen(3000,() => {
    console.log("server started\n");
});





async function RegisterUser(username, password, callback){
    let hash = crypto.createHash("sha1").update(username).digest("hex");

    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });

    con.connect(function(err) {
        if (err) throw err;
        
        var str = "insert into `login` (username, password, hash) values (\""+username+"\", \""+password+"\", \""+hash+"\" );";
        console.log(str)
        con.query(str, function (err, result) {
            if (err) throw err
            console.log("USER REGISTERED");
            callback(result)
        });
        con.end();
    });
    
}


async function pushPost(title,author,post,callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        
        var str = "insert into `posts` (author, date, post, title) values (\""+author+"\", NOW(), \""+post+"\", \""+title+"\" );";
        console.log(str)
        con.query(str, function (err, result) {
            if (err) throw err
            console.log("Table created");
        });
    
        var str = "select * from `posts` where  author=\""+author+"\" and  post=\""+post+"\" and title=\""+title+"\";";
        console.log(str)
        con.query(str, function (err, result) {
            if (err) throw err
            console.log("Table created");
            callback(result)
        });
        con.end();
    });
}

async function getPostInfo(hash, callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        let arr = hash.split("~T*&")
        
        var str = "select * from `posts` where title=\""+arr[0]+"\" and date=\""+arr[2]+"\" and author=\""+arr[1]+"\";";
        console.log(str)
        con.query(str, function (err, result) {
            if (err) throw err
            console.log("Table created");
            callback(result)
        });
        con.end();
    });
}
async function addTable(currMax,hash,callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"

    });
    con.connect(function(err) {
        if (err) throw err;
        var str = ["create table `"+currMax+"` (reply LONGTEXT, author TINYTEXT, date VARCHAR(255));","insert into `id-table map` (ID, TableHash) values ("+currMax+", \""+hash+"\");", "DELETE FROM `currtableindex` WHERE ReplyIndex>0;","insert into `currtableindex` (ReplyIndex) values ("+(currMax+1)+");"]
        con.query(str[0], function (err, result) {
            if (err) throw err
            console.log("Table created");
        });
        con.query(str[1], function (err, result) {
            if (err) throw err
            console.log("Table created");
        });
        con.query(str[2], function (err, result) {
            if (err) throw err
            console.log("Table created");
        });
        con.query(str[3], function (err, result) {
            if (err) throw err
            console.log("Table created");
            callback()
        });
        con.end();
    });
}

async function getCurrRepIndex(callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        var str = "select * from currtableindex";
        con.query(str, function (err, result) {
            if (err) throw err
            console.log("Index retrieved");
            callback(result)
        });
        con.end();
    });
}

async function insertReply(tableID, reply, author, callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        var str = "insert into `"+tableID+"` (author, reply, date) values ('"+author+"', '"+reply+"', NOW())";
        con.query(str, function (err, result) {
            if (err) throw err
            console.log("Inserted reply");
            callback()
        });
        con.end();
    });
}

async function fetchLog(username, pass, callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        var str = "select * from `login` where username='"+username+"' and password='"+pass+"'";
        console.log(str)
        con.query(str, function (err, result) {
            if (err) throw err
            callback(result)
        });
        con.end();
    });
}

async function hashToUser(hash, callback){


    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        var str = "select * from `login` where hash=\""+hash+"\";";
        con.query(str, function (err, result) {
            if (err) throw err
            callback(result)
        });
        con.end();
    });
}

async function check(username, callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        var str = "select * from `login` where username='"+username+"'";
        con.query(str, function (err, result) {
            if (err) throw err
            console.log(result)
            callback(result)
        });
        con.end();
    });
}

async function getHash(title, callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        var str = "select ID from `id-table map` where TableHash=\""+title+"\"";
        con.query(str, function (err, result) {
            if (err) throw err
            callback(result)
        });
        con.end();
    });
}


async function fetchPostReplies(title, ind, callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;

        var str = "select * from `"+title+"` order by date DESC limit "+ind+","+(ind+5);
        con.query(str, function (err, result) {
            if (err) throw err;
            callback(result)
        });
        con.end();
    });
}



async function fetchPosts(strt, callback){
    var con = mysql.createConnection({
        host: ipAdress,
        user: user,
        password: sqlPass,
        port:port,
        database: "db"
    });
    con.connect(function(err) {
        if (err) throw err;
        var str = "SELECT * FROM posts order by date DESC limit 8 offset "+strt+";";
        console.log(str)
        con.query(str, function (err, result) {
            if (err) throw err;
            callback(result)
        });
        con.end();
    });
}


