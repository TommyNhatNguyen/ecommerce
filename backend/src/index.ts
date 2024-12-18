import express from 'express';
import { config } from 'dotenv';
import { sequelize } from 'src/share/sequelize';
import { setupProductRouter } from 'src/routers/product';
import setupCategoryRouter from 'src/routers/category';
import { CategoryPersistence } from 'src/infras/repository/category/dto';
import { ProductPersistence } from 'src/infras/repository/product/dto';
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

ProductPersistence.belongsToMany(CategoryPersistence, {
  through: 'products_categories',
  foreignKey: 'product_id',
  otherKey: 'category_id',
});
CategoryPersistence.belongsToMany(ProductPersistence, {
  through: 'products_categories',
  foreignKey: 'category_id',
  otherKey: 'product_id',
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
