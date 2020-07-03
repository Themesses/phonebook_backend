const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

morgan.token('content', function(req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :content'))
  
// const requestLogger = (request, response, next) => {
//   console.log("Method", request.method);
//   console.log("Path", request.path);
//   console.log("Body", request.body);
//   console.log("-------------");
//   next();
// };

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// app.use(requestLogger);

let persons = [
  {
    name: "arto hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-345456",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`
    <h3>Phonebook has info for ${persons.length} people</h3>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  // console.log(id);
  // response.send(`${id}`)
  const person = persons.find(i => i.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

//TODO: not allowed if name or number missing
//TODO: not allowed if name already exists
//TODO: if true,respond with appropriate status code
//TODO: Send back info that explains the reason for the error
//{ error: 'name must be unique' }
//
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  // console.log(body);
  // console.log(body.name);

  if (persons.find(n => n.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  if (!body.number) {
    return response.status(400).json({ error: "no number provided" });
  }

  if (!body.name) {
    return response.status(400).json({ error: "no name provided" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons = persons.concat(person);

  response.json(person);

  // const maxId = persons.length > 0
  //   ? Math.max(...persons.map(n => n.id))
  //   : 0

  // const person = request.body
  // person.id = maxId + 1
  // console.log(person)

  // persons = persons.concat(person)

  // response.json(person)
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
