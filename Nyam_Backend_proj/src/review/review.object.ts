import { OtherUser } from 'src/user/objects/user.object';
import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { User } from 'src/user/models/user.model';
import { Review } from './review.model';
import { getCurrentDate } from '../common/util/dateTime';
import { Store } from 'src/store/store.model';
import { Campus } from 'src/campus/campus.model';


export class ReviewQuery {
  campus_id: Types.ObjectId;
  store_id: Types.ObjectId;
  review_block: boolean;
  page: number;
  count: number;
  user_id: Types.ObjectId;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_id = data.store_id;
    this.review_block = data.event_block;
    this.page = data.page;
    this.count = 8;
  }
  Query() {
    const query = { review_block: false };
    if (this.campus_id) {
      query['campus.campus_id'] = this.campus_id;
    }
    if (this.store_id) {
      query['store.store_id'] = this.store_id;
    }
    if (this.review_block) {
      query['user.uid'] = this.user_id;
    }

    if (this.review_block) {
      query['review_block'] = true;
    }
    return query;
  }
  Skip() {
    return this.page * this.count;
  }
}
export class ReviewInnerQuery {
  campus_id: Types.ObjectId;
  store_id: Types.ObjectId;
  review_block: boolean;
  user_id: Types.ObjectId;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_id = data.store_id;
    this.review_block = data.review_block;
    this.user_id = data.user_id;
  }
  Query() {
    const query = { review_block: false };
    if (this.campus_id) {
      query['campus.campus_id'] = this.campus_id;
    }
    if (this.store_id) {
      query['store.store_id'] = this.store_id;
    }
    if (this.user_id) {
      query['user.uid'] = this.user_id;
    }
    if (this.review_block) {
      query['review_block'] = true;
    }

    return query;
  }
}
