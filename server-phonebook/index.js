const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const app = express()
app.use(cors());
app.use(express.json())
app.use(express.static('build'))

// Portin kuuntelu
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Jos requesti on post, tulostetaan pyynnön runko
// En saanut tähän ratkaisua, joka tulostaisi tiedot yhdellä rivillä 
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(req.body);
  }
  next();
});

//Tinyn käyttö
app.use(morgan('tiny'));

// Testataan onnistuuko hakeminen
app.get('/', (req, res) => {
  res.send('<h1>Welcome to a mediocre Phonebook API</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Näytetään taulukon tiedot ja date
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for  ${persons.length} people </p>
  <p>(as of ${new Date()} )</p>`)
})

// Etsitään findIndexin avulla henkilö taulukosta
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const index = persons.findIndex(person => person.id === id);

  if (index !== -1) {
    response.json(persons[index]);
  } else {
    response.status(404).send({ error: 'No such person' });
  }
});

// Kontaktin poistaminen
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

// ID:n arpominen
const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

// Uuden kontaktin luominen arvotulla ID:llä
class Person {
  constructor(name, number) {
    this.name = name;
    this.number = number;
    this.id = generateId();
  }
}

// Post-pyyntö tiedoille
app.post('/api/persons', (request, response) => {
  const body = request.body;

  // Nimen ja numeron puuttuminen
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number missing'
    });
  }

    // Nimen yksilöllisyys
    if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({ 
        error: 'Name must be unique' 
      });
    }

  const person = new Person(body.name, body.number);

  persons = persons.concat(person);

  response.json(person);
});

// Taulukko kontakteille
let persons = [
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Markku Vaara",
    "number": "012 202 4034",
    "id": 5
  },
  {
    "name": "Mika Häkkinen",
    "number": "101",
    "id": 8
  }
]
