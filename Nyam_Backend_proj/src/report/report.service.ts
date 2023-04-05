import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserReport } from './models/user.report.model';
import { UserReportAdd, UserReportQuery } from './objects/user.report.object';
import { OtherAdmin } from 'src/user/objects/admin.object';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(UserReport.name)
    private readonly userReportModel: Model<UserReport>,
  ) {}

  //clear 유저 요청 - 유저
  async user_report_add(data: UserReportAdd) {
    const item = await this.userReportModel.create(data);
    return item;
  }

  async user_report_delete(
    admin: OtherAdmin,
    report_id: Types.ObjectId,
    active: boolean,
  ) {
    const item = await this.userReportModel.findById(report_id);
    item.user_report_active = active;
    item.admin = admin;
    await item.save();
    return item;
  }

  async user_report_check(
    admin: OtherAdmin,
    report_id: Types.ObjectId,
    check: boolean,
  ) {
    const item = await this.userReportModel.findById(report_id);
    item.user_report_check = check;
    item.admin = admin;
    await item.save();
    return item;
  }

  //clear 유저 요청 리스트 - 관리자  - 답변 여부
  async user_report_list(findData: UserReportQuery) {
    const list = await this.userReportModel.find(findData.Query());
    return list;
  }
}
