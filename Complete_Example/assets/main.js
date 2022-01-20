window.onload = () => {
    document.getElementById("notes");


    const ws = new WebSocket("ws://localhost:3000");
    ws.onopen = () => {
        console.log("websocket opened");
        ws.send("message", "hallo toon ")
    }
    ws.onclose = () => {
        console.log("socket closed")
    }
    ws.onmessage = (e) => {
        console.log(e.data);
        document.getElementById("notes").innerHTML += "-" + e.data+"</br>";
    }
}