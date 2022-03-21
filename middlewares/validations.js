const INVALID_REQUISITION = 400;
const ERROR_EMAIL = { message: 'O "email" deve ter o formato "email@email.com"' };
const ERROR_EMAIL_REQUIRED = { message: 'O campo "email" é obrigatório' };
const ERROR_PASSWORD_REQUIRED = { message: 'O campo "password" é obrigatório' };
const ERROR_PASSWORD = { message: 'O "password" deve ter pelo menos 6 caracteres' };
const ERROR_TOKEN_NOT_FOUND = { message: 'Token não encontrado' };
const ERROR_INVALID_TOKEN = { message: 'Token inválido' };
const ERROR_NAME_REQUIRED = { message: 'O campo "name" é obrigatório' };
const ERROR_NAME_LENGTH = { message: 'O "name" deve ter pelo menos 3 caracteres' };
const ERROR_AGE_REQUIRED = { message: 'O campo "age" é obrigatório' };
const ERROR_MIN_AGE = { message: 'A pessoa palestrante deve ser maior de idade' };
const ERROR_TALK_REQUIRED = {
  message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
};
const ERROR_INVALID_DATA = {
  message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
};
const ERROR_INVALID_RATE = { message: 'O campo "rate" deve ser um inteiro de 1 à 5' };

const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send(ERROR_TOKEN_NOT_FOUND);
  }
  // Regex tirado do gabarito do course, bloco 22.5;
  const tokenRegex = /^[a-zA-Z0-9]{16}$/;

  const result = tokenRegex.test(token);
  if (!result) {
    return res.status(401).send(ERROR_INVALID_TOKEN);
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(INVALID_REQUISITION).send(ERROR_NAME_REQUIRED);
  }
  if (name.length < 3) {
    return res.status(INVALID_REQUISITION).send(ERROR_NAME_LENGTH);
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age || age.length === 0 || typeof age !== 'number') {
    return res.status(INVALID_REQUISITION).send(ERROR_AGE_REQUIRED);
  }

  if (age < 18) {
    return res.status(INVALID_REQUISITION).send(ERROR_MIN_AGE);
  }
  next();
};

const validateDate = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const regexDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const result = regexDate.test(watchedAt);
  if (!result) {
    return res.status(INVALID_REQUISITION).send(ERROR_INVALID_DATA);
  }
  next();
};

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (rate < 1 || rate > 5) {
    return res.status(INVALID_REQUISITION).send(ERROR_INVALID_RATE);
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || !talk.watchedAt || !talk.rate) {
    return res.status(INVALID_REQUISITION).send(ERROR_TALK_REQUIRED);
  }
  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || email.length === 0) {
    return res.status(INVALID_REQUISITION).send(ERROR_EMAIL_REQUIRED);
  }
  const vEmail = email.split('@');
  const vEmail2 = email.split('.');

  if (vEmail.length !== 2 && vEmail2.length !== 2) {
    return res.status(INVALID_REQUISITION).send(ERROR_EMAIL);
  }
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || password.length === 0) {
    return res.status(INVALID_REQUISITION).send(ERROR_PASSWORD_REQUIRED);
  }

  if (password.length < 6) {
    return res.status(INVALID_REQUISITION).send(ERROR_PASSWORD);
  }
  next();
};

module.exports = {
  validatePassword,
  validateToken,
  validateName,
  validateEmail,
  validateAge,
  validateTalk,
  validateDate,
  validateRate,
};