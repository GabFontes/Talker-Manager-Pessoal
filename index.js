const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

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

app.listen(PORT, () => {
  console.log('Online');
});
