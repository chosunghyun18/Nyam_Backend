import { Types } from 'mongoose';
import { getCurrentDate, getCurrentDay } from '../common/util/dateTime';
import { Discount } from './discount.model';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { Store } from 'src/store/store.model';
export class DiscountAddRequest {
  store: DiscountStore;
  campus_id: Types.ObjectId;
  discount_sub: string;
  discount_image: string;
  discount_created_at: Date;
  discount_start_at: Date;
  discount_end_at: Date;
  discount_rate: string;
  constructor(data, store: Store) {
    this.store = new DiscountStore(store);
    this.campus_id = data.campus_id;
    this.discount_sub = data.discount_sub;
    this.discount_image = data.discount_image;
    this.discount_created_at = getCurrentDate(new Date());
    this.discount_start_at = new Date(data.discount_start_at);
    this.discount_end_at = new Date(data.discount_end_at);
    this.discount_rate = data.discount_rate;
  }
}
export class DiscountUpdateRequest {
  discount_id: Types.ObjectId;
  store: DiscountStore;
  campus_id: Types.ObjectId;
  discount_sub: string;
  discount_image: string;
  discount_start_at: Date;
  discount_end_at: Date;
  discount_rate: string;
  constructor(data) {
    this.discount_id = data.discount_id;
    this.store = data.store;
    this.campus_id = data.campus_id;
    this.discount_sub = data.discount_sub;
    this.discount_image = data.discount_image;
    this.discount_start_at = new Date(data.discount_start_at);
    this.discount_end_at = new Date(data.discount_end_at);
    this.discount_rate = data.discount_rate;
  }
}

export class DiscountView {
  discount_id: Types.ObjectId;
  store: DiscountStore;
  campus_id: Types.ObjectId;
  discount_sub: string;
  discount_image: string;
  discount_start_at: Date;
  discount_end_at: Date;
  discount_block: boolean;
  discount_active: boolean;
  discount_rate: string;
  constructor(discount: Discount) {
    this.discount_id = discount.id;
    this.store = discount.store;
    this.campus_id = discount.campus_id;
    this.discount_sub = discount.discount_sub;
    this.discount_image = discount.discount_image;
    this.discount_start_at = discount.discount_start_at;
    this.discount_end_at = discount.discount_end_at;
    this.discount_active = discount.discount_active;
    this.discount_block = discount.discount_block;
    this.discount_rate = discount.discount_rate;
  }
}

export class DiscountMangeView {
  discount_id: Types.ObjectId;
  store: DiscountStore;
  campus_id: Types.ObjectId;
  discount_sub: string;
  discount_image: string;
  discount_start_at: Date;
  discount_end_at: Date;
  discount_created_at: Date;
  discount_block: boolean;
  discount_active: boolean;
  discount_rate: string;
  admin: OtherAdmin;
  constructor(discount: Discount) {
    this.discount_id = discount.id;
    this.store = discount.store;
    this.campus_id = discount.campus_id;
    this.discount_sub = discount.discount_sub;
    this.discount_image = discount.discount_image;
    this.discount_start_at = discount.discount_start_at;
    this.discount_end_at = discount.discount_end_at;
    this.discount_active = discount.discount_active;
    this.discount_block = discount.discount_block;
    this.discount_created_at = discount.discount_created_at;
    this.discount_rate = discount.discount_rate;
    this.admin = discount.admin;
  }
}
export class DiscountStore {
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

export class DiscountQuery {
  campus_id: Types.ObjectId;
  store_id: Types.ObjectId;
  discount_block: boolean;
  active: boolean;
  start: boolean;
  end: boolean;
  time_out: boolean;

  // 쿼리 확인
  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_id = data.store_id;
    this.discount_block = data.discount_block;
    this.active = data.active;
    this.start = data.start;
    this.end = data.end;
    this.time_out = data.time_out;
  }
  Query() {
    const query = { discount_active: true, discount_block: false };
    if (this.campus_id) {
      query['campus_id'] = this.campus_id;
    }
    if (this.store_id) {
      query['store.store_id'] = this.store_id;
    }
    if (this.active) {
      query['discount_start_at'] = { $lte: getCurrentDate(new Date()) };
      query['discount_end_at'] = { $gte: getCurrentDate(new Date()) };
    }
    if (this.discount_block) {
      query['discount_block'] = true;
    }

    if (this.start) {
      query['discount_start_at'] = { $gt: getCurrentDate(new Date()) };
    }
    if (this.end) {
      query['discount_end_at'] = { $lt: getCurrentDate(new Date()) };
    }
    if (this.time_out) {
      const current_time = getCurrentDate(new Date());
      query['discount_start_at'] = { $lt: current_time };
      const current_time_end = getCurrentDate(new Date());
      query['discount_end_at'] = {
        $gte: current_time_end.setDate(current_time_end.getDate() - 1),
        $lte: getCurrentDate(new Date()),
      };
    }
    return query;
  }
}
export class DiscountInnerQuery {
  campus_id: Types.ObjectId;
  store_id: Types.ObjectId;
  discount_block: boolean;
  active: boolean;
  start: boolean;
  end: boolean;
  time_out: boolean;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_id = data.store_id;
    this.discount_block = data.discount_block;
    this.active = data.active;
    this.start = data.start;
    this.end = data.end;
    this.time_out = data.time_out;
  }
  Query() {
    const query = { discount_active: true, discount_block: false };
    if (this.campus_id) {
      query['campus_id'] = this.campus_id;
    }
    if (this.store_id) {
      query['store.store_id'] = this.store_id;
    }
    if (this.active) {
      query['discount_start_at'] = { $lte: getCurrentDate(new Date()) };
      query['discount_end_at'] = { $gte: getCurrentDay(new Date()) };
    }
    if (this.discount_block) {
      query['discount_block'] = true;
    }
    if (this.start) {
      query['discount_start_at'] = { $gt: getCurrentDate(new Date()) };
    }
    if (this.end) {
      query['discount_end_at'] = { $lt: getCurrentDay(new Date()) };
    }
    return query;
  }
}
