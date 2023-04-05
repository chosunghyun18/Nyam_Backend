import { Types } from 'mongoose';
import { getCurrentDate, getCurrentDay } from '../common/util/dateTime';
import { Promotion } from './promotion.model';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { Store } from 'src/store/store.model';
export class PromotionAddRequest {
  store: PromotionStore;
  campus_id: Types.ObjectId;
  promotion_title: string;
  promotion_sub: string;
  promotion_created_at: Date;
  promotion_start_at: Date;
  promotion_end_at: Date;
  constructor(data, store: Store) {
    this.store = new PromotionStore(store);
    this.campus_id = data.campus_id;
    this.promotion_title = data.promotion_title;
    this.promotion_sub = data.promotion_sub;
    this.promotion_created_at = getCurrentDate(new Date());
    this.promotion_start_at = new Date(data.promotion_start_at);
    this.promotion_end_at = new Date(data.promotion_end_at);
  }
}
export class PromotionUpdateRequest {
  promotion_id: Types.ObjectId;
  store: PromotionStore;
  campus_id: Types.ObjectId;
  promotion_sub: string;
  promotion_title: string;
  promotion_start_at: Date;
  promotion_end_at: Date;
  constructor(data) {
    this.promotion_id = data.promotion_id;
    this.store = data.store;
    this.campus_id = data.campus_id;
    this.promotion_sub = data.promotion_sub;
    this.promotion_title = data.promotion_title;
    this.promotion_start_at = new Date(data.promotion_start_at);
    this.promotion_end_at = new Date(data.promotion_end_at);
  }
}

export class PromotionView {
  promotion_id: Types.ObjectId;
  store: PromotionStore;
  campus_id: Types.ObjectId;
  promotion_sub: string;
  promotion_title: string;
  promotion_start_at: Date;
  promotion_end_at: Date;
  promotion_block: boolean;
  promotion_active: boolean;
  constructor(promotion: Promotion) {
    this.promotion_id = promotion.id;
    this.store = promotion.store;
    this.campus_id = promotion.campus_id;
    this.promotion_sub = promotion.promotion_sub;
    this.promotion_title = promotion.promotion_title;
    this.promotion_start_at = promotion.promotion_start_at;
    this.promotion_end_at = promotion.promotion_end_at;
    this.promotion_active = promotion.promotion_active;
    this.promotion_block = promotion.promotion_block;
  }
}

export class PromotionMangeView {
  promotion_id: Types.ObjectId;
  store: PromotionStore;
  campus_id: Types.ObjectId;
  promotion_sub: string;
  promotion_title: string;
  promotion_start_at: Date;
  promotion_end_at: Date;
  promotion_created_at: Date;
  promotion_block: boolean;
  promotion_active: boolean;
  admin: OtherAdmin;
  constructor(promotion: Promotion) {
    this.promotion_id = promotion.id;
    this.store = promotion.store;
    this.campus_id = promotion.campus_id;
    this.promotion_sub = promotion.promotion_sub;
    this.promotion_title = promotion.promotion_title;
    this.promotion_start_at = promotion.promotion_start_at;
    this.promotion_end_at = promotion.promotion_end_at;
    this.promotion_created_at = promotion.promotion_created_at;
    this.promotion_block = promotion.promotion_block;
    this.promotion_active = promotion.promotion_active;
    this.admin = promotion.admin;
  }
}
export class PromotionStore {
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

export class PromotionQuery {
  campus_id: Types.ObjectId;
  store_id: Types.ObjectId;
  promotion_block: boolean;
  active: boolean;
  start: boolean;
  end: boolean;

  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_id = data.store_id;
    this.promotion_block = data.promotion_block;
    this.active = data.active;
    this.start = data.start;
    this.end = data.end;
  }
  Query() {
    const query = { promotion_active: true, promotion_block: false };
    if (this.campus_id) {
      query['campus_id'] = this.campus_id;
    }
    if (this.store_id) {
      query['store.store_id'] = this.store_id;
    }
    if (this.active) {
      query['promotion_start_at'] = { $lte: getCurrentDate(new Date()) };
      query['promotion_end_at'] = { $gte: getCurrentDay(new Date()) };
    }
    if (this.promotion_block) {
      query['promotion_block'] = true;
    }

    if (this.start) {
      query['promotion_start_at'] = { $gt: getCurrentDate(new Date()) };
    }
    if (this.end) {
      query['promotion_end_at'] = { $lt: getCurrentDay(new Date()) };
    }
    return query;
  }
}
export class PromotionInnerQuery {
  campus_id: Types.ObjectId;
  store_id: Types.ObjectId;
  promotion_block: boolean;
  active: boolean;
  start: boolean;
  end: boolean;

  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_id = data.store_id;
    this.promotion_block = data.promotion_block;
    this.active = data.active;
    this.start = data.start;
    this.end = data.end;
  }
  Query() {
    const query = { promotion_active: true, promotion_block: false };
    if (this.campus_id) {
      query['campus_id'] = this.campus_id;
    }
    if (this.store_id) {
      query['store.store_id'] = this.store_id;
    }
    if (this.active) {
      query['promotion_start_at'] = { $lte: getCurrentDate(new Date()) };
      query['promotion_end_at'] = { $gte: getCurrentDay(new Date()) };
    }
    if (this.promotion_block) {
      query['promotion_block'] = true;
    }
    if (this.start) {
      query['promotion_start_at'] = { $gt: getCurrentDate(new Date()) };
    }
    if (this.end) {
      query['promotion_end_at'] = { $lt: getCurrentDay(new Date()) };
    }
    return query;
  }
}
