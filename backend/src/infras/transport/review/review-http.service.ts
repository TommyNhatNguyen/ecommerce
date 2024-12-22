import {
  ReviewConditionDTO,
  ReviewCreateDTO,
  ReviewUpdateDTO,
} from '@models/review/review.dto';
import { IReviewUseCase } from '@models/review/review.interface';
import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';

export class ReviewHttpService {
  constructor(private readonly reviewUseCase: IReviewUseCase) {}

  async getReview(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = ReviewConditionDTO.safeParse(req.query);
    if (!success) {
      res.status(400).json({ message: 'Invalid query', error: error.format() });
      return;
    }
    try {
      const review = await this.reviewUseCase.getReview(id, data);
      if (!review) {
        res.status(404).json({ message: 'Review not found' });
        return;
      }
      res
        .status(200)
        .json({ message: 'Review retrieved successfully', data: review });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get review', error: error });
    }
  }

  async listReview(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: pagingData,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = ReviewConditionDTO.safeParse(req.query);
    if (!pagingSuccess || !successCondition) {
      res
        .status(400)
        .json({
          message: 'Invalid query',
          error: pagingError?.format() ?? errorCondition?.format(),
        });
      return;
    }
    try {
      const reviews = await this.reviewUseCase.listReview(
        pagingData,
        condition
      );
      if (!reviews) {
        res.status(404).json({ message: 'Review list not found' });
        return;
      }
      res
        .status(200)
        .json({ message: 'Review list retrieved successfully', data: reviews });
    } catch (error) {
      res.status(500).json({ message: 'Failed to list review', error: error });
    }
  }

  async createReview(req: Request, res: Response) {
    const { success, data, error } = ReviewCreateDTO.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: 'Invalid body', error: error.format() });
      return;
    }
    try {
      const review = await this.reviewUseCase.createReview(data);
      if (!review) {
        res.status(404).json({ message: 'Review not found' });
        return;
      }
      res
        .status(200)
        .json({ message: 'Review created successfully', data: review });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to create review', error: error });
    }
  }

  async updateReview(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = ReviewUpdateDTO.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: 'Invalid body', error: error.format() });
      return;
    }
    try {
      const review = await this.reviewUseCase.updateReview(id, data);
      if (!review) {
        res.status(404).json({ message: 'Review not found' });
        return;
      }
      res
        .status(200)
        .json({ message: 'Review updated successfully', data: review });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to update review', error: error });
    }
  }

  async deleteReview(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await this.reviewUseCase.deleteReview(id);
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to delete review', error: error });
    }
  }
}
