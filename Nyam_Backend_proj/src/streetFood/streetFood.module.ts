import { Module } from '@nestjs/common';
import { StreetFoodService } from './streetFood.service';
import { StreetFoodController } from './streetFood.controller';
import { StreetFoodSchema } from './streetFood.model';
import { MongooseModule } from '@nestjs/mongoose';
import { StreetFood } from './streetFood.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StreetFood.name, schema: StreetFoodSchema },
    ]),
  ],
  controllers: [StreetFoodController],
  providers: [StreetFoodService],
  exports: [StreetFoodService],
})
export class StreetFoodModule {
  constructor() {
    console.log('streetfood 모듈 제작 완료');
  }
}
