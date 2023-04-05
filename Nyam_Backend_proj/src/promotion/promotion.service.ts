import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion } from './promotion.model';
import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import {
  PromotionAddRequest,
  PromotionInnerQuery,
  PromotionQuery,
  PromotionStore,
  PromotionUpdateRequest,
} from './promotion.object';
import { Store } from 'src/store/store.model';
import { getCurrentDay } from 'src/common/util/dateTime';
@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<Promotion>,
  ) {}
  // clear 가게 소식 리스트
  async promotion_list(query: PromotionQuery) {
    const items = await this.promotionModel
      .find(query.Query())
      .sort({ promotion_end_at: 1 });
    return items;
  }

  // clear 가게 소식 상세보기
  async promotion_detail(promotion_id: Types.ObjectId, isAdmin: boolean) {
    const item = await this.promotionModel.findOne({
      _id: promotion_id,
      promotion_active: true,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');
    if (!isAdmin && item.promotion_block)
      throw new BadRequestException('차단된 데이터 입니다.');
    return item;
  }

  // clear 가게 소식 추가하기
  async promotion_add(create_data: PromotionAddRequest) {
    const item = await this.promotionModel.create(create_data);
    return item;
  }
  //clear  가게 소식 삭제하기
  async promotion_remove(promotion_id: Types.ObjectId) {
    const item = await this.promotionModel.findOne({
      _id: promotion_id,
      promotion_active: true,
      promotion_block: false,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');

    item.promotion_active = false;
    await item.save();
    return item;
  }
  // clear 가게 소식 수정하기
  async promotion_update(update_data: PromotionUpdateRequest) {
    const item = await this.promotionModel.findOne({
      _id: update_data.promotion_id,
      promotion_active: true,
      promotion_block: false,
    });

    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');
    item.store = update_data.store;
    item.campus_id = update_data.campus_id;
    item.promotion_title = update_data.promotion_title;
    item.promotion_sub = update_data.promotion_sub;
    item.promotion_start_at = update_data.promotion_start_at;
    item.promotion_end_at = update_data.promotion_end_at;
    await item.save();
    return item;
  }

  // clear 가게 소식 차단하기
  async promotion_block(promotion_id: Types.ObjectId, action: boolean) {
    const item = await this.promotionModel.findOne({
      _id: promotion_id,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');

    item.promotion_block = action;
    await item.save();
    return item;
  }

  // clear 가게 소식  관리자 변경
  async promotion_admin(promotion_id: Types.ObjectId, admin: OtherAdmin) {
    const item = await this.promotionModel.findById(promotion_id);
    if (!item) throw new NotFoundException('데이터를 조회할수 없습니다.');
    item.admin = admin;
    await item.save();
    return item;
  }

  // clear 매장 변경시
  async store_update(store: Store, admin: any | OtherAdmin) {
    const items = await this.promotionModel.find({
      'store.store_id': store.id,
    });

    await Promise.all(
      items.map((element) => {
        if (admin != null) element.admin = admin;
        element.store = new PromotionStore(store);
        element.promotion_active = store.store_active;
        element.promotion_block = store.store_block;
        element.save();
      }),
    );
    return true;
  }

  // clear 매장 리스트
  async store_promotions(query: PromotionInnerQuery) {
    const items = await this.promotionModel.find(query.Query());
    return items;
  }

  // promotion Check
  async push_promotion_check() {
    const items = await this.promotionModel.find({
      promotion_block: false,
      promotion_active: true,
      promotion_start_at: { $eq: getCurrentDay(new Date()) },
    });

    return items;
  }
}
