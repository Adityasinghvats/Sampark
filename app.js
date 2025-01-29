import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {Server} from 'socket.io'

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')))

const server = app.listen(PORT, () => {
    console.log(`Chat server running at ${PORT}`);
})

const io = new Server(server);

let socketsConnected = new Set();
io.on('connection', onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on("disconnect", ()=> {
        console.log(`Socket disconected ${socket.id}`);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}
