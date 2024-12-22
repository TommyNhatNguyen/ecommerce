import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { reviewInit, reviewModelName } from 'src/infras/repository/review/dto';
import { ReviewRepository } from 'src/infras/repository/review/repo';
import { ReviewHttpService } from 'src/infras/transport/review/review-http.service';
import { ReviewUseCase } from 'src/usecase/review';
export function setupReviewRouter(sequelize: Sequelize) {
  reviewInit(sequelize);
  const router = Router()
  const reviewRepository = new ReviewRepository(sequelize, reviewModelName)
  const reviewUseCase = new ReviewUseCase(reviewRepository)
  const reviewHttpService = new ReviewHttpService(reviewUseCase)
  router.get('/review/:id', reviewHttpService.getReview.bind(reviewHttpService))
  router.get('/review', reviewHttpService.listReview.bind(reviewHttpService))
  router.post('/review', reviewHttpService.createReview.bind(reviewHttpService))
  router.put('/review/:id', reviewHttpService.updateReview.bind(reviewHttpService))
  router.delete('/review/:id', reviewHttpService.deleteReview.bind(reviewHttpService))
  return router
}