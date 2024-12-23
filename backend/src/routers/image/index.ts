import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { imageInit, imageModelName } from 'src/infras/repository/image/dto';
import { PostgresImageRepository } from 'src/infras/repository/image/repo';
import { ImageHttpService } from 'src/infras/transport/image/image-http.service';
import { ImageUseCase } from 'src/usecase/image';

export function setupImageRouter(sequelize: Sequelize) {
  imageInit(sequelize);
  const router = Router();
  const repository = new PostgresImageRepository(sequelize, imageModelName);
  const usecase = new ImageUseCase(repository);
  const httpService = new ImageHttpService(usecase);
  router.get('/image/:id', httpService.getImage.bind(httpService));
  router.get('/image', httpService.listImage.bind(httpService));
  router.post('/image', httpService.createImage.bind(httpService));
  router.put('/image/:id', httpService.updateImage.bind(httpService));
  router.delete('/image/:id', httpService.deleteImage.bind(httpService));
  return router;
}