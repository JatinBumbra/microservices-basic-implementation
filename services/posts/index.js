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
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.post('/events', async (req, res) => {
  try {
    const { type, data } = req.body;
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(4000, () => {
  console.log('Service:Posts running on port 4000');
});
