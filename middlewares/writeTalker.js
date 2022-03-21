const fs = require('fs').promises;

const readData = async (path) => {
  const talkerBuffer = await fs.readFile(path, 'utf-8');
  return JSON.parse(talkerBuffer);
};

const writeData = async (path, newTalker) => {
  const talkers = await readData(path);
  talkers.push(newTalker);
  await fs.writeFile(path, JSON.stringify(talkers), (error) => {
    if (error) {
      console.log('Pane nos sistema', error);
      return;
    }
    console.log('Talkers atualizados');
  });
};

const rewriteJson = async (path, filteredTalkers) => {
  await fs.writeFile(path, JSON.stringify(filteredTalkers), (error) => {
    if (error) {
      console.log('Pane nos sistema', error);
      return;
    }
    console.log('Talker removido');
  });
};

module.exports = {
  writeData, readData, rewriteJson,
};