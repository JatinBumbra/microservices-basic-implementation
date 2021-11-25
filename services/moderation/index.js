const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.post('/events', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
      const status = data.content.includes('orange') ? 'rejected' : 'approved';

      await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          ...data,
          status,
        },
      });
    }

    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(4003, () => {
  console.log('Service:Moderation running on port 4003');
});
