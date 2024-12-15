import { Request, Response } from 'express';
import { ProductPersistence } from 'src/infras/repository/product/dto';

export const getProductApi = () => async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductPersistence.findByPk(id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.status(200).json({
    data: product,
  });
};
