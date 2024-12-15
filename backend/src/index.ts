import express from 'express';
import { config } from 'dotenv';
import { sequelize } from 'src/share/sequelize';
import { setupProductRouter } from 'src/routers/product';
import setupCategoryRouter from 'src/routers/category';
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
app.use('/v1', setupCategoryRouter(sequelize))
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
