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
  // router.get('/categories', listCategoriesApi)
  // router.get('/categories/:id', getCategoryByIdApi)
  router.post(
    '/categories',
    categoryHttpService.createNewCategory.bind(categoryHttpService)
  );
  // router.put('/categories/:id', updateCategoryApi)
  // router.delete('/categories/:id', deleteCategoryApi)
  return router;
}

export default setupCategoryRouter;
