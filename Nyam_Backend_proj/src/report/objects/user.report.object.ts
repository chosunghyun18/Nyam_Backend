import { getCurrentDate } from 'src/common/util/dateTime';
import { User } from 'src/user/models/user.model';
import { OtherUser } from 'src/user/objects/user.object';
import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { Admin } from 'src/user/models/admin.model';
import { UserReport } from '../models/user.report.model';

export class UserReportAdd {
  user: OtherUser;
  campus_id: Types.ObjectId;
  user_report_store_name: string;
  user_report_sub: string;
  user_report_image: string;
  user_report_type: string;
  user_report_created_at: Date;
  constructor(user: User, campus_id, data) {
    this.user = new OtherUser(user);
    this.campus_id = campus_id;
    this.user_report_store_name = data.user_report_store_name;
    this.user_report_sub = data.user_report_sub;
    this.user_report_image = data.user_report_image;
    this.user_report_type = data.user_report_type;
    this.user_report_created_at = getCurrentDate(new Date());
  }
}

export class UserReportView {
  report_id: Types.ObjectId;
  user: OtherUser;
  user_report_sub: string;
  user_report_image: string;
  user_report_created_at: Date;
  user_report_check: boolean;
  constructor(user_report: UserReport) {
    this.report_id = user_report.id;
    this.user = user_report.user;
    this.user_report_sub = user_report.user_report_sub;
    this.user_report_image = user_report.user_report_image;
    this.user_report_created_at = user_report.user_report_created_at;
    this.user_report_check = user_report.user_report_check;
  }
}
export class UserReportManageView {
  report_id: Types.ObjectId;
  campus_id: Types.ObjectId;
  user: OtherUser;
  admin: OtherAdmin;
  user_report_store_name: string;
  user_report_sub: string;
  user_report_image: string;
  user_report_created_at: Date;
  user_report_check: boolean;
  user_report_active: boolean;
  user_report_type: string;
  constructor(user_report: UserReport) {
    this.report_id = user_report.id;
    this.campus_id = user_report.campus_id;
    this.user = user_report.user;
    this.admin = user_report.admin;
    this.user_report_store_name = user_report.user_report_store_name;
    this.user_report_sub = user_report.user_report_sub;
    this.user_report_image = user_report.user_report_image;
    this.user_report_created_at = user_report.user_report_created_at;
    this.user_report_check = user_report.user_report_check;
    this.user_report_active = user_report.user_report_active;
    this.user_report_type = user_report.user_report_type;
  }
}

export class UserReportQuery {
  user_id: Types.ObjectId;
  campus_id: Types.ObjectId;
  user_report_check: boolean;
  user_report_active: boolean;
  user_report_type: string;
  constructor(data) {
    this.user_id = data.uid;
    this.campus_id = data.campus_id;
    this.user_report_check = data.report_check;
    this.user_report_active = data.report_active;
    this.user_report_type = data.report_type;
  }
  Query() {
    const query = {};
    if (this.campus_id) query['campus_id'] = this.campus_id;
    if (this.user_id) query['user.uid'] = this.user_id;
    if (this.user_report_check)
      query['user_report_check'] = this.user_report_check;
    if (this.user_report_active)
      query['user_report_active'] = this.user_report_active;
    if (this.user_report_type)
      query['user_report_type'] = this.user_report_type;
    return query;
  }
}
