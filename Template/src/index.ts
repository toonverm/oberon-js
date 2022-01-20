import WebSocket from 'ws';

import express from "express";
import http from "http";
import {WebSocketServer} from 'ws';
import {GuitarPlayer} from "./guitarPlayer";
import {map, merge, Subject} from "rxjs";
import {Orchestra} from "./Orchestra";


const app = express();
const host = 'localhost';
const port = 3000;


app.use(express.static('assets'))

const wss = new WebSocketServer({
    noServer: true,
});

wss.on('connection', function connection(ws) {

});


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
