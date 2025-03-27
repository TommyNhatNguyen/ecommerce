import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  categoryInit,
  categoryModelName,
} from 'src/modules/category/infras/repo/dto';
import PostgresCategoryRepository from 'src/modules/category/infras/repo/repo';
import { CloudinaryImageRepository } from 'src/modules/image/infras/repo/repo';
import { CategoryHttpService } from 'src/modules/category/infras/transport/category-http.service';
import cloudinary from 'src/share/cloudinary';
import { CategoryUseCase } from 'src/modules/category/usecase';

function setupCategoryRouter(sequelize: Sequelize) {
  categoryInit(sequelize);
  const router = Router();
  const categoryRepository = new PostgresCategoryRepository(
    sequelize,
    categoryModelName
  );
  const cloudinaryImageRepository = new CloudinaryImageRepository(cloudinary);
  const categoryUseCase = new CategoryUseCase(
    categoryRepository,
    cloudinaryImageRepository
  );
  const categoryHttpService = new CategoryHttpService(categoryUseCase);
  router.delete(
    '/categories/delete',
    categoryHttpService.bulkDeleteCategory.bind(categoryHttpService)
  );
  router.get(
    '/categories',
    categoryHttpService.listCategory.bind(categoryHttpService)
  );
  router.get(
    '/categories/:id',
    categoryHttpService.getCategory.bind(categoryHttpService)
  );
  router.post(
    '/categories',
    categoryHttpService.createNewCategory.bind(categoryHttpService)
  );
  router.put(
    '/categories/:id',
    categoryHttpService.updateCategory.bind(categoryHttpService)
  );
  router.delete(
    '/categories/:id',
    categoryHttpService.deleteCategory.bind(categoryHttpService)
  );
  return router;
}

export default setupCategoryRouter;
