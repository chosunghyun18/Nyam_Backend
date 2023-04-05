import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentSchema } from './recruitment.model';
import { Recruitment } from './recruitment.model';
import { StoreModule } from '../store/store.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recruitment.name, schema: RecruitmentSchema },
    ]),
    forwardRef(() => StoreModule),
  ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
  exports: [RecruitmentService],
})
export class RecruitmentModule {
  constructor() {
    console.log('구인 모듈 제작 완료');
  }
}
