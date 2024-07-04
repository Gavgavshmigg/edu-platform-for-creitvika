const express = require('express');
const app = express();
const WSserver = require('express-ws')(app);
const aWss = WSserver.getWss();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

app.use(cors());
app.use(express.json());

app.ws('/', (ws, req) => {
    let id;
    let userId;
    ws.on('message', (msg) => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case "connection":
                id = msg.id;
                userId = msg.userId;
                connectionHandler(ws, msg);
                break;
            case "message":
                connectionHandler(ws, msg);
                break;
            case "draw":
                broadcastConnection(ws, msg);
                break;
            case "answer":
                broadcastConnection(ws, msg);
                break;
            case "disconnection":
                broadcastConnection(ws, msg);
                break;
        }
    });
    ws.on('close', (ws, req) => {
        let msg = {id: id, method: "disconnection", userId: userId};
        broadcastConnection(ws, msg);
    });
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '');
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
        return res.status(200).json({message: "done"});
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: e});
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`));
        const data = 'data:image/png;base64,' + file.toString('base64');
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({error: e});
    }
})

app.listen(PORT, () => console.log(`server started on port ${PORT}`));

const connectionHandler = (ws, msg) => {
    ws.id = msg.id;
    ws.userId = msg.userId
    broadcastConnection(ws, msg);
    aWss.clients.forEach(client => {
        if (client.id === msg.id && client.userId !== msg.userId) {
            let data = {id: client.id, userId: client.userId, method: "online"};
            ws.send(JSON.stringify(data));
        }
    })
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id && client.userId !== msg.userId) {
            client.send(JSON.stringify(msg));
        }
    })
}