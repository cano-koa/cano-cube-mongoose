const MongooseModelClass = require('mongoose-model-class');

class Article extends MongooseModelClass {
  schema() {
    return {
      name: { type: String, require: true },
      autor: { type: String, require: true },
      editorial: { type: String, require: true },
      date: { type: Date, require: true },
      status: { type: Boolean, default: true },
    };
  }

  static async getById(id) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  get store () {
    return 'articles';
  }

}

module.exports = Article;