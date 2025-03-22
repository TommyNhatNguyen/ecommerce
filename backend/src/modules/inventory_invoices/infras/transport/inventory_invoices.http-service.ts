import { Request, Response, Router } from 'express';
import {
  InventoryInvoiceConditionDTOSchema,
  InventoryInvoiceCreateDTOSchema,
  InventoryInvoiceCreateTransferDTOSchema,
  InventoryInvoiceUpdateDTOSchema,
} from 'src/modules/inventory_invoices/models/inventory_invoices.dto';
import { InventoryInvoiceUseCase } from 'src/modules/inventory_invoices/usecase';
import { PagingDTOSchema } from 'src/share/models/paging';

export class InventoryInvoiceHttpService {
  constructor(
    private readonly inventoryInvoiceUseCase: InventoryInvoiceUseCase
  ) {}

  async createTransferInvoice(req: Request, res: Response) {
    const { success, data, error } =
      InventoryInvoiceCreateTransferDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
      const inventoryInvoice =
        await this.inventoryInvoiceUseCase.createTransferInvoice(data);
      if (!inventoryInvoice) {
        res.status(400).json({ error: 'Failed to create inventory invoice' });
        return;
      }
      res.status(200).json({
        message: 'Inventory invoice created successfully',
        ...inventoryInvoice,
      });
      return;
    } catch (error: any) {
      console.log(
        '🚀 ~ InventoryInvoiceHttpService ~ createTransferInvoice ~ error:',
        error
      );
      res.status(400).json({ error: error.message });
      return;
    }
  }

  async create(req: Request, res: Response) {
    const { success, data, error } = InventoryInvoiceCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
      const inventoryInvoice = await this.inventoryInvoiceUseCase.create(data);
      if (!inventoryInvoice) {
        res.status(400).json({ error: 'Failed to create inventory invoice' });
        return;
      }
      res.status(201).json({
        message: 'Inventory invoice created successfully',
        ...inventoryInvoice,
      });
      return;
    } catch (error: any) {
      console.log('🚀 ~ InventoryInvoiceHttpService ~ create ~ error:', error);
      res.status(400).json({ error: error.message });
      return;
    }
  }
  async getAll(req: Request, res: Response) {
    const { success, data, error } =
      InventoryInvoiceConditionDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
      const inventoryInvoices = await this.inventoryInvoiceUseCase.getAll(data);
      if (!inventoryInvoices) {
        res.status(400).json({ error: 'Failed to get inventory invoices' });
        return;
      }
      res.status(200).json({
        message: 'Inventory invoices fetched successfully',
        ...inventoryInvoices,
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  }

  async getList(req: Request, res: Response) {
    const {
      success,
      data: condition,
      error,
    } = InventoryInvoiceConditionDTOSchema.safeParse(req.query);
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!successPaging) {
      res.status(400).json({ error: errorPaging.message });
      return;
    }
    try {
      const inventoryInvoices = await this.inventoryInvoiceUseCase.getList(
        paging,
        condition
      );
      if (!inventoryInvoices) {
        res.status(400).json({ error: 'Failed to get inventory invoices' });
        return;
      }
      res.status(200).json({
        message: 'Inventory invoices fetched successfully',
        ...inventoryInvoices,
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  }
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success,
      data: condition,
      error,
    } = InventoryInvoiceConditionDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
      const inventoryInvoice = await this.inventoryInvoiceUseCase.getById(
        id,
        condition
      );
      if (!inventoryInvoice) {
        res.status(400).json({ error: 'Failed to get inventory invoice' });
        return;
      }
      res.status(200).json({
        message: 'Inventory invoice fetched successfully',
        ...inventoryInvoice,
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  }
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = InventoryInvoiceUpdateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
      const inventoryInvoice = await this.inventoryInvoiceUseCase.update(
        id,
        data
      );
      if (!inventoryInvoice) {
        res.status(400).json({ error: 'Failed to update inventory invoice' });
        return;
      }
      res.status(200).json({
        message: 'Inventory invoice updated successfully',
        ...inventoryInvoice,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  }
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const inventoryInvoice = await this.inventoryInvoiceUseCase.delete(id);
      if (!inventoryInvoice) {
        res.status(400).json({ error: 'Failed to delete inventory invoice' });
        return;
      }
      res.status(200).json({
        message: 'Inventory invoice deleted successfully',
      });
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  }
}
