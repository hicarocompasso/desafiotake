const express = require('express');
const { getRepositorios } = require('../controllers/repositorios');

const router = express.Router();


// eslint-disable-next-line no-unused-vars
router.get('/', (_req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/reps', async (req, res) => {
  return getRepositorios(req, res);
});

module.exports = router;
