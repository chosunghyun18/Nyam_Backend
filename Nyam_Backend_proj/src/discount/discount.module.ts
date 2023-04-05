import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { DiscountSchema } from './discount.model';
import { Discount } from './discount.model';
import { StoreModule } from '../store/store.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
    ]),
    forwardRef(() => StoreModule),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {
  constructor() {
    console.log('구인 모듈 제작 완료');
  }
}
