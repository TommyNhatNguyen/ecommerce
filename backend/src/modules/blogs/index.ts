import { Router } from 'express';
import { Sequelize } from 'sequelize';
import {
  blogsInit,
  blogsModelName,
} from 'src/modules/blogs/infras/dto/blogs.dto';
import { PostgresBlogsPersistence } from 'src/modules/blogs/infras/repo/blogs.repo';
import { BlogsHttpService } from 'src/modules/blogs/infras/transport';
import { BlogsUseCase } from 'src/modules/blogs/usecase';

export const setupBlogsRouter = (sequelize: Sequelize) => {
  blogsInit(sequelize);
  const blogsRepository = new PostgresBlogsPersistence(
    sequelize,
    blogsModelName
  );
  const blogsUseCase = new BlogsUseCase(blogsRepository);
  const blogsHttpService = new BlogsHttpService(blogsUseCase);
  const router = Router();
  router.post('/blogs', blogsHttpService.createNewBlogs.bind(blogsHttpService));
  router.put('/blogs/:id', blogsHttpService.updateBlogs.bind(blogsHttpService));
  router.delete('/blogs/:id', blogsHttpService.deleteBlogs.bind(blogsHttpService));
  router.get('/blogs/:id', blogsHttpService.getBlogs.bind(blogsHttpService));
  router.get('/blogs', blogsHttpService.listBlogs.bind(blogsHttpService));
  return router;
};
