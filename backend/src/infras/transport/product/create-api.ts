import { Request, Response } from 'express';
import { ProductCreateDTOSchema } from '@models/product/product.dto';
import { ProductPersistence } from 'src/infras/repository/product/dto';
import { v7 as uuidv7 } from 'uuid';
export const createProductApi = () => async (req: Request, res: Response) => {
  const { success, data, error } = ProductCreateDTOSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ error: error.message });
    return;
  }

  const product = await ProductPersistence.create({
    ...data,
    id: uuidv7()
  });

  res.status(200).json({
    message: 'Product created successfully',
    data: product,
  });
};
