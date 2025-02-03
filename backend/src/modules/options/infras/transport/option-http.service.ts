import { Request, Response } from 'express';
import {
  OptionConditionDTOSchema,
  OptionCreateDTOSchema,
  OptionUpdateDTOSchema,
  OptionValueConditionDTOSchema,
  OptionValueCreateDTOSchema,
  OptionValueUpdateDTOSchema,
} from 'src/modules/options/models/option.dto';
import {
  IOptionUseCase,
  IOptionValueUseCase,
} from 'src/modules/options/models/option.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class OptionHttpService {
  constructor(private readonly useCase: IOptionUseCase) {}

  async getOptionById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const checkOption = await this.useCase.getOptionById(id);
      if (!checkOption) {
        res.status(400).json({ message: 'Option not found' });
        return;
      }
      res.status(200).json({ message: 'Option found', data: checkOption });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get option' });
      return;
    }
  }

  async listOption(req: Request, res: Response) {
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    if (!successPaging) {
      res.status(400).json({ message: errorPaging?.message });
      return;
    }
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = OptionConditionDTOSchema.safeParse(req.query);
    if (!successCondition) {
      res.status(400).json({ message: errorCondition?.message });
      return;
    }
    try {
      const options = await this.useCase.listOption(paging, condition);
      res.status(200).json({ message: 'Options found', ...options });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get options' });
      return;
    }
  }

  async createOption(req: Request, res: Response) {
    const { success, data, error } = OptionCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const option = await this.useCase.createOption(data);
      res
        .status(200)
        .json({ message: 'Option created successfully', data: option });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create option' });
      return;
    }
  }

  async updateOption(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = OptionUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const checkOption = await this.useCase.getOptionById(id);
      if (!checkOption) {
        res.status(400).json({ message: 'Option not found' });
        return;
      }
      const option = await this.useCase.updateOption(id, data);
      res
        .status(200)
        .json({ message: 'Option updated successfully', data: option });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update option' });
      return;
    }
  }

  async deleteOption(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const checkOption = await this.useCase.getOptionById(id);
      if (!checkOption) {
        res.status(400).json({ message: 'Option not found' });
        return;
      }
      await this.useCase.deleteOption(id);
      res.status(200).json({ message: 'Option deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete option' });
      return;
    }
  }
}

export class OptionValueHttpService {
  constructor(private readonly useCase: IOptionValueUseCase) {}

  async getOptionValueById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const checkOptionValue = await this.useCase.getOptionValueById(id);
      if (!checkOptionValue) {
        res.status(400).json({ message: 'Option value not found' });
        return;
      }
      res
        .status(200)
        .json({ message: 'Option value found', data: checkOptionValue });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get option value' });
      return;
    }
  }

  async listOptionValue(req: Request, res: Response) {
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    if (!successPaging) {
      res.status(400).json({ message: errorPaging?.message });
      return;
    }
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = OptionValueConditionDTOSchema.safeParse(req.query);
    if (!successCondition) {
      res.status(400).json({ message: errorCondition?.message });
      return;
    }
    try {
      const optionValues = await this.useCase.listOptionValue(
        paging,
        condition
      );
      res.status(200).json({ message: 'Option values found', ...optionValues });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get option values' });
      return;
    }
  }

  async createOptionValue(req: Request, res: Response) {
    const { success, data, error } = OptionValueCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const optionValue = await this.useCase.createOptionValue(data);
      res
        .status(200)
        .json({
          message: 'Option value created successfully',
          data: optionValue,
        });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create option value' });
      return;
    }
  }

  async updateOptionValue(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = OptionValueUpdateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const checkOptionValue = await this.useCase.getOptionValueById(id);
      if (!checkOptionValue) {
        res.status(400).json({ message: 'Option value not found' });
        return;
      }
      const optionValue = await this.useCase.updateOptionValue(id, data);
      res
        .status(200)
        .json({
          message: 'Option value updated successfully',
          data: optionValue,
        });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update option value' });
      return;
    }
  }

  async deleteOptionValue(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const checkOptionValue = await this.useCase.getOptionValueById(id);
      if (!checkOptionValue) {
        res.status(400).json({ message: 'Option value not found' });
        return;
      }
      await this.useCase.deleteOptionValue(id);
      res.status(200).json({ message: 'Option value deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete option value' });
      return;
    }
  }
}
