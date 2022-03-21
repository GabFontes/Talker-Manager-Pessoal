const fs = require('fs').promises;

const readData = async (path) => {
  const talkerBuffer = await fs.readFile(path, 'utf-8');
  return JSON.parse(talkerBuffer);
};

const writeData = async (path, newTalker) => {
  const talkers = await readData(path);
  console.log(talkers);
  talkers.push(newTalker);
  console.log(talkers);
  await fs.writeFile(path, JSON.stringify(talkers), (error) => {
    if (error) {
      console.log('Pane nos sistema', error);
      return;
    }
    console.log('Talkers atualizados');
  });
};

module.exports = {
  writeData, readData,
};