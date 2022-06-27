module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("rating", {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      maxValue: 5,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Rating;
};
