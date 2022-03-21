const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const PATH = './talker.json';

const {
  validatePassword,
  validateEmail,
  validateTalk,
  validateAge,
  validateToken,
  validateName,
  validateRate,
  validateDate,
} = require('./middlewares/validations');

const { writeData, readData, deleteTalker } = require('./middlewares/writeTalker');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const randomToken = () => {
  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/38622545#38622545?newreg=a117ccafb2a74aa5a24c6a225f0a613e
  const eightDigitToken = Math.random().toString(36).substring(2, 10);
  const token = eightDigitToken + eightDigitToken;
  return token;
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkerBuffer = await fs.readFile(PATH, 'utf-8');
  const talkerJson = JSON.parse(talkerBuffer);
  if (talkerJson.length === 0) {
    return res.status(HTTP_OK_STATUS).json([]);
  }

  return res.status(HTTP_OK_STATUS).json(talkerJson);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkerBuffer = await fs.readFile(PATH, 'utf-8');
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

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await readData(PATH);
  const newTalkers = talkers.filter((tal) => tal.id !== Number(id));
  await deleteTalker(PATH, newTalkers);
  res.status(204).send(newTalkers);
});

app.post('/talker', validateToken,
  validateTalk,
  validateAge,
  validateName,
  validateRate,
  validateDate, async (req, res) => {
    const newTalker = { ...req.body };
    const talkers = await readData(PATH);
    const talkerId = {
      id: talkers.length + 1,
      ...newTalker,
     };
    await writeData(PATH, talkerId);
    return res.status(201).json(talkerId);
  });

app.listen(PORT, () => {
  console.log('Online');
});
