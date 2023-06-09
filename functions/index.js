import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { addNewItem, deleteItem, editItem, getAllItems } from './src/bucket.js';
import { login, signup } from './src/users.js';

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
}) 

app.post('/login', login)
app.post('/signup', signup)

app.get('/bucket', getAllItems)
app.post('/bucket', addNewItem)
app.patch('/bucket/:itemId', editItem)
app.delete('/bucket/:itemId', deleteItem)

export const api = functions.https.onRequest(app)
