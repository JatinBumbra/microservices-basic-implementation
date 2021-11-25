const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  }
  if (type === 'CommentCreated') {
    const { id, postId, content } = data;
    posts[postId].comments = [...posts[postId]?.comments, { id, content }];
  }

  res.json({});
});

app.listen(4002, () => {
  console.log('Running on port 4002');
});
