import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import { Sequelize } from "sequelize";
import { imageInit, imageModelName } from "src/infras/repository/image/dto";
import {
  CloudinaryImageRepository,
  PostgresImageRepository,
} from "src/infras/repository/image/repo";
import { ImageHttpService } from "src/infras/transport/image/image-http.service";
import { cloudinaryBase64Middleware } from "src/middlewares/cloudinary-base64.middleware";
import cloudinary from "src/share/cloudinary";
import { ImageUseCase } from "src/usecase/image";

export function setupImageRouter(sequelize: Sequelize) {
  const storage = multer.memoryStorage();
  const tempStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.join(__dirname, "../../storage/images"));
    },
    filename: (req, file, callback) => {
      callback(null, Date.now() + "_" + file.originalname);
    },
  });
  const upload = multer({ storage: storage });
  const tempUpload = multer({ storage: tempStorage });
  imageInit(sequelize);
  const router = Router();
  const repository = new PostgresImageRepository(sequelize, imageModelName);
  const cloudinaryRepository = new CloudinaryImageRepository(cloudinary);
  const usecase = new ImageUseCase(repository, cloudinaryRepository);
  const httpService = new ImageHttpService(usecase);
  router.get("/image/:id", httpService.getImage.bind(httpService));
  router.get("/image", httpService.listImage.bind(httpService));
  router.post(
    "/image",
    upload.single("file"),
    cloudinaryBase64Middleware,
    httpService.createImage.bind(httpService)
  );
  router.post(
    "/upload",
    upload.any(),
    cloudinaryBase64Middleware,
    httpService.uploadImageFromEditor.bind(httpService)
  );

  router.put("/image/:id", httpService.updateImage.bind(httpService));
  router.delete("/image/:id", httpService.deleteImage.bind(httpService));
  return router;
}
