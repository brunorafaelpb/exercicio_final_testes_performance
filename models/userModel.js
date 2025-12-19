// userModel.js
const bcrypt = require('bcryptjs');

const users = [{
    username: 'João Silva', 
    password: bcrypt.hashSync('4321', 8)
  },
  {
    username: 'Maria Santos', 
    password: bcrypt.hashSync('4321', 8)
  },
  {
    username: 'Pedro Oliveira', 
    password: bcrypt.hashSync('4321', 8)
  },
  {
    username: 'Ana Costa', 
    password: bcrypt.hashSync('4321', 8)
  },
  {
    username: 'Carlos Pereira', 
    password: bcrypt.hashSync('4321', 8)
  },
  {
    username: 'Luana Almeida', 
    password: bcrypt.hashSync('4321', 8)
  },
  {
    username: 'Fernando Rodrigues', 
    password: bcrypt.hashSync('4321', 8)
  },
  {
    username: 'Beatriz Ferreira', 
    password: bcrypt.hashSync('4321', 8)
  }];

module.exports = {
  users,
};
