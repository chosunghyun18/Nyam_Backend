import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StreetFood } from './streetFood.model';
import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import {
  StreetFoodAddRequest,
  StreetFoodInnerQuery,
  StreetFoodQuery,
  StreetFoodUpdateRequest,
} from './streetFood.object';
import { getCurrentDay } from 'src/common/util/dateTime';
@Injectable()
export class StreetFoodService {
  constructor(
    @InjectModel(StreetFood.name)
    private readonly streetFoodModel: Model<StreetFood>,
  ) {}
  //길거리 음식 리스트
  async street_food_list(query: StreetFoodQuery) {
    const items = await this.streetFoodModel
      .find(query.Query())
      .sort({ street_food_end_at: -1 });
    return items;
  }

  //길거리 음식 상세보기
  async street_food_detail(street_food_id: Types.ObjectId, isAdmin: boolean) {
    const item = await this.streetFoodModel.findOne({
      _id: street_food_id,
      street_food_active: true,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');
    if (!isAdmin && item.street_food_block)
      throw new BadRequestException('차단된 데이터 입니다.');
    return item;
  }

  //길거리 음식 추가하기
  async street_food_add(create_data: StreetFoodAddRequest) {
    const item = await this.streetFoodModel.create(create_data);
    return item;
  }
  //clear  가게 소식 삭제하기
  async street_food_remove(street_food_id: Types.ObjectId) {
    const item = await this.streetFoodModel.findOne({
      _id: street_food_id,
      street_food_active: true,
      street_food_block: false,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');

    item.street_food_active = false;
    await item.save();
    return item;
  }
  //길거리 음식 수정하기
  async street_food_update(update_data: StreetFoodUpdateRequest) {
    const item = await this.streetFoodModel.findOne({
      _id: update_data.street_food_id,
      street_food_active: true,
      street_food_block: false,
    });

    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');
    item.campus_id = update_data.campus_id;
    item.street_food_name = update_data.street_food_name;
    item.street_food_sub = update_data.street_food_sub;
    await item.save();
    return item;
  }

  //길거리 음식 차단하기
  async street_food_block(street_food_id: Types.ObjectId, action: boolean) {
    const item = await this.streetFoodModel.findOne({
      _id: street_food_id,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');

    item.street_food_block = action;
    await item.save();
    return item;
  }

  //길거리 음식  관리자 변경
  async street_food_admin(street_food_id: Types.ObjectId, admin: OtherAdmin) {
    const item = await this.streetFoodModel.findById(street_food_id);
    if (!item) throw new NotFoundException('데이터를 조회할수 없습니다.');
    item.admin = admin;
    await item.save();
    return item;
  }

  // street_food Check
  async push_street_food_check() {
    const items = await this.streetFoodModel.find({
      street_food_block: false,
      street_food_active: true,
      street_food_start_at: { $eq: getCurrentDay(new Date()) },
    });

    return items;
  }
}
