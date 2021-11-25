const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const posts = {};

app.get('/posts', (req, res) => {
  res.json(posts);
});

const handleEvent = ({ type, data }) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  }
  if (type === 'CommentCreated') {
    const { id, postId, content, status } = data;
    const comments = [
      ...posts[postId].comments,
      {
        id,
        postId,
        content,
        status,
      },
    ];
    posts[postId].comments = comments;
  }
  if (type === 'CommentUpdated') {
    const { id, postId, status, content } = data;
    const comment = posts[postId]?.comments?.find((com) => com.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.post('/events', (req, res) => {
  try {
    const { type, data } = req.body;

    handleEvent({ type, data });

    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(4002, async () => {
  console.log('Service:Query running on port 4002');

  try {
    const res = await axios.get('http://localhost:4005/events');
    for (let event of res.data) {
      const { type, data } = event;
      handleEvent({ type, data });
    }
  } catch (error) {
    console.error(error);
  }
});
