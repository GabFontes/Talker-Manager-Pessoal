const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

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

const validateEmail = (email) => {
  if (!email || email.length === 0) {
    return { message: 'O campo "email" é obrigatório' };
  }
    const vEmail = email.split('@');
    const vEmail2 = email.split('.');
    
    if (vEmail.length !== 2 && vEmail2.length !== 2) {
      return { message: 'O "email" deve ter o formato "email@email.com"' };
    }
  return true;
};

const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return { message: 'O campo "password" é obrigatório' };
  }

  if (password.length < 6) {
    return { message: 'O "password" deve ter pelo menos 6 caracteres' };
  }

  return true;
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

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const token = randomToken();

  if (validateEmail(email) !== true) {
    return res.status(400).send(validateEmail(email));
  }
  if (validatePassword(password) !== true) {
    return res.status(400).send(validatePassword(password));
  }
  return res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
