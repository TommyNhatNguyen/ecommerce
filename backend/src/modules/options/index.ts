import { Sequelize } from 'sequelize';
import { OptionUseCase, OptionValueUseCase } from 'src/modules/options/usecase';
import { Router } from 'express';

import {
  OptionHttpService,
  OptionValueHttpService,
} from 'src/modules/options/infras/transport/option-http.service';
import {
  PostgresOptionRepository,
  PostgresOptionValueRepository,
} from 'src/modules/options/infras/repo/postgres/repo';
import {
  optionsInit,
  optionsModelName,
  optionValueInit,
  optionValueModelName,
} from 'src/modules/options/infras/repo/postgres/dto';
export function setupOptionRouter(sequelize: Sequelize) {
  optionsInit(sequelize);
  const optionRepository = new PostgresOptionRepository(
    sequelize,
    optionsModelName
  );
  const optionValueRepository = new PostgresOptionValueRepository(
    sequelize,
    optionValueModelName
  );
  const optionValueUseCase = new OptionValueUseCase(optionValueRepository);
  const optionUseCase = new OptionUseCase(optionRepository, optionValueUseCase);
  const optionHttpService = new OptionHttpService(optionUseCase);
  const router = Router();
  router.get('/options/all', optionHttpService.getAll.bind(optionHttpService));
  router.get(
    '/options/:id',
    optionHttpService.getOptionById.bind(optionHttpService)
  );
  router.get('/options', optionHttpService.listOption.bind(optionHttpService));
  router.post(
    '/options',
    optionHttpService.createOption.bind(optionHttpService)
  );
  router.put(
    '/options/:id',
    optionHttpService.updateOption.bind(optionHttpService)
  );
  router.delete(
    '/options/:id',
    optionHttpService.deleteOption.bind(optionHttpService)
  );
  return router;
}

export function setupOptionValueRouter(sequelize: Sequelize) {
  optionValueInit(sequelize);
  const optionValueRepository = new PostgresOptionValueRepository(
    sequelize,
    optionValueModelName
  );
  const optionValueUseCase = new OptionValueUseCase(optionValueRepository);
  const optionValueHttpService = new OptionValueHttpService(optionValueUseCase);
  const router = Router();
  router.get(
    '/options-values/:id',
    optionValueHttpService.getOptionValueById.bind(optionValueHttpService)
  );
  router.get(
    '/options-values',
    optionValueHttpService.listOptionValue.bind(optionValueHttpService)
  );
  router.post(
    '/options-values',
    optionValueHttpService.createOptionValue.bind(optionValueHttpService)
  );
  router.put(
    '/options-values/:id',
    optionValueHttpService.updateOptionValue.bind(optionValueHttpService)
  );
  router.delete(
    '/options-values/:id',
    optionValueHttpService.deleteOptionValue.bind(optionValueHttpService)
  );

  return router;
}
