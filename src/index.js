import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { v4 as uuid } from "uuid";

var notes = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("New Connection: " + socket.id);

  socket.emit("server:loadnotes", notes);

  socket.on("client:newnote", (newNote) => {
    const note = {
      ...newNote,
      id: uuid(),
    };
    notes.push(note);
    io.emit("server:newnote", note);
  });

  socket.on("client:deletenote", (noteId) => {
    notes = notes.filter((note) => note.id !== noteId);
    io.emit("server:loadnotes", notes);
  });

  socket.on("client:getnote", (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    socket.emit("server:selectednote", note);
  });

  socket.on("client:updatenote", (updatedNote) => {
    notes.map((note) => {
      if (note.id === updatedNote.id) {
        note.title = updatedNote.title;
        note.description = updatedNote.description;
      }

      return note;
    });
    io.emit("server:loadnotes", notes);
  });
});

server.listen(3000);

console.log("Server running on http://localhost:3000");
