import { CronJob } from 'cron';
import { IProductSellableUseCase } from 'src/modules/product_sellable/models/product-sellable.interface';

// Tạo class cron để
export class ProductSellableCronJob {
  constructor(
    private readonly cronJob: CronJob,
    private readonly productSellableUseCase: IProductSellableUseCase
  ) {}

  public async start() {
    this.cronJob.start();
  }

  public async stop() {
    this.cronJob.stop();
  }
}
