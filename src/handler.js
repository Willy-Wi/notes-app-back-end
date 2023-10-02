const { nanoid } = require('nanoid');
const notes = require('./notes');

const getAllNotesHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      notes,
    },
  });

  response.code(200);
  return response;
};

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Note not found',
    });

    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Note found',
    data: {
      note,
    },
  });

  response.code(200);
  return response;
};

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Note Successfully Added',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Note Failed to be Added',
  });

  response.code(500);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Failed to update note',
    });

    response.code(404);
    return response;
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Note has been updated',
  });

  response.code(200);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Note not found',
    });

    response.code(404);
    return response;
  }

  notes.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Note has been successfully deleted',
  });

  response.code(200);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
