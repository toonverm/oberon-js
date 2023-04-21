import express from "express";
import { WebSocketServer } from "ws";
import { GuitarPlayer } from "./guitarPlayer";
import { Orchestra } from "./Orchestra";

const app = express();
const host = "localhost";
const port = 3000;

app.use(express.static("assets"));

const wss = new WebSocketServer({
  noServer: true,
});

const gp = new GuitarPlayer();
const o = new Orchestra();

wss.on("connection", function connection(ws) {
  o.getMusic().subscribe((n) => ws.send(n));
});

app.get("/play", (req, res) => {
  o.play();
  res.send("playing");
});

app.get("/stop", (req, res) => {
  o.stop();
  res.send("stopped");
});

const httpServer = app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});

httpServer.on("upgrade", (req, socket, head) => {
  console.log("handling upgrade");
  wss.handleUpgrade(req, socket, head, (socket) => {
    wss.emit("connection", socket, req);
  });
});
