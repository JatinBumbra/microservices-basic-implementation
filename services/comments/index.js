const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());

app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.json(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  try {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const postId = req.params.id;

    const comments = commentsByPostId[postId] || [];
    comments.push({ id: commentId, content, status: 'pending' });

    commentsByPostId[postId] = comments;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        postId,
        content,
        status: 'pending',
      },
    });

    res.status(201).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.post('/events', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'CommentModerated') {
      const { postId, id, status, content } = data;
      const comment = commentsByPostId[postId].find((com) => com.id === id);
      comment.status = status;

      await axios.post('http://localhost:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          postId,
          status,
          content,
        },
      });
    }

    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(4001, () => {
  console.log('Service:Comments running on port 4001');
});
