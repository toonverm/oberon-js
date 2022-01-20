import WebSocket from 'ws';

import express from "express";
import http from "http";

const app = express();
const host = 'localhost';
const port = 3000;
import {WebSocketServer} from 'ws';
import {GuitarPlayer} from "./guitarPlayer";
import {map, merge, Subject} from "rxjs";
import {Orchestra} from "./Orchestra";

app.use(express.static('assets'))

const wss = new WebSocketServer({
    noServer: true,
});

const orchestra = new Orchestra();
const gp =new GuitarPlayer();
wss.on('connection', function connection(ws) {
        // orchestra.getMusic()
        // orchestra.getMusic()
        gp.playSong(["a","b"])
        .subscribe(n =>
            ws.send(n)
        );
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
});

app.get("/play", (req,res) =>  {
    orchestra.play()
    res.send("play")
})
app.get("/stop", (req,res) =>  {
    orchestra.stop()
    res.send("stop")
})

const httpServer = app.listen(port,
    () => {
        console.log(`server is running on http://localhost:${port}`);
    });

httpServer.on("upgrade", (req, socket, head) => {
    console.log("handling upgrade");
    wss.handleUpgrade(req, socket, head, socket => {
        wss.emit('connection', socket, req);
    })
})
