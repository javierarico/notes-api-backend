//const http = require('http');
const express = require('express'); 
const app = express();
const logger = require('./loggerMiddleware');
const cors = require('cors');

/*const logger = (request, response, next) => {
    console.log(request.method);
    console.log(request.path);
    console.log(request.body);
    next();
};*/

app.use(cors());
app.use(express.json());
app.use(logger);

let notes = [
    {
        'id': 1,
        'content': 'Me tengo que suscribir a @midudev en YouTube y Twitch',
        'date': '2019-05-30T17:30:31.098Z',
        'important': true
    },
    {
        'id': 2,
        'content': 'Tengo que estudiar las clases del FullStack Bootcamp',
        'date': '2019-05-30T18:39:34.091Z',
        'important': false
    },
    {
        'id': 3,
        'content': 'Repasar los retos de JS de midudev',
        'date': '2019-05-30T19:20:14.298Z',
        'important': true
    }
];

/*const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
})*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (request, response) => {
    response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    //console.log({id})
    //response.send(id)
    //console.log({note})
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
});

app.post('/api/notes', (request, response) => {
    const note = request.body;
    //console.log(note)

    if (!note || !note.content) {
        return response.status(400).json({
            error: 'note.content is missing'
        });
    }

    const ids = notes.map(note => note.id);
    const maxId = Math.max(...ids);

    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false,
        date: new Date().toISOString()
    };

    notes = [...notes, newNote];

    response.status(201).json(newNote);
});

app.use((request, response) => {
    console.log(request.path);
    response.status(404).json({
        error: 'Not found'
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
