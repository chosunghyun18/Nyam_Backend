import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './store.model';
import {
  MangeStoreView,
  OwnerStoreView,
  StoreAddRequest,
  StoreQuery,
  StoreAdminQuery,
  StoreAdminSearchQuery,
  StoreUpdateRequest,
  StoreUserSearchQuery,
  StoreUserQuery,
  UserStoreView,
  StoreAdminUpdateRequest,
  StoreSetViewQuery,
} from './store.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { Types } from 'mongoose';
import { Category, SPCategory } from 'src/category/category.model';
import { CategoryView, SpCategoryView } from 'src/category/category.object';
import { ReviewInnerQuery } from 'src/review/review.object';
import { EventInnerQuery } from 'src/event/event.object';
import { LabInnerQuery } from 'src/lab/lab.object';
import { LabService } from 'src/lab/lab.service';
import { EventService } from 'src/event/event.service';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { RecruitmentService } from 'src/recruitment/recruitment.service';
import { DiscountService } from 'src/discount/discount.service';
import { ReviewService } from 'src/review/review.service';
import { PromotionService } from 'src/promotion/promotion.service';
import { Owner } from 'src/user/models/owner.model';
import {
  RecruitmentInnerQuery,
  RecruitmentQuery,
} from 'src/recruitment/recruitment.object';
import {
  DiscountInnerQuery,
  DiscountQuery,
} from 'src/discount/discount.object';
import {
  PromotionInnerQuery,
  PromotionQuery,
} from 'src/promotion/promotion.object';
import { LogsService } from 'src/logs/logs.service';
@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name)
    private readonly storeModel: Model<Store>,
    private readonly labService: LabService,
    private readonly eventService: EventService,
    private readonly recruitmentService: RecruitmentService,
    private readonly discountService: DiscountService,
    private readonly promotionService: PromotionService,
    private readonly logsService: LogsService,
    @Inject(forwardRef(() => ReviewService))
    private readonly reviewService: ReviewService,
    @Inject(forwardRef(() => BookmarkService))
    private readonly bookmarkService: BookmarkService, // @InjectModel(ActionLog.name) private readonly actionModel: Model<ActionLog>,
  ) {}

  // clear 매장 생성
  async add(data: StoreAddRequest) {
    const new_data = await this.storeModel.create(data);
    return new_data;
  }
  async store_admin_search_list(query: StoreAdminSearchQuery) {
    const list = await this.storeModel.find(query.query());
    return list;
  }
  async store_user_search_list(query: StoreUserSearchQuery) {
    const list = await this.storeModel
      .find(query.query())
      .sort(query.sortQuery());
    return list;
  }
  // clear 매장 리스트  - 필터 리스트 필터 종류 , 대학교 기준
  async store_list(query: StoreQuery) {
    const list = await this.storeModel.find(query.query());
    return list;
  }

  async store_admin_list(query: StoreAdminQuery) {
    const list = await this.storeModel.find(query.query());
    return list;
  }

  async store_user_list(query: StoreUserQuery) {
    const list = await this.storeModel
      .find(query.query())
      .sort(query.sortQuery())
      .skip(query.skipPage())
      .limit(query.count);
    return list;
  }
  async store_user_list_test(query: StoreUserQuery) {
    const list = await this.storeModel.find(query.query());
    return list;
  }
  async store_admin_update(
    update_data: StoreAdminUpdateRequest,
    isAdmin: boolean,
  ) {
    const store = await this.store_detail(update_data.store_id, isAdmin);
    store.campus_id = update_data.campus_id;
    store.store_name = update_data.store_name;
    store.store_thumbnail_image = update_data.store_thumbnail_image;
    store.store_images = update_data.store_images;
    store.store_location = update_data.store_location;
    store.store_call = update_data.store_call;
    store.category = update_data.category;
    store.sp_categorys = update_data.sp_categorys;
    store.store_facility = update_data.store_facility;
    store.store_menus = update_data.store_menus;
    store.store_holidays = update_data.store_holidays;
    store.store_time = update_data.store_time;
    store.admin = update_data.admin;
    await store.save();
    return store;
  }
  // clear 매장 수정
  async store_update(update_data: StoreUpdateRequest, isAdmin: boolean) {
    const store = await this.store_detail(update_data.store_id, isAdmin);
    store.campus_id = update_data.campus_id;
    store.store_name = update_data.store_name;
    store.store_thumbnail_image = update_data.store_thumbnail_image;
    store.store_images = update_data.store_images;
    store.store_location = update_data.store_location;
    store.store_call = update_data.store_call;
    store.category = update_data.category;
    store.sp_categorys = update_data.sp_categorys;
    store.store_facility = update_data.store_facility;
    store.store_menus = update_data.store_menus;
    store.store_holidays = update_data.store_holidays;
    store.store_time = update_data.store_time;
    await store.save();
    return store;
  }

  // clear 매장 remove put : add 성현
  async store_remove_v2(
    store_id: Types.ObjectId,
    user_id: Types.ObjectId,
    isAdmin: boolean,
    store_active: boolean,
  ) {
    const store = await this.storeModel.findById(store_id);
    if (isAdmin) {
      store.store_active = store_active;
      await store.save();
      return true;
    }
    if (store.owner_type == 'owner') {
      if (store.owner_id != user_id)
        throw new ForbiddenException('매장 주인만 삭제 처리하실수 있습니다.'); // 관리자는 삭제가 불가 ?
      store.store_active = false; // 매장 주인은 삭제만 가능
      await store.save();
      return true;
    }
  }

  // clear 매장 삭제
  async store_remove_v1(
    store_id: Types.ObjectId,
    user_id: Types.ObjectId,
    isAdmin: boolean,
  ) {
    const store = await this.storeModel.findById(store_id);
    if (isAdmin) {
      store.store_active = false;
      await store.save();
      return true;
    }
    if (store.owner_type == 'owner') {
      if (store.owner_id != user_id)
        throw new ForbiddenException('매장 주인만 삭제 처리하실수 있습니다.');
      store.store_active = false;
      await store.save();
      return true;
    }
  }
  // clear 매장 휴일 추가하기
  async store_holiday_add(store_id: Types.ObjectId, holiday: Date) {
    const store = await this.storeModel.findById(store_id);
    store.store_holidays.push(holiday);
    await store.save();
    return store;
  }
  // clear 매장 휴일 삭제하기
  async store_holiday_remove(store_id: Types.ObjectId, holiday: Date) {
    const store = await this.storeModel.findById(store_id);
    const findIndex = store.store_holidays.findIndex((e) => e == holiday);
    store.store_holidays.splice(findIndex, 1);
    await store.save();
    return store;
  }
  //clear 매장 차단하기
  async store_block(
    store_id: Types.ObjectId,
    admin: OtherAdmin,
    action: boolean,
  ) {
    const store = await this.storeModel.findById(store_id);
    store.store_block = action;
    store.admin = admin;
    await store.save();
    return store;
  }

  // clear 매장 기본 보기
  async store_detail(store_id: Types.ObjectId, isAdmin: boolean) {
    const store = await this.storeModel.findById(store_id);
    if (!store)
      throw new NotFoundException('찾으시는 데이터가 존재하지 않습니다.');
    if (!isAdmin && store.store_block)
      throw new BadRequestException('차단된 가게입니다.');
    if (!isAdmin && !store.store_active)
      throw new NotFoundException('찾으시는 데이터가 존재하지 않습니다.');
    return store;
  }

  async store_all_detail(store_id: Types.ObjectId) {
    const store = await this.storeModel.findById(store_id);
    if (!store)
      throw new NotFoundException('찾으시는 데이터가 존재하지 않습니다.');
    return store;
  }

  //clear 매장 리스트 가져오기
  async findByList(store_ids: Types.ObjectId[]) {
    const store = await this.storeModel.find({
      _id: { $in: store_ids },
    });
    return store;
  }

  // clear Page Rotue
  async pageCheck(query: StoreUserQuery) {
    const totalcount = await this.storeModel.find(query.query());
    const totalPage = Math.ceil(totalcount.length / query.count) - 1;
    const currentPage = query.page;
    const prev = query.page == 0 ? false : true;
    const next = query.page < totalPage ? true : false;

    const pageRoute = {
      total: totalPage,
      prev: prev,
      next: next,
      currentPage: currentPage,
      storeTotalCount: totalcount.length,
    };

    return pageRoute;
  }
  // clear 관리자 전환
  async store_admin(store_id: Types.ObjectId, admin: OtherAdmin) {
    const data = await this.storeModel.findById(store_id);
    data.admin = admin;
    await data.save();
    return data;
  }

  // async store_set_view(query: StoreSetViewQuery) {
  //   const stores = await this.storeModel.find(query.query());
  //   const logItems = await this.logsService.getActionLogListToSetView();
  //   const storeCount = new Map<string, number>();
  //   logItems.forEach((logItem) => {
  //     const storeId = logItem.table_id.toString();
  //     if (!storeCount.has(storeId)) {
  //       storeCount.set(storeId, 1);
  //     } else {
  //       storeCount.set(storeId, storeCount.get(storeId) + 1);
  //     }
  //   });
  //   for (let i = 0; i < stores.length; i++) {
  //     const storeId = stores[i]._id.toString();
  //     const count = storeCount.get(storeId) ?? 0;
  //     stores[i].store_view = count;
  //     await stores[i].save();
  //   }
  //   return true;
  // }

  async store_set_view(query: StoreSetViewQuery) {
    const stores = await this.storeModel.find(query.query());
    const logItems = await this.logsService.getActionLogListToSetView();

    const storeCount = new Map();
    logItems.forEach(({ table_id }) => {
      storeCount.set(table_id.toString(), (storeCount.get(table_id) || 0) + 1);
    });

    await Promise.all(
      stores.map(async (store) => {
        const storeId = store._id.toString();
        const count = storeCount.get(storeId) || 0;
        store.store_view = count;
        await store.save();
      }),
    );

    return true;
  }

  async store_set_total_view(query: StoreSetViewQuery) {
    const items = await this.storeModel.find(query.query());

    await Promise.all([
      items.map((e) => {
        e.store_total_view = e.save();
      }),
    ]);
    return true;
  }
  // clear 카테고리 변경시
  async category_update(category: Category) {
    const items = await this.storeModel.find({
      'category.category_id': category.id,
    });

    await Promise.all([
      items.map((e) => {
        e.category = new CategoryView(category);
        e.save();
      }),
    ]);
    return true;
  }
  // clear 특수 카테고리 변경시
  async sp_category_update(category: SPCategory) {
    const items = await this.storeModel.find({
      'sp_categorys.category_id': category.id,
    });

    await Promise.all([
      items.map((e) => {
        const findIndex = e.sp_categorys.findIndex(
          (item) => item.category_id == category.id,
        );
        e.sp_categorys[findIndex] = new SpCategoryView(category);
        e.save();
      }),
    ]);
    return true;
  }
  // clear 매장 이전
  async store_move(
    store_id: Types.ObjectId,
    owner_id: Types.ObjectId,
    admin: OtherAdmin,
  ) {
    const store = await this.storeModel.findById(store_id);
    store.admin = admin;
    store.owner_id = owner_id;
    store.owner_type = 'owner';
    await store.save();

    return store;
  }

  // * Detail Sub Query
  //clear admin
  async store_detail_sub_admin(store: Store) {
    const [
      active_reviews,
      block_reviews,
      actvie_events,
      reversed_events,
      end_events,
      block_events,
      actvie_labs,
      reversed_labs,
      end_labs,
      block_labs,
      active_recruitments,
      start_recruitments,
      end_recruitments,
      block_recruitments,
      active_discounts,
      start_discounts,
      end_discounts,
      block_discounts,
    ] = await Promise.all([
      this.reviewService.storeReviews(
        new ReviewInnerQuery({ store_id: store.id }),
      ),
      this.reviewService.storeReviews(
        new ReviewInnerQuery({ store_id: store.id, review_block: true }),
      ),
      // Event
      this.eventService.event_list(
        new EventInnerQuery({ store_id: store.id, active: true }),
      ),

      this.eventService.event_list(
        new EventInnerQuery({ store_id: store.id, reserved: true }),
      ),

      this.eventService.event_list(
        new EventInnerQuery({ store_id: store.id, end: true }),
      ),

      this.eventService.event_list(
        new EventInnerQuery({ store_id: store.id, event_block: true }),
      ),
      // Lab
      this.labService.store_list(
        new LabInnerQuery({ store_id: store.id, active: true }),
      ),
      this.labService.store_list(
        new LabInnerQuery({ store_id: store.id, reserved: true }),
      ),
      this.labService.store_list(
        new LabInnerQuery({ store_id: store.id, end: true }),
      ),
      this.labService.store_list(
        new LabInnerQuery({ store_id: store.id, lab_block: true }),
      ),

      // recruitment
      this.recruitmentService.recruitment_list(
        new RecruitmentInnerQuery({ store_id: store.id, active: true }),
      ),
      this.recruitmentService.recruitment_list(
        new RecruitmentInnerQuery({ store_id: store.id, start: true }),
      ),
      this.recruitmentService.recruitment_list(
        new RecruitmentInnerQuery({ store_id: store.id, end: true }),
      ),
      this.recruitmentService.recruitment_list(
        new RecruitmentInnerQuery({
          store_id: store.id,
          recruitment_block: true,
        }),
      ),

      // discount
      this.discountService.discount_list(
        new DiscountInnerQuery({ store_id: store.id, active: true }),
      ),
      this.discountService.discount_list(
        new DiscountInnerQuery({ store_id: store.id, start: true }),
      ),
      this.discountService.discount_list(
        new DiscountInnerQuery({ store_id: store.id, end: true }),
      ),
      this.discountService.discount_list(
        new DiscountInnerQuery({ store_id: store.id, discount_block: true }),
      ),
    ]);

    return new MangeStoreView(
      store,
      active_reviews,
      block_reviews,
      actvie_events,
      reversed_events,
      end_events,
      block_events,
      actvie_labs,
      reversed_labs,
      end_labs,
      block_labs,
      active_recruitments,
      start_recruitments,
      end_recruitments,
      block_recruitments,
      active_discounts,
      start_discounts,
      end_discounts,
      block_discounts,
    );
  }

  async store_detail_sub_owenr(store: Store) {
    const [
      active_reviews,
      actvie_events,
      reversed_events,
      end_events,
      actvie_labs,
      reversed_labs,
      end_labs,
      active_recruitments,
      start_recruitments,
      end_recruitments,
      active_discounts,
      start_discounts,
      end_discounts,
      active_promotions,
      start_promotions,
      end_promotions,
    ] = await Promise.all([
      this.reviewService.storeReviews(
        new ReviewInnerQuery({ store_id: store.id }),
      ),

      // Event
      this.eventService.event_list(
        new EventInnerQuery({ store_id: store.id, active: true }),
      ),

      this.eventService.event_list(
        new EventInnerQuery({ store_id: store.id, reserved: true }),
      ),

      this.eventService.event_list(
        new EventInnerQuery({ store_id: store.id, end: true }),
      ),

      // Lab
      this.labService.store_list(
        new LabInnerQuery({ store_id: store.id, active: true }),
      ),
      this.labService.store_list(
        new LabInnerQuery({ store_id: store.id, reserved: true }),
      ),
      this.labService.store_list(
        new LabInnerQuery({ store_id: store.id, end: true }),
      ),

      // recruitment
      this.recruitmentService.recruitment_list(
        new RecruitmentInnerQuery({ store_id: store.id, active: true }),
      ),
      this.recruitmentService.recruitment_list(
        new RecruitmentInnerQuery({ store_id: store.id, start: true }),
      ),
      this.recruitmentService.recruitment_list(
        new RecruitmentInnerQuery({ store_id: store.id, end: true }),
      ),

      // discount
      this.discountService.discount_list(
        new DiscountInnerQuery({ store_id: store.id, active: true }),
      ),
      this.discountService.discount_list(
        new DiscountInnerQuery({ store_id: store.id, start: true }),
      ),
      this.discountService.discount_list(
        new DiscountInnerQuery({ store_id: store.id, end: true }),
      ),
      this.promotionService.promotion_list(
        new PromotionInnerQuery({ store_id: store.id, end: true }),
      ),
      this.promotionService.promotion_list(
        new PromotionInnerQuery({ store_id: store.id, end: true }),
      ),
      this.promotionService.promotion_list(
        new PromotionInnerQuery({ store_id: store.id, end: true }),
      ),
    ]);
    const data = new OwnerStoreView(
      store,
      active_reviews,
      actvie_events,
      reversed_events,
      end_events,
      actvie_labs,
      reversed_labs,
      end_labs,
      active_recruitments,
      start_recruitments,
      end_recruitments,
      active_discounts,
      start_discounts,
      end_discounts,
      active_promotions,
      start_promotions,
      end_promotions,
    );
    return data;
  }

  async store_detail_sub_user(store: Store) {
    const [reviews, events, lab_list, recruitment, discount, promotion] =
      await Promise.all([
        this.reviewService.storeReviews(
          new ReviewInnerQuery({ store_id: store.id }),
        ),
        this.eventService.event_list(
          new EventInnerQuery({ store_id: store.id, active: true }),
        ),
        this.labService.store_list(
          new LabInnerQuery({ store_id: store.id, active: true }),
        ),
        this.recruitmentService.recruitment_list(
          new RecruitmentQuery({ store_id: store.id, active: true }),
        ),
        this.discountService.discount_list(
          new DiscountQuery({ store_id: store.id, active: true }),
        ),
        this.promotionService.promotion_list(
          new PromotionQuery({ store_id: store.id, active: true }),
        ),
      ]);
    const item = new UserStoreView(
      store,
      reviews,
      events,
      lab_list,
      recruitment,
      discount,
      promotion,
    );
    return item;
  }

  // * Update Sub Query
  async store_update_sub(store: Store, admin: any | OtherAdmin) {
    await Promise.all([
      this.labService.store_update(store, admin ?? null),
      this.eventService.store_update(store, admin ?? null),
      this.reviewService.storeUpdate(store, admin ?? null),
      this.recruitmentService.store_update(store, admin ?? null),
      this.promotionService.store_update(store, admin ?? null),
      this.discountService.store_update(store, admin ?? null),
      this.bookmarkService.store_update(store),
    ]);
    return true;
  }

  // * Owner Store List
  async store_owner_list(owner: Owner) {
    const items = await this.storeModel.find({
      owner_id: owner.id,
      owner_type: 'owner',
      store_active: true,
      store_block: false,
    });
    return items;
  }
  async store_owner_list_admin(owner: Owner) {
    const items = await this.storeModel.find({
      owner_id: owner.id,
      owner_type: 'owner',
      store_active: true,
    });
    return items;
  }

  // * Owner Remove
  async store_owner_remove(owner: Owner) {
    const items = await this.store_owner_list(owner);
    const remove_prosess = await items.map((item) => {
      item.store_active = false;
      item.save();
    });
    await Promise.all(remove_prosess);
    const result = await this.store_owner_list(owner);
    return result;
  } // * Owner Block

  async store_owner_block(owner: Owner, action: boolean) {
    const items = await this.store_owner_list(owner);
    const remove_prosess = await items.map((item) => {
      item.store_block = action;
      item.save();
    });
    await Promise.all(remove_prosess);
    const result = await this.store_owner_list(owner);
    return result;
  }
}
