// define a express router here
import express from 'express';

const pingRouter = express.Router();

pingRouter.get('/ping', (req, res) => {
  res.send('Pong!');
})

export default pingRouter;