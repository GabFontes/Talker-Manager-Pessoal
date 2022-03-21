const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const {
  validatePassword,
  validateEmail,
  validateTalk,
  validateAge,
  validateToken,
  validateName,
} = require('./middlewares/index');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const randomToken = () => {
  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/38622545#38622545?newreg=a117ccafb2a74aa5a24c6a225f0a613e
  const eightDigitToken = Math.random().toString(36).substr(2, 8);
  const token = eightDigitToken + eightDigitToken;
  return token;
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkerBuffer = await fs.readFile('./talker.json', 'utf-8');
  const talkerJson = JSON.parse(talkerBuffer);
  if (talkerJson.length === 0) {
    return res.status(HTTP_OK_STATUS).json([]);
  }

  return res.status(HTTP_OK_STATUS).json(talkerJson);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkerBuffer = await fs.readFile('./talker.json', 'utf-8');
  const talkerJson = JSON.parse(talkerBuffer);
  const talker = talkerJson.find((obj) => obj.id === +id);
  if (talker) {
    return res.status(HTTP_OK_STATUS).json(talker);
  }

  return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  const token = randomToken();
  return res.status(200).json({ token });
});

app.post('/talker', validateTalk, validateAge, validateToken, validateName, (req, res) => {
  const { id, name, age, talk } = req.body;
  const { watchedAt, rate } = talk;
  return res.status(201).json({
    id,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  });
});

app.listen(PORT, () => {
  console.log('Online');
});
