import { Sequelize } from 'sequelize';
import { VariantUseCase } from 'src/modules/variant/usecase';
import { Router } from 'express';
import {
  variantInit,
  variantModelName,
  variantOptionValueInit,
  variantOptionValueModelName,
} from 'src/modules/variant/infras/repo/postgres/dto';

import { VariantHttpService } from 'src/modules/variant/infras/transport/variant-http.service';
import { PostgresVariantRepository } from 'src/modules/variant/infras/repo/postgres/repo';
export function setupVariantRouter(sequelize: Sequelize) {
  variantInit(sequelize);
  variantOptionValueInit(sequelize);
  const variantRepository = new PostgresVariantRepository(
    sequelize,
    variantModelName
  );
  const variantOptionValueRepository = new PostgresVariantRepository(
    sequelize,
    variantOptionValueModelName
  );
  const variantUseCase = new VariantUseCase(variantRepository, variantOptionValueRepository);
  const variantHttpService = new VariantHttpService(variantUseCase);
  const router = Router();
  router.get(
    '/variants/:id',
    variantHttpService.getVariantById.bind(variantHttpService)
  );
  router.get(
    '/variants',
    variantHttpService.listVariant.bind(variantHttpService)
  );
  router.post(
    '/variants',
    variantHttpService.createVariant.bind(variantHttpService)
  );
  router.put(
    '/variants/:id',
    variantHttpService.updateVariant.bind(variantHttpService)
  );
  router.delete(
    '/variants/:id',
    variantHttpService.deleteVariant.bind(variantHttpService)
  );
  return router;
}
