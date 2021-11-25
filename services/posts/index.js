const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());

app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: posts[id],
  });

  res.status(201).json(posts[id]);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  console.log(type, data);
});

app.listen(4000, () => {
  console.log('Running on port 4000');
});
