import express from 'express';
import { config } from 'dotenv';
import { sequelize } from 'src/share/sequelize';
import { setupProductRouter } from 'src/routers/product';
import setupCategoryRouter from 'src/routers/category';
import {
  categoryModelName,
  CategoryPersistence,
} from 'src/infras/repository/category/dto';
import {
  productCategoryModelName,
  productDiscountModelName,
  productModelName,
  ProductPersistence,
} from 'src/infras/repository/product/dto';
import { setupDiscountRouter } from 'src/routers/discount';
import {
  discountModelName,
  DiscountPersistence,
} from 'src/infras/repository/discount/dto';
config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use('/v1', setupProductRouter(sequelize));
app.use('/v1', setupCategoryRouter(sequelize));
app.use('/v1', setupDiscountRouter(sequelize));

ProductPersistence.belongsToMany(CategoryPersistence, {
  through: productCategoryModelName,
  foreignKey: 'product_id',
  otherKey: 'category_id',
  as: categoryModelName.toLowerCase(),
});

CategoryPersistence.belongsToMany(ProductPersistence, {
  through: productCategoryModelName,
  foreignKey: 'category_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

ProductPersistence.belongsToMany(DiscountPersistence, {
  through: productDiscountModelName,
  foreignKey: 'product_id',
  otherKey: 'discount_id',
  as: discountModelName.toLowerCase(),
});

DiscountPersistence.belongsToMany(ProductPersistence, {
  through: productDiscountModelName,
  foreignKey: 'discount_id',
  otherKey: 'product_id',
  as: productModelName.toLowerCase(),
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
