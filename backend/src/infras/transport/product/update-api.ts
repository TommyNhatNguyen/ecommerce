import { Request, Response } from 'express';
import { ProductUpdateDTOSchema } from '@models/product/product.dto';
import { ProductPersistence } from 'src/infras/repository/product/dto';
import { ModelStatus } from 'src/share/models/base-model';

export const updateProductApi = () => async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, data, error } = ProductUpdateDTOSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ error: error.message });
    return;
  }

  const product = await ProductPersistence.findByPk(id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  if (product.status !== ModelStatus.ACTIVE) {
    res.status(400).json({ error: 'Product is not active or deleted' });
    return;
  }

  await ProductPersistence.update(data, {
    where: {
      id,
    },
  });
  res.status(200).json({
    message: 'Product updated successfully',
    data: data,
  });
};
