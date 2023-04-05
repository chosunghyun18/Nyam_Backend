import { getCurrentDate } from 'src/common/util/dateTime';
import { Types } from 'mongoose';
import { Admin } from '../models/admin.model';

export class AdminSignUpRequest {
  admin_name: string;
  admin_nickname: string;
  admin_profile: string;
  admin_id: string;
  admin_password: string;
  admin_birth: Date;
  admin_created_at: Date;
  constructor(data) {
    this.admin_name = data.admin_name;
    this.admin_nickname = data.admin_nickname;
    this.admin_profile = data.admin_profile;
    this.admin_id = data.admin_id;
    this.admin_password = data.admin_password;
    this.admin_birth = new Date(data.admin_birth);
    this.admin_created_at = getCurrentDate(new Date());
  }
}
export class AdminUpdateRequest {
  uid: Types.ObjectId;
  admin_name: string;
  admin_nickname: string;
  admin_profile: string;
  admin_birth: Date;
  constructor(uid: Types.ObjectId, data) {
    this.uid = uid;
    this.admin_name = data.name;
    this.admin_nickname = data.nickname;
    this.admin_profile = data.profile;
    this.admin_birth = new Date(data.birth);
  }
}

export class AdminPasswordUpdateRequest {
  uid: Types.ObjectId;
  new_password: string;
  constructor(uid: Types.ObjectId, data) {
    this.uid = uid;
    this.new_password = data.new_password;
  }
}

export class OtherAdmin {
  uid: Types.ObjectId;
  admin_nickname: string;
  admin_profile: string;
  admin_active: boolean;
  constructor(admin: Admin) {
    this.uid = admin.id;
    this.admin_active = admin.admin_active;
    this.admin_nickname = admin.admin_nickname;
    this.admin_profile = admin.admin_profile;
  }
}

export class MyAdmin {
  uid: Types.ObjectId;
  admin_name: string;
  admin_nickname: string;
  admin_profile: string;
  admin_id: string;
  admin_password: string;
  admin_birth: Date;
  admin_created_at: Date;
  admin_role: string;
  constructor(admin: Admin) {
    this.admin_name = admin.admin_name;
    this.admin_nickname = this.admin_nickname;
    this.admin_profile = admin.admin_profile;
    this.admin_id = admin.id;
    this.admin_password = admin.admin_password;
    this.admin_birth = admin.admin_birth;
    this.admin_role = admin.admin_role;
  }
}
