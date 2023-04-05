import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { FileModule } from './file/file.module';
import { StoreModule } from './store/store.module';
import { AdModule } from './ad/ad.module';
import { EventModule } from './event/event.module';
import { RequestModule } from './request/request.module';
import { LabModule } from './lab/lab.module';
import { ReviewModule } from './review/review.module';
import { NotifictionModule } from './notifiction/notifiction.module';
import { CampusModule } from './campus/campus.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { LogsModule } from './logs/logs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { VersionModule } from './version/version.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { DiscountModule } from './discount/discount.module';
import { PromotionModule } from './promotion/promotion.module';
import { StreetFoodModule } from './streetFood/streetFood.module';
import { ReportModule } from './report/report.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DB.MONGO_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    FileModule,
    StoreModule,
    AdModule,
    EventModule,
    RequestModule,
    LabModule,
    ReviewModule,
    NotifictionModule,
    CampusModule,
    CategoryModule,
    BookmarkModule,
    LogsModule,
    VersionModule,
    RecruitmentModule,
    DiscountModule,
    PromotionModule,
    StreetFoodModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  constructor() {
    console.log(process.env.NODE_ENV);
  }
}
