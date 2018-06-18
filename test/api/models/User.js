const MongooseModelClass = require('mongoose-model-class');
const sha1 = require('sha1');

class User extends MongooseModelClass {
  schema() {
    return {
      firstName: { type: String, require: true },
      lastName: { type: String, require: true },
      email: { type: String, require: true },
      phone: { type: String, require: true },
      username: { type: String, require: true },
      password: { type: String, require: true },
      status: { type: Boolean, default: true },
    };
  }

  beforeSave(doc, next) {
    doc.password = sha1(doc.password);
    next();
  }

  get fullname() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullname(value) {
    const fName = value.split(' ');
    this.firstName = fName[0];
    this.lastName = fName[1];
  }

  static async getById(id) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  disable() {
    return this.model('User').update({ _id: this.id }, { $set: { status: false } });
  }

}

module.exports = User;
