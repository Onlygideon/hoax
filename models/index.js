const dbConfig = require("../config/dbConfig.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected to hoax database...");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./productModel.js")(sequelize, DataTypes);
db.ratings = require("./ratingModel.js")(sequelize, DataTypes);
db.comments = require("./commentModel.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync done!");
});

// One to Many relation between product, rating and comment table
db.products.hasMany(db.ratings, {
  foreignKey: "product_id",
  as: "rating",
});

db.products.hasMany(db.comments, {
  foreignKey: "product_id",
  as: "comment",
});

db.ratings.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "product",
});

db.comments.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "product",
});

module.exports = db;
