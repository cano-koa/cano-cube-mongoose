const Cube = require('../index.js');
const sha1 = require('sha1');

const cano = {
  app: {
    paths: {
      api: `${__dirname}/api`,
      config: `${__dirname}/config`,
    },
  },
};

describe('Cube Mongoose test', () => {

  let docUser, docArticle;

  it('Should create document for User model', async () => {
    docUser = await User.create({
      firstName: 'Jon',
      lastName: 'Snow',
      email: 'jon.snow@gmail.com',
      phone: '+00 000000000',
      username: 'jonsnow',
      password: 'King of the Nort',
    });
    if (!(docUser.password === sha1('King of the Nort'))) {
      throw new Error('Password is not convert to sha1');
    }
  });

  it('Should create document for Article model', async () => {
    docArticle = await Article.create({
      name: "A Song of Ice and Fire",
      autor: "George R. R. Martin",
      editorial: "Bantam Books",
      date: new Date(),
    });
  });

  before(async () => {
    const cube = new Cube(cano);
    await cube.prepare();
    await cube.up();
  })

  after(async () => {
    await User.remove({});
    await Article.remove({});
  })

});
