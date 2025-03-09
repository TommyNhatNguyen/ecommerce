import { brandModelName } from 'src/modules/brand/infras/repo/brand.dto';

import { Router } from 'express';
import { brandInit } from 'src/modules/brand/infras/repo/brand.dto';
import PostgresBrandRepository from 'src/modules/brand/infras/repo/brand.repo';
import BrandHttpService from 'src/modules/brand/infras/transport/brand.http-service';
import BrandUseCase from 'src/modules/brand/usecase';
import { Sequelize } from 'sequelize';

function setupBrandRouter(sequelize: Sequelize) {
  brandInit(sequelize);
  const router = Router();
  const brandRepository = new PostgresBrandRepository(
    sequelize,
    brandModelName
  );
  const brandUseCase = new BrandUseCase(brandRepository);
  const brandHttpService = new BrandHttpService(brandUseCase);
  router.post('/brands', brandHttpService.createBrand.bind(brandHttpService));
  router.put(
    '/brands/:id',
    brandHttpService.updateBrand.bind(brandHttpService)
  );
  router.delete(
    '/brands/:id',
    brandHttpService.deleteBrand.bind(brandHttpService)
  );
  router.get('/brands/:id', brandHttpService.getBrand.bind(brandHttpService));
  router.get('/brands', brandHttpService.listBrand.bind(brandHttpService));
  return router;
}

export default setupBrandRouter;
