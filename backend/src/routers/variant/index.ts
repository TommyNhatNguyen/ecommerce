import { Sequelize } from 'sequelize';
import { VariantUseCase } from 'src/usecase/variant';
import { PostgresVariantRepository } from 'src/infras/repository/variant/repo';
import { Router } from 'express';
import { VariantHttpService } from 'src/infras/transport/variant/variant-http.service';
import {
  variantInit,
  variantModelName,
} from 'src/infras/repository/variant/dto';

export function setupVariantRouter(sequelize: Sequelize) {
  variantInit(sequelize);
  const variantRepository = new PostgresVariantRepository(
    sequelize,
    variantModelName
  );
  const variantUseCase = new VariantUseCase(variantRepository);
  const variantHttpService = new VariantHttpService(variantUseCase);
  const router = Router();
  router.get('/variants/:id', variantHttpService.getVariantById.bind(variantHttpService));
  router.get('/variants', variantHttpService.listVariant.bind(variantHttpService));
  router.post('/variants', variantHttpService.createVariant.bind(variantHttpService));
  router.put('/variants/:id', variantHttpService.updateVariant.bind(variantHttpService));
  router.delete('/variants/:id', variantHttpService.deleteVariant.bind(variantHttpService));
  return router;
}
