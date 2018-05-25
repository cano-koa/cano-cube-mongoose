const Cube = require('../index.js');
const cano = {
  app: {
    paths: {
      api: `${__dirname}/api`,
      config: `${__dirname}/config`,
    },
  },
};


(async () => {
  const cube = new Cube(cano);
  await cube.prepare();
  await cube.up();
  console.log('cano', cano);
})();
