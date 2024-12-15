import { Request, Response } from 'express';
import { ProductPersistence } from 'src/infras/repository/product/dto';

export const deleteProductApi = () => async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await ProductPersistence.findByPk(id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  await ProductPersistence.destroy({
    where: {
      id,
    },
  });

  res.status(200).json({
    message: 'Product deleted successfully',
    data: product,
  });
};
