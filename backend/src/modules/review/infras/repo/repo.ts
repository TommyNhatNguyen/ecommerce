import { Sequelize } from 'sequelize';
import { ReviewConditionDTO, ReviewCreateDTO, ReviewUpdateDTO } from 'src/modules/review/models/review.dto';
import { IReviewRepository } from 'src/modules/review/models/review.interface';
import { Review } from 'src/modules/review/models/review.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class ReviewRepository implements IReviewRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(id: string): Promise<Review> {
    const review = await this.sequelize.models[this.modelName].findByPk(id);
    return review ? review.dataValues : null;
  }
  async list(
    paging: PagingDTO,
    condition: ReviewConditionDTO
  ): Promise<ListResponse<Review[]>> {
    const { page, limit } = paging;
    const { rows, count } = await this.sequelize.models[
      this.modelName
    ].findAndCountAll({
      where: condition,
      limit: limit,
      offset: (page - 1) * limit,
    });
    return {
      data: rows.map((row) => row.dataValues),
      meta: {
        current_page: page,
        limit: limit,
        total_count: count,
        total_page: Math.ceil(count / limit),
      },
    };
  }
  async insert(data: ReviewCreateDTO): Promise<Review> {
    const review = await this.sequelize.models[this.modelName].create(data, {
      returning: true,
    });
    return review.dataValues;
  }
  async update(id: string, data: ReviewUpdateDTO): Promise<Review> {
    const review = await this.sequelize.models[this.modelName].update(data, {
      where: { id },
      returning: true,
    });
    return review[1][0]?.dataValues ?? null;
  }
  async delete(id: string): Promise<boolean> {
    const review = await this.sequelize.models[this.modelName].destroy({
      where: { id },
    });
    return true;
  }
}
