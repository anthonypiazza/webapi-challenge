const express = require('express');

const port = process.env.PORT || 8000;

const server = express();

server.use(express.json());

let people = [ 
    { 
        id: 1, 
        name: "bob the builder" 
    }, 
    { 
        id: 2, 
        name: "felix the cat" 
    },
    { 
        id: 3, 
        name: "jimmy neutron" 
    },
    { 
        id: 4, 
        name: "carl" 
    },
    { 
        id: 5, 
        name: "sheen" 
    }  
]

let chores = [
    {
        id: 1,
        description: 'Take out the trash',
        notes: 'To do before 8pm',
        assignedTo: 2,
        completed: 'true'
    },
    {
        id: 2,
        description: 'Take out the recycling',
        notes: 'To do before 6pm',
        assignedTo: 1,
        completed: 'false'
    },
    {
        id: 3,
        description: 'Do the laundry',
        notes: 'Towels only',
        assignedTo: 3,
        completed: 'false'
    },
];
let nextId = 4;

server.get('/', (req, res) => {
    res.send('Hello Elan, I have finished the sprint!')
})


server.get('/chores', (req, res) => {
    const completed = req.query.filter || 'completed';

    const response = chores.filter(chore => {
        if(chore.completed === completed){
            return chore
        }
    })

    res.status(200).json(response)
})


server.post('/chores', (req, res) => {
    const chore = req.body;
    chore.id = nextId++;

    chores.push(chore);

    res.status(201).json(chores)
})


server.put('/chores/:id', (req, res) => {
    const { id } = req.params
    const chore = chores.find(task => task.id == id)

    if(chore){
        Object.assign(chore, req.body);    
        res.status(201).json(chores)
    }else{
        res.status(400).json({ error: "Couldn't update existing chore" })
    }
})

server.delete('/chores/:id', (req, res) => {
    const { id } = req.params
    const chore = chores.find(task => task.id == id)

    if(chore){
        chores.pop(chore);    
        res.status(201).json(chores)
    }else{
        res.status(400).json({ error: "Couldn't delete existing chore" })
    }
})

server.get('/person/:id/chores', (req,res) => {
    const { id } = req.params;
    const userChores = chores.find(task => task.assignedTo == id)
    const userExists = people.find(user => user.id == id)

    if(userChores){
        res.status(201).json(userChores)
    }else if(userExists){
        res.status(404).json([])
    }else{
        res.status(404).json({ error: "Couldn't fetch user's existing chores" })
    }
})
server.listen(port, () => console.log("Listening on Port 8000"))