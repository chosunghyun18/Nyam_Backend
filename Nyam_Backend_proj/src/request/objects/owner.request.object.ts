import { getCurrentDate } from 'src/common/util/dateTime';

import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { Admin } from 'src/user/models/admin.model';
import { OtherOwner } from 'src/user/objects/owner.object';
import { Owner } from 'src/user/models/owner.model';
import { OwnerRequest } from '../models/owner.request.model';

export class OwnerRequestAdd {
  owner: OtherOwner;
  owner_request_sub: string;
  owner_request_images: string[];
  owner_request_end_at: Date;
  owner_request_created_at: Date;
  constructor(owner: Owner, data) {
    this.owner = new OtherOwner(owner);
    this.owner_request_sub = data.owner_request_sub;
    this.owner_request_images = data.owner_request_images;
    this.owner_request_created_at = getCurrentDate(new Date());
    this.owner_request_end_at = new Date(data.owner_request_end_at);
  }
}

export class OwnerRequestAnwer {
  request_id: Types.ObjectId;
  owner_request_answer: string;
  owner_request_answer_image: string;
  owner_request_answer_time: Date;
  admin: OtherAdmin;
  constructor(admin: Admin, data) {
    this.admin = new OtherAdmin(admin);
    this.request_id = data.request_id;
    this.owner_request_answer = data.owner_request_answer;
    this.owner_request_answer_image = data.owner_request_answer_image;
    this.owner_request_answer_time = getCurrentDate(new Date());
  }
}

export class OwnerRequestView {
  request_id: Types.ObjectId;
  owner: OtherOwner;
  owner_request_sub: string;
  owner_request_images: string[];
  owner_request_created_at: Date;
  owner_request_answer: string;
  owner_request_answer_image: string;
  owner_request_check: boolean;
  owner_request_answer_time: Date;
  constructor(owner_request: OwnerRequest) {
    this.request_id = owner_request.id;
    this.owner = owner_request.owner;
    this.owner_request_sub = owner_request.owner_request_sub;
    this.owner_request_images = owner_request.owner_request_images;
    this.owner_request_created_at = owner_request.owner_request_created_at;
    this.owner_request_answer = owner_request.owner_request_answer;
    this.owner_request_answer_image = owner_request.owner_request_answer_image;
    this.owner_request_check = owner_request.owner_request_check;
    this.owner_request_answer_time = owner_request.owner_request_answer_time;
  }
}
export class OwnerRequestMageView {
  request_id: Types.ObjectId;
  owner: OtherOwner;
  owner_request_sub: string;
  owner_request_images: string[];
  owner_request_created_at: Date;
  owner_request_answer: string;
  owner_request_answer_image: string;
  owner_request_check: boolean;
  owner_request_answer_time: Date;
  admin: OtherAdmin;
  constructor(owner_request: OwnerRequest) {
    this.request_id = owner_request.id;
    this.owner = owner_request.owner;
    this.owner_request_sub = owner_request.owner_request_sub;
    this.owner_request_images = owner_request.owner_request_images;
    this.owner_request_created_at = owner_request.owner_request_created_at;
    this.owner_request_answer = owner_request.owner_request_answer;
    this.owner_request_answer_image = owner_request.owner_request_answer_image;
    this.owner_request_check = owner_request.owner_request_check;
    this.owner_request_answer_time = owner_request.owner_request_answer_time;
    this.admin = owner_request.admin;
  }
}
export class OwnerRequestQuery {
  answer: boolean;
  owner_id: Types.ObjectId;
  constructor(data) {
    this.answer = data.answer;
    this.owner_id = data.owner_id;
  }
  Query() {
    const query = { owner_request_active: true };
    if (this.answer != null) query['owner_request_check'] = this.answer;
    if (this.owner_id) query['owner.uid'] = this.owner_id;
    return query;
  }
}
