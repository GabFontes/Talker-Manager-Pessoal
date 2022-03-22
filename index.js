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
  validateRateDate,
} = require('./middlewares/validations');

const { writeData, readData, rewriteJson } = require('./middlewares/writeTalker');

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

app.get('/talker/search', validateToken,
  async (req, res) => {
    const { q } = req.query;
    const query = q.toLowerCase();
    const talkers = await readData(PATH);
    const filtered = talkers.filter((tal) => tal.name.toLowerCase().includes(query));
    if (!q) return res.status(200).send(talkers);
    if (!filtered) return res.status(200).send([]);
    return res.status(200).json(filtered);
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

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await readData(PATH);
  const newTalkers = talkers.filter((tal) => tal.id !== Number(id));
  await rewriteJson(PATH, newTalkers);
  return res.status(204).send(newTalkers);
});

app.get('/talker', async (_req, res) => {
  const talkerBuffer = await fs.readFile(PATH, 'utf-8');
  const talkerJson = JSON.parse(talkerBuffer);
  if (talkerJson.length === 0) {
    return res.status(HTTP_OK_STATUS).json([]);
  }

  return res.status(HTTP_OK_STATUS).json(talkerJson);
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  const token = randomToken();
  return res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', validateToken,
  validateTalk,
  validateAge,
  validateName,
  validateRateDate, async (req, res) => {
    const newTalker = { ...req.body };
    const talkers = await readData(PATH);
    const talkerId = {
      id: talkers.length + 1,
      ...newTalker,
    };
    await writeData(PATH, talkerId);
    return res.status(201).json(talkerId);
  });

app.put('/talker/:id', validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateRateDate, async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const talkers = await readData(PATH);
    const targetTalker = talkers.find((tal) => tal.id === Number(id));
    targetTalker.name = name;
    targetTalker.age = age;
    targetTalker.talk = talk;
    const newTalker = [
      ...talkers,
    ];
    await rewriteJson(PATH, newTalker);
    return res.status(HTTP_OK_STATUS).send(targetTalker);
  });

app.listen(PORT, () => {
  console.log('Online');
});
