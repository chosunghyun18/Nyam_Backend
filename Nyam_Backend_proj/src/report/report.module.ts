import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserReport, UserReportSchema } from './models/user.report.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserReport.name, schema: UserReportSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
