import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount } from './discount.model';
import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import {
  DiscountAddRequest,
  DiscountInnerQuery,
  DiscountQuery,
  DiscountStore,
  DiscountUpdateRequest,
} from './discount.object';
import { Store } from 'src/store/store.model';
import { getCurrentDay } from 'src/common/util/dateTime';
@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name)
    private readonly discountModel: Model<Discount>,
  ) {}

  // 마감 할인 리스트
  async discount_list(query: DiscountQuery) {
    const items = await this.discountModel
      .find(query.Query())
      .sort({ discount_end_at: 1 });
    return items;
  }

  // clear 마감 할인 상세보기
  async discount_detail(discount_id: Types.ObjectId, isAdmin: boolean) {
    const item = await this.discountModel.findOne({
      _id: discount_id,
      discount_active: true,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');
    if (!isAdmin && item.discount_block)
      throw new BadRequestException('차단된 데이터 입니다.');
    return item;
  }

  // clear 마감 할인 추가하기 time_out 전부 false 처리
  async discount_add(create_data: DiscountAddRequest, time_out: Discount[]) {
    time_out.map((element) => {
      element.discount_active = false;
      element.save();
    });
    const item = await this.discountModel.create(create_data);
    return item;
  }
  //clear  마감 할인 삭제하기
  async discount_remove(discount_id: Types.ObjectId) {
    const item = await this.discountModel.findOne({
      _id: discount_id,
      discount_active: true,
      discount_block: false,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');

    item.discount_active = false;
    await item.save();
    return item;
  }
  // clear 마감 할인 수정하기
  async discount_update(update_data: DiscountUpdateRequest) {
    console.log(update_data.discount_id);
    const item = await this.discountModel.findOne({
      _id: update_data.discount_id,
      discount_active: true,
      discount_block: false,
    });

    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');
    item.store = update_data.store;
    item.campus_id = update_data.campus_id;
    item.discount_sub = update_data.discount_sub;
    item.discount_image = update_data.discount_image;
    item.discount_start_at = update_data.discount_start_at;
    item.discount_end_at = update_data.discount_end_at;
    item.discount_rate = update_data.discount_rate;
    await item.save();
    return item;
  }

  // clear 마감 할인 차단하기
  async discount_block(discount_id: Types.ObjectId, action: boolean) {
    const item = await this.discountModel.findOne({
      _id: discount_id,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');

    item.discount_block = action;
    await item.save();
    return item;
  }

  // clear 마감 할인 관리자 변경
  async discount_admin(discount_id: Types.ObjectId, admin: OtherAdmin) {
    const item = await this.discountModel.findById(discount_id);
    if (!item) throw new NotFoundException('데이터를 조회할수 없습니다.');
    item.admin = admin;
    await item.save();
    return item;
  }

  // clear 매장 변경시
  async store_update(store: Store, admin: any | OtherAdmin) {
    const items = await this.discountModel.find({
      'store.store_id': store.id,
    });

    await Promise.all(
      items.map((element) => {
        if (admin != null) element.admin = admin;
        element.store = new DiscountStore(store);
        element.discount_active = store.store_active;
        element.discount_block = store.store_block;
        element.save();
      }),
    );
    return true;
  }

  // clear 매장 리스트
  async store_discounts(query: DiscountInnerQuery) {
    const items = await this.discountModel.find(query.Query());
    return items;
  }

  // 마감 할인 Check
  async push_discount_check() {
    const items = await this.discountModel.find({
      discount_block: false,
      discount_active: true,
      discount_start_at: { $eq: getCurrentDay(new Date()) },
    });

    return items;
  }
}
