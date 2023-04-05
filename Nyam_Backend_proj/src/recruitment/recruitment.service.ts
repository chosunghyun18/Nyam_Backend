import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recruitment } from './recruitment.model';
import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import {
  RecruitmentAddRequest,
  RecruitmentInnerQuery,
  RecruitmentQuery,
  RecruitmentStore,
  RecruitmentUpdateRequest,
} from './recruitment.object';
import { Store } from 'src/store/store.model';
import { getCurrentDay } from 'src/common/util/dateTime';
@Injectable()
export class RecruitmentService {
  constructor(
    @InjectModel(Recruitment.name)
    private readonly recruitmentModel: Model<Recruitment>,
  ) {}

  // 구인 구직 리스트
  async recruitment_list(query: RecruitmentQuery) {
    const items = await this.recruitmentModel
      .find(query.Query())
      .sort({ recruitment_end_at: -1 });
    return items;
  }

  // clear 이벤트 상세보기
  async recruitment_detail(recruitment_id: Types.ObjectId, isAdmin: boolean) {
    const item = await this.recruitmentModel.findOne({
      _id: recruitment_id,
      recruitment_active: true,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');
    if (!isAdmin && item.recruitment_block)
      throw new BadRequestException('차단된 데이터 입니다.');
    return item;
  }

  // clear 구인구직 추가하기
  async recruitment_add(create_data: RecruitmentAddRequest) {
    const item = await this.recruitmentModel.create(create_data);
    return item;
  }
  //clear  구인구직 삭제하기
  async recruitment_remove(recruitment_id: Types.ObjectId) {
    const item = await this.recruitmentModel.findOne({
      _id: recruitment_id,
      recruitment_active: true,
      recruitment_block: false,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');

    item.recruitment_active = false;
    await item.save();
    return item;
  }
  // clear 이벤트 수정하기
  async recruitment_update(update_data: RecruitmentUpdateRequest) {
    console.log(update_data.recruitment_id);
    const item = await this.recruitmentModel.findOne({
      _id: update_data.recruitment_id,
      recruitment_active: true,
      recruitment_block: false,
    });

    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');
    item.store = update_data.store;
    item.campus_id = update_data.campus_id;
    item.recruitment_sub = update_data.recruitment_sub;
    item.recruitment_image = update_data.recruitment_image;
    item.recruitment_start_at = update_data.recruitment_start_at;
    item.recruitment_end_at = update_data.recruitment_end_at;
    item.recruitment_gender = update_data.recruitment_gender;
    item.recruitment_type = update_data.recruitment_type;
    await item.save();
    return item;
  }

  // clear 이벤트 차단하기
  async recruitment_block(recruitment_id: Types.ObjectId, action: boolean) {
    const item = await this.recruitmentModel.findOne({
      _id: recruitment_id,
    });
    if (!item) throw new NotFoundException('데이터가 조회되지 않습니다.');

    item.recruitment_block = action;
    await item.save();
    return item;
  }

  // clear 구인구직 관리자 변경
  async recruitment_admin(recruitment_id: Types.ObjectId, admin: OtherAdmin) {
    const item = await this.recruitmentModel.findById(recruitment_id);
    if (!item) throw new NotFoundException('데이터를 조회할수 없습니다.');
    item.admin = admin;
    await item.save();
    return item;
  }

  // clear 매장 변경시
  async store_update(store: Store, admin: any | OtherAdmin) {
    const items = await this.recruitmentModel.find({
      'store.store_id': store.id,
    });

    await Promise.all(
      items.map((element) => {
        if (admin != null) element.admin = admin;
        element.store = new RecruitmentStore(store);
        element.recruitment_active = store.store_active;
        element.recruitment_block = store.store_block;
        element.save();
      }),
    );
    return true;
  }

  // clear 매장 리스트
  async store_recruitments(query: RecruitmentInnerQuery) {
    const items = await this.recruitmentModel.find(query.Query());
    return items;
  }

  // event Check
  async push_recruitment_check() {
    const items = await this.recruitmentModel.find({
      recruitment_block: false,
      recruitment_active: true,
      recruitment_start_at: { $eq: getCurrentDay(new Date()) },
    });

    return items;
  }
}
