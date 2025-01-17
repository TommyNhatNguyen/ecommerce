import { Request, Response } from 'express';
import {
  CartAddNewProductsDTOSchema,
  CartConditionDTOSchema,
  CartCreateDTOSchema,
  CartUpdateDTOSchema,
} from 'src/modules/cart/models/cart.dto';
import { PagingDTOSchema } from 'src/share/models/paging';
import { CartUseCase } from 'src/modules/cart/usecase';
export class CartHttpService {
  constructor(private readonly cartUsecase: CartUseCase) {}

  async addProductsToCart(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CartAddNewProductsDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const updatedCart = await this.cartUsecase.addProductsToCart(id, data);
      res.status(200).json({ success: true, ...updatedCart });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CartConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const cart = await this.cartUsecase.getById(id, data);
      if (!cart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }
      res.status(200).json({ success: true, ...cart });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async getList(req: Request, res: Response) {
    const {
      success: successPaging,
      data: dataPaging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: dataCondition,
      error: errorCondition,
    } = CartConditionDTOSchema.safeParse(req.query);
    if (!successPaging || !successCondition) {
      res.status(400).json({
        success: false,
        message: errorPaging?.message || errorCondition?.message,
      });
      return;
    }
    try {
      const cart = await this.cartUsecase.getList(dataPaging, dataCondition);
      if (!cart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }
      res.status(200).json({ success: true, ...cart });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async create(req: Request, res: Response) {
    const { success, data, error } = CartCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const cart = await this.cartUsecase.create(data);
      res.status(200).json({ success: true, ...cart });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CartUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const updatedCart = await this.cartUsecase.getById(id, {});
      if (!updatedCart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }
      const cart = await this.cartUsecase.update(id, data);
      res.status(200).json({ success: true, ...cart });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedCart = await this.cartUsecase.getById(id, {});
      if (!deletedCart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }
      await this.cartUsecase.delete(id);
      res.status(200).json({
        success: true,
        message: 'Cart deleted successfully',
        ...deletedCart,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }
}
