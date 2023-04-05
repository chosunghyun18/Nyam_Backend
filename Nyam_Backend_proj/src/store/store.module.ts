import { forwardRef, Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './store.model';
import { LabModule } from '../lab/lab.module';
import { EventModule } from '../event/event.module';
import { DiscountModule } from 'src/discount/discount.module';
import { PromotionModule } from 'src/promotion/promotion.module';
import { RecruitmentModule } from 'src/recruitment/recruitment.module';
import { ReviewModule } from 'src/review/review.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    forwardRef(() => LabModule),
    forwardRef(() => EventModule),
    forwardRef(() => DiscountModule),
    forwardRef(() => PromotionModule),
    forwardRef(() => RecruitmentModule),
    forwardRef(() => BookmarkModule),
    forwardRef(() => ReviewModule),
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {
  constructor() {
    console.log('매장 모듈 제작 완료');
  }
}
