const socket = io();

const saveNote = (title, description) => {
  socket.emit("client:newnote", {
    title,
    description,
  });
};

const deleteNote = (id) => {
  socket.emit("client:deletenote", id);
};

const updateNote = (id, title, description) => {
  socket.emit("client:updatenote", { id, title, description });
};

const getNote = (id) => {
  socket.emit("client:getnote", id);
};

socket.on("server:newnote", appendNote);

socket.on("server:loadnotes", renderNotes);

socket.on("server:selectednote", (note) => {
  const title = document.querySelector("#title");
  const description = document.querySelector("#description");

  title.value = note.title;
  description.value = note.description;
  savedId = note.id;
});
