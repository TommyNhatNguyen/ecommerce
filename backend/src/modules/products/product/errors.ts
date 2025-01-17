export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}
export const DISCOUNT_NOT_FOUND_ERROR = new Error('Discount not found');
