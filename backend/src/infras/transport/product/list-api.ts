import { Request, Response } from 'express';
import { ProductPersistence } from 'src/infras/repository/product/dto';
import { PagingDTOSchema } from 'src/share/models/paging';

export const listProductApi = () => async (req: Request, res: Response) => {
  const { success, data, error } = PagingDTOSchema.safeParse(req.query);

  if (!success) {
    res.status(400).json({ error: error.message });
    return;
  }
  const { page, limit } = data;
  const { rows, count } = await ProductPersistence.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    order: [['updated_at', 'DESC']],
  });

  res.status(200).json({
    message: 'Products fetched successfully',
    data: rows,
    meta: {
      total_count: count,
      current_page: page,
      total_page: Math.ceil(count / limit),
      limit,
    },
  });
};
