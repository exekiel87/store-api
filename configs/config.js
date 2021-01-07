if (process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}

const config = {
  NODE_ENV: process.env.NODE_ENV  
};

module.exports = config;
