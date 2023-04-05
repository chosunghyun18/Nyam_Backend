import { Types } from 'mongoose';
import { getCurrentDate, getCurrentDay } from '../common/util/dateTime';
import { Recruitment } from './recruitment.model';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { Store } from 'src/store/store.model';
export class RecruitmentAddRequest {
  store: RecruitmentStore;
  campus_id: Types.ObjectId;
  recruitment_sub: string;
  recruitment_image: string;
  recruitment_created_at: Date;
  recruitment_start_at: Date;
  recruitment_end_at: Date;
  recruitment_gender: string;
  recruitment_type: string;
  constructor(data, store: Store) {
    this.store = new RecruitmentStore(store);
    this.campus_id = data.campus_id;
    this.recruitment_sub = data.recruitment_sub;
    this.recruitment_image = data.recruitment_image;
    this.recruitment_created_at = getCurrentDate(new Date());
    this.recruitment_start_at = new Date(data.recruitment_start_at);
    this.recruitment_end_at = new Date(data.recruitment_end_at);
    this.recruitment_gender = data.recruitment_gender;
    this.recruitment_type = data.recruitment_type;
  }
}
export class RecruitmentUpdateRequest {
  recruitment_id: Types.ObjectId;
  store: RecruitmentStore;
  campus_id: Types.ObjectId;
  recruitment_sub: string;
  recruitment_image: string;
  recruitment_start_at: Date;
  recruitment_end_at: Date;
  recruitment_gender: string;
  recruitment_type: string;
  constructor(data) {
    this.recruitment_id = data.recruitment_id;
    this.store = data.store;
    this.campus_id = data.campus_id;
    this.recruitment_sub = data.recruitment_sub;
    this.recruitment_image = data.recruitment_image;
    this.recruitment_start_at = new Date(data.recruitment_start_at);
    this.recruitment_end_at = new Date(data.recruitment_end_at);
    this.recruitment_gender = data.recruitment_gender;
    this.recruitment_type = data.recruitment_type;
  }
}

export class RecruitmentView {
  recruitment_id: Types.ObjectId;
  store: RecruitmentStore;
  campus_id: Types.ObjectId;
  recruitment_sub: string;
  recruitment_image: string;
  recruitment_start_at: Date;
  recruitment_end_at: Date;
  recruitment_block: boolean;
  recruitment_active: boolean;
  recruitment_gender: string;
  recruitment_type: string;
  constructor(recruitment: Recruitment) {
    this.recruitment_id = recruitment.id;
    this.store = recruitment.store;
    this.campus_id = recruitment.campus_id;
    this.recruitment_sub = recruitment.recruitment_sub;
    this.recruitment_image = recruitment.recruitment_image;
    this.recruitment_start_at = recruitment.recruitment_start_at;
    this.recruitment_end_at = recruitment.recruitment_end_at;
    this.recruitment_active = recruitment.recruitment_active;
    this.recruitment_block = recruitment.recruitment_block;
    this.recruitment_gender = recruitment.recruitment_gender;
    this.recruitment_type = recruitment.recruitment_type;
  }
}

export class RecruitmentMangeView {
  recruitment_id: Types.ObjectId;
  store: RecruitmentStore;
  campus_id: Types.ObjectId;
  recruitment_sub: string;
  recruitment_image: string;
  recruitment_start_at: Date;
  recruitment_end_at: Date;
  recruitment_created_at: Date;
  recruitment_block: boolean;
  recruitment_active: boolean;
  recruitment_gender: string;
  recruitment_type: string;
  admin: OtherAdmin;
  constructor(recruitment: Recruitment) {
    this.recruitment_id = recruitment.id;
    this.store = recruitment.store;
    this.campus_id = recruitment.campus_id;
    this.recruitment_sub = recruitment.recruitment_sub;
    this.recruitment_image = recruitment.recruitment_image;
    this.recruitment_start_at = recruitment.recruitment_start_at;
    this.recruitment_end_at = recruitment.recruitment_end_at;
    this.recruitment_active = recruitment.recruitment_active;
    this.recruitment_block = recruitment.recruitment_block;
    this.recruitment_created_at = recruitment.recruitment_created_at;
    this.recruitment_gender = recruitment.recruitment_gender;
    this.recruitment_type = recruitment.recruitment_type;
    this.admin = recruitment.admin;
  }
}
export class RecruitmentStore {
  owner_id: Types.ObjectId;
  owner_type: string;
  store_id: Types.ObjectId;
  store_name: string;
  cateogry_id: Types.ObjectId;
  category_name: string;
  constructor(store: Store) {
    this.owner_id = store.owner_id;
    this.owner_type = store.owner_type;
    this.store_name = store.store_name;
    this.store_id = store.id;
    this.cateogry_id = store.category.category_id;
    this.category_name = store.category.category_name;
  }
}

export class RecruitmentQuery {
  campus_id: Types.ObjectId;
  store_id: Types.ObjectId;
  recruitment_block: boolean;
  active: boolean;
  start: boolean;
  end: boolean;
  // 쿼리 확인
  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_id = data.store_id;
    this.recruitment_block = data.recruitment_block;
    this.active = data.active;
    this.start = data.start;
    this.end = data.end;
  }
  Query() {
    const query = { recruitment_active: true, recruitment_block: false };
    if (this.campus_id) {
      query['campus_id'] = this.campus_id;
    }
    if (this.store_id) {
      query['store.store_id'] = this.store_id;
    }
    if (this.active) {
      query['recruitment_start_at'] = { $lte: getCurrentDate(new Date()) };
      query['recruitment_end_at'] = { $gte: getCurrentDay(new Date()) };
    }
    if (this.recruitment_block) {
      query['recruitment_block'] = true;
    }

    if (this.start) {
      query['recruitment_start_at'] = { $gt: getCurrentDate(new Date()) };
    }
    if (this.end) {
      query['recruitment_end_at'] = { $lt: getCurrentDay(new Date()) };
    }
    return query;
  }
}
export class RecruitmentInnerQuery {
  campus_id: Types.ObjectId;
  store_id: Types.ObjectId;
  recruitment_block: boolean;
  active: boolean;
  start: boolean;
  end: boolean;

  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_id = data.store_id;
    this.recruitment_block = data.recruitment_block;
    this.active = data.active;
    this.start = data.start;
    this.end = data.end;
  }
  Query() {
    const query = { recruitment_active: true, recruitment_block: false };
    if (this.campus_id) {
      query['campus_id'] = this.campus_id;
    }
    if (this.store_id) {
      query['store.store_id'] = this.store_id;
    }
    if (this.active) {
      query['recruitment_start_at'] = { $lte: getCurrentDate(new Date()) };
      query['recruitment_end_at'] = { $gte: getCurrentDay(new Date()) };
    }
    if (this.recruitment_block) {
      query['recruitment_block'] = true;
    }
    if (this.start) {
      query['recruitment_start_at'] = { $gt: getCurrentDate(new Date()) };
    }
    if (this.end) {
      query['recruitment_end_at'] = { $lt: getCurrentDay(new Date()) };
    }
    return query;
  }
}
