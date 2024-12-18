import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  categoryInit,
  categoryModelName,
} from 'src/infras/repository/category/dto';
import PostgresCategoryRepository from 'src/infras/repository/category/repo';
import { CategoryHttpService } from 'src/infras/transport/category/category-http.service';
import { CategoryUseCase } from 'src/usecase/category';

function setupCategoryRouter(sequelize: Sequelize) {
  categoryInit(sequelize);
  const router = Router();
  const categoryRepository = new PostgresCategoryRepository(
    sequelize,
    categoryModelName
  );
  const categoryUseCase = new CategoryUseCase(categoryRepository);
  const categoryHttpService = new CategoryHttpService(categoryUseCase);
  router.get('/categories', categoryHttpService.listCategory.bind(categoryHttpService))
  router.get('/categories/:id', categoryHttpService.getCategory.bind(categoryHttpService))
  router.post(
    '/categories',
    categoryHttpService.createNewCategory.bind(categoryHttpService)
  );
  router.put('/categories/:id', categoryHttpService.updateCategory.bind(categoryHttpService))
  router.delete('/categories/:id', categoryHttpService.deleteCategory.bind(categoryHttpService))
  return router;
}

export default setupCategoryRouter;
