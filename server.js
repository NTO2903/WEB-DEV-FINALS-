const WebSocket = require('ws')
const express = require('express')
const http = require('http')



const server =  http.createServer(express)
const wss = new WebSocket.Server({noServer:true})
const wss2 = new WebSocket.Server({noServer:true})
const CLIENTS = []


function findUser(user_name){
    let target = CLIENTS.find(user => user.name == user_name)
    return target.conn
}

wss.on('connection',(conn)=>{
    console.log('A User Has Logged In')
    conn.on('message',(msg)=>{
        pf = JSON.parse(msg)
        const user = {
            name: pf.name,
            conn: conn
            }
        CLIENTS.push(user)
        
    })
})

wss2.on('connection',(conn)=>{
    wss2.clients.forEach((clients)=>{
        clients.send(JSON.stringify(CLIENTS))
    })
    console.log('User is trading')
    conn.on('message',(msg)=>{
        let message = JSON.parse(msg)
        let target = findUser(message.reciever)
        target.send(JSON.stringify(message))
        
        
    })
    
})

server.on('upgrade',(req,socket,head)=>{
    dir = req.url
    if(dir == '/login'){
        wss.handleUpgrade(req,socket,head,(conn)=>{
            wss.emit('connection',conn,req)
        })
    }
    else if(dir == '/trade'){
        wss2.handleUpgrade(req,socket,head,(conn)=>{
            wss2.emit('connection',conn,req)
        })
    }

})

server.listen(8080,()=>{
    console.log('Server is running')
})