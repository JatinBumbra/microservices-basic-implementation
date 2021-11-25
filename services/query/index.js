const express = require('express');

const app = express();

app.use(express.json());

const posts = {};

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/events', (req, res) => {
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

  res.json({});
});

app.listen(4002, () => {
  console.log('Service:Query running on port 4002');
});
