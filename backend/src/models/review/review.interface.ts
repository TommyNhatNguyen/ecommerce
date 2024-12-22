import {
  ReviewConditionDTO,
  ReviewCreateDTO,
  ReviewUpdateDTO,
} from '@models/review/review.dto';
import { Review } from '@models/review/review.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IReviewUseCase {
  getReview(id: string, condition: ReviewConditionDTO): Promise<Review>;
  listReview(paging: PagingDTO, condition: ReviewConditionDTO): Promise<ListResponse<Review[]>>;
  createReview(data: ReviewCreateDTO): Promise<Review>;
  updateReview(id: string, data: ReviewUpdateDTO): Promise<Review>;
  deleteReview(id: string): Promise<boolean>;
}

export interface IReviewRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  get(id: string, condition: ReviewConditionDTO): Promise<Review>;
  list(
    paging: PagingDTO,
    condition: ReviewConditionDTO
  ): Promise<ListResponse<Review[]>>;
}

export interface ICommandRepository {
  insert(data: ReviewCreateDTO): Promise<Review>;
  update(id: string, data: ReviewUpdateDTO): Promise<Review>;
  delete(id: string): Promise<boolean>;
}
