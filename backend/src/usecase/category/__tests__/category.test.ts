import { ICategoryRepository } from '@models/category/category.interface';
import { CategoryCreateDTOSchema } from '@models/category/category.dto';
import { Category } from '@models/category/category.model';
import { ModelStatus } from 'src/share/models/base-model';
import { CategoryUseCase } from 'src/usecase/category';

describe('CategoryUseCase', () => {
  let categoryUseCase: CategoryUseCase;
  let mockRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    mockRepository = {
      insert: jest.fn(),
      get: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    categoryUseCase = new CategoryUseCase(mockRepository);
  });

  it('should create a category and return it', async () => {
    const categoryData: CategoryCreateDTOSchema = {
      id: '1',
      name: 'Test Category',
      description: 'Test Description',
    };

    const expectedCategory: Category = {
      ...categoryData,
      id: expect.any(String),
      status: ModelStatus.ACTIVE,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    mockRepository.insert.mockResolvedValue(expectedCategory);

    const result = await categoryUseCase.createCategory(categoryData);

    expect(mockRepository.insert).toHaveBeenCalledWith(expectedCategory);
    expect(result).toEqual(expectedCategory);
  });
});
