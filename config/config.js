const config = {
  development: {
    port: process.env.PORT,
    dbUrl: process.env.DBURL,
  }
};
module.exports = config[process.env.NODE_ENV];
