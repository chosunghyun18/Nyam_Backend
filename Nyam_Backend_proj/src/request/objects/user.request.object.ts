import { getCurrentDate } from 'src/common/util/dateTime';
import { Types } from 'mongoose';
import { RequestOtherUser } from 'src/user/objects/user.object';
import { UserRequest } from '../models/user.request.model';
import { OtherAdmin } from 'src/user/objects/admin.object';

export class RequestScript {
  request_type: string;
  request_sub: string;
  request_created_at: Date;

  constructor(request_type, request_sub) {
    this.request_type = request_type;
    this.request_sub = request_sub;
    this.request_created_at = getCurrentDate(new Date());
  }
}

export class UserRequestView {
  request_script: RequestScript[];
  constructor(user_request: UserRequest) {
    this.request_script = user_request.request_script;
  }
}

export class UserRequestManageView {
  request_id: Types.ObjectId;
  user: RequestOtherUser;
  admin: OtherAdmin;
  request_script: RequestScript[];
  request_check: boolean;
  constructor(user_request: UserRequest) {
    this.request_id = user_request.id;
    this.user = user_request.user;
    this.admin = user_request.admin;
    this.request_script = user_request.request_script;
    this.request_check = user_request.request_check;
  }
}

export class UserRequestQuery {
  request_check: boolean;
  constructor(data) {
    this.request_check = data.request_check;
  }
  Query() {
    const query = {};
    if (this.request_check) query['request_check'] = this.request_check;
    return query;
  }
}
