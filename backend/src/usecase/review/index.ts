import {
  ReviewConditionDTO,
  ReviewCreateDTO,
  ReviewUpdateDTO,
} from '@models/review/review.dto';
import {
  IReviewRepository,
  IReviewUseCase,
} from '@models/review/review.interface';
import { Review } from '@models/review/review.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class ReviewUseCase implements IReviewUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async getReview(id: string, condition: ReviewConditionDTO): Promise<Review> {
    return this.reviewRepository.get(id, condition);
  }
  async listReview(
    paging: PagingDTO,
    condition: ReviewConditionDTO
  ): Promise<ListResponse<Review[]>> {
    return this.reviewRepository.list(paging, condition);
  }
  async createReview(data: ReviewCreateDTO): Promise<Review> {
    return this.reviewRepository.insert(data);
  }
  async updateReview(id: string, data: ReviewUpdateDTO): Promise<Review> {
    return this.reviewRepository.update(id, data);
  }
  async deleteReview(id: string): Promise<boolean> {
    return this.reviewRepository.delete(id);
  }
}
