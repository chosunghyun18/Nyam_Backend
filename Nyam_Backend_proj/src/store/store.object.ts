import { Types } from 'mongoose';
import { Store } from './store.model';
import { getCurrentDate } from '../common/util/dateTime';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { CategoryView, SpCategoryView } from 'src/category/category.object';
import { EventMangeView, EventView } from 'src/event/event.object';
import { ReviewMangeView, ReviewView } from '../review/review.object';
import { LabMangeView, LabView } from '../lab/lab.object';
import {
  RecruitmentMangeView,
  RecruitmentView,
} from '../recruitment/recruitment.object';
import {
  PromotionMangeView,
  PromotionView,
} from '../promotion/promotion.object';
import { DiscountMangeView, DiscountView } from 'src/discount/discount.object';
import { Review } from 'src/review/review.model';
import { Lab } from 'src/lab/lab.model';
import { Event } from 'src/event/event.model';
import { Recruitment } from 'src/recruitment/recruitment.model';
import { Discount } from 'src/discount/discount.model';
import { Promotion } from 'src/promotion/promotion.model';

//$ 편의 시설
export class StoreFacility {
  name: string;
  image: string;
  constructor(data) {
    this.name = data.name;
    this.image = data.image;
  }
}
//$ 메뉴
export class StoreMenu {
  name: string;
  price: number;
  image: string;
  constructor(data) {
    this.name = data.name;
    this.image = data.image;
    this.price = data.price;
  }
}
//$ 영업시간
export class StoreTime {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
  break_time: String;
  constructor(data) {
    this.mon = data.mon;
    this.tue = data.tue;
    this.wed = data.wed;
    this.thu = data.thu;
    this.fri = data.fri;
    this.sat = data.sat;
    this.sun = data.sun;
    this.break_time = data.break_time;
  }
}
// $ 스토어 위치
export class StoreLocation {
  type: string;
  coordinates: [number, number];
  local_address: string;
  load_address: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  region_5depth_name: string;
  lon: number;
  lat: number;

  constructor(data) {
    this.type = 'Point';
    this.local_address = data.local_address;
    this.load_address = data.load_address;
    this.region_1depth_name = data.region_1depth_name;
    this.region_2depth_name = data.region_2depth_name;
    this.region_3depth_name = data.region_3depth_name;
    this.region_4depth_name = data.region_4depth_name;
    this.region_5depth_name = data.region_5depth_name;
    this.coordinates = [data.lon, data.lat];

    this.lon = data.lon;
    this.lat = data.lat;
  }
}

// $ 스토아 추가 요청
export class StoreAddRequest {
  owner_id: Types.ObjectId;
  owner_type: string;
  campus_id: Types.ObjectId;
  store_name: string;
  store_thumbnail_image: string;
  store_images: string[];
  store_location: StoreLocation;
  store_call: string;
  category: CategoryView;
  sp_categorys: SpCategoryView[];
  store_facility: StoreFacility[];
  store_menus: StoreMenu[];
  store_created_at: Date;
  store_actvice: boolean;
  store_time: StoreTime;
  constructor(data, owner, owner_type) {
    this.owner_id = owner;
    this.owner_type = owner_type;
    this.campus_id = data.campus_id;
    this.store_name = data.store_name;
    this.store_thumbnail_image = data.store_thumbnail_image;
    this.store_images = data.store_images;
    this.store_location = new StoreLocation(data.store_location);
    this.store_call = data.store_call;
    this.category = data.category;
    this.sp_categorys = data.sp_categorys;
    this.store_facility = data.store_facility;
    this.store_menus = data.store_menus;
    this.store_time = new StoreTime(data.store_time);
    this.store_created_at = getCurrentDate(new Date());
  }
}
export class StoreAdminUpdateRequest {
  store_id: Types.ObjectId;
  campus_id: Types.ObjectId;
  store_name: string;
  store_thumbnail_image: string;
  store_images: string[];
  store_location: StoreLocation;
  store_call: string;
  category: CategoryView;
  sp_categorys: SpCategoryView[];
  store_facility: StoreFacility[];
  store_menus: StoreMenu[];
  store_holidays: Date[];
  store_time: StoreTime;
  admin: OtherAdmin;
  constructor(data, admin: OtherAdmin) {
    this.store_id = data.store_id;
    this.campus_id = data.campus_id;
    this.store_name = data.store_name;
    this.store_thumbnail_image = data.store_thumbnail_image;
    this.store_images = data.store_images;
    this.store_location = data.store_location;
    this.store_call = data.store_call;
    this.category = data.category;
    this.sp_categorys = data.sp_categorys;
    this.store_facility = data.store_facility;
    this.store_menus = data.store_menus;
    this.store_holidays = data.store_holidays;
    this.store_time = data.store_time;
    this.admin = admin;
  }
}

// $ 스토아 수정 요청
export class StoreUpdateRequest {
  store_id: Types.ObjectId;
  campus_id: Types.ObjectId;
  store_name: string;
  store_thumbnail_image: string;
  store_images: string[];
  store_location: StoreLocation;
  store_call: string;
  category: CategoryView;
  sp_categorys: SpCategoryView[];
  store_facility: StoreFacility[];
  store_menus: StoreMenu[];
  store_holidays: Date[];
  store_time: StoreTime;

  constructor(data, admin: any | OtherAdmin) {
    this.store_id = data.store_id;
    this.campus_id = data.campus_id;
    this.store_name = data.store_name;
    this.store_thumbnail_image = data.store_thumbnail_image;
    this.store_images = data.store_images;
    this.store_location = data.store_location;
    this.store_call = data.store_call;
    this.category = data.category;
    this.sp_categorys = data.sp_categorys;
    this.store_facility = data.store_facility;
    this.store_menus = data.store_menus;
    this.store_holidays = data.store_holidays;
    this.store_time = data.store_time;
  }
}
// $ 스토어 주인 뷰
export class OwnerStoreView {
  store_id: Types.ObjectId;
  owner_id: Types.ObjectId;
  owner_type: string;
  campus_id: Types.ObjectId;
  store_name: string;
  store_thumbnail_image: string;
  store_images: string[];
  store_location: StoreLocation;
  store_call: string;
  category: CategoryView;
  sp_categorys: SpCategoryView[];
  store_facility: StoreFacility[];
  store_menus: StoreMenu[];
  store_holidays: Date[];
  store_time: StoreTime;
  store_rating: number;
  store_taste_rating: number;
  store_review_count: number;
  store_bookmark_count: number;
  store_service_rating: number;
  reviews: ReviewView[];

  actvie_events: EventView[];
  reversed_events: EventView[];
  end_events: EventView[];

  actvie_labs: LabView[];
  reversed_labs: LabView[];
  end_labs: LabView[];

  active_recruitments: RecruitmentView[];
  start_recruitments: RecruitmentView[];
  end_recruitments: RecruitmentView[];

  active_discounts: DiscountView[];
  start_discounts: DiscountView[];
  end_discounts: DiscountView[];

  active_promotions: PromotionView[];
  start_promotions: PromotionView[];
  end_promotions: PromotionView[];

  constructor(
    store: Store,
    reviews: Review[],

    actvie_events: Event[],
    reversed_events: Event[],
    end_events: Event[],

    actvie_labs: Lab[],
    reversed_labs: Lab[],
    end_labs: Lab[],

    active_recruitments: Recruitment[],
    start_recruitments: Recruitment[],
    end_recruitments: Recruitment[],

    active_discounts: Discount[],
    start_discounts: Discount[],
    end_discounts: Discount[],

    active_promotions: Promotion[],
    start_promotions: Promotion[],
    end_promotions: Promotion[],
  ) {
    this.store_id = store.id;
    this.owner_id = store.owner_id;
    this.owner_type = store.owner_type;
    this.campus_id = store.campus_id;
    this.store_name = store.store_name;
    this.store_thumbnail_image = store.store_thumbnail_image;
    this.store_images = store.store_images;
    this.store_location = store.store_location;
    this.store_call = store.store_call;
    this.category = store.category;
    this.sp_categorys = store.sp_categorys;
    this.store_facility = store.store_facility;
    this.store_menus = store.store_menus;
    this.store_holidays = store.store_holidays;
    this.store_time = store.store_time;
    this.store_rating = store.store_rating;
    this.store_taste_rating = store.store_taste_rating;
    this.store_review_count = store.store_review_count;
    this.store_service_rating = store.store_service_rating;
    this.store_bookmark_count = store.store_bookmark_count;
    this.reviews = reviews.map((e) => new ReviewView(e));

    this.actvie_events = actvie_events.map((e) => new EventView(e));
    this.reversed_events = reversed_events.map((e) => new EventView(e));
    this.end_events = end_events.map((e) => new EventView(e));

    this.actvie_labs = actvie_labs.map((e) => new LabView(e));
    this.reversed_labs = reversed_labs.map((e) => new LabView(e));
    this.end_labs = end_labs.map((e) => new LabView(e));

    this.active_recruitments = active_recruitments.map(
      (e) => new RecruitmentView(e),
    );
    this.start_recruitments = start_recruitments.map(
      (e) => new RecruitmentView(e),
    );
    this.end_recruitments = end_recruitments.map((e) => new RecruitmentView(e));

    this.active_discounts = active_discounts.map((e) => new DiscountView(e));
    this.start_discounts = start_discounts.map((e) => new DiscountView(e));
    this.end_discounts = end_discounts.map((e) => new DiscountView(e));

    this.active_promotions = active_promotions.map((e) => new PromotionView(e));
    this.start_promotions = start_promotions.map((e) => new PromotionView(e));
    this.end_promotions = end_promotions.map((e) => new PromotionView(e));
  }
}
// $ 스토어 유저 뷰
export class UserStoreView {
  store_id: Types.ObjectId;
  campus_id: Types.ObjectId;
  store_name: string;
  store_thumbnail_image: string;
  store_images: string[];
  store_location: StoreLocation;
  store_call: string;
  category: CategoryView;
  sp_categorys: SpCategoryView[];
  store_facility: StoreFacility[];
  store_menus: StoreMenu[];
  store_holidays: Date[];
  store_time: StoreTime;
  store_rating: number;
  store_taste_rating: number;
  store_review_count: number;
  store_bookmark_count: number;
  store_event_active_count: number;
  store_service_rating: number;
  reviews: ReviewView[];
  events: EventView[];
  labs: LabView[];
  recruitments: RecruitmentView[];
  discounts: DiscountView[];
  promotions: PromotionView[];
  constructor(
    store: Store,
    reviews: Review[],
    events: Event[],
    labs: Lab[],
    recruitments: Recruitment[],
    discounts: Discount[],
    promotions: Promotion[],
  ) {
    this.store_id = store.id;
    this.campus_id = store.campus_id;
    this.store_name = store.store_name;
    this.store_thumbnail_image = store.store_thumbnail_image;
    this.store_images = store.store_images;
    this.store_location = store.store_location;
    this.store_call = store.store_call;
    this.category = store.category;
    this.sp_categorys = store.sp_categorys;
    this.store_facility = store.store_facility;
    this.store_menus = store.store_menus;
    this.store_holidays = store.store_holidays;
    this.store_time = store.store_time;
    this.store_rating = store.store_rating;
    this.store_taste_rating = store.store_taste_rating;
    this.store_service_rating = store.store_service_rating;
    this.store_review_count = store.store_review_count;
    this.store_bookmark_count = store.store_bookmark_count;
    this.store_event_active_count = store.store_event_active_count;
    this.reviews = reviews.map((e) => new ReviewView(e));
    this.events = events.map((e) => new EventView(e));
    this.labs = labs.map((e) => new LabView(e));
    this.recruitments = recruitments.map((e) => new RecruitmentView(e));
    this.discounts = discounts.map((e) => new DiscountView(e));
    this.promotions = promotions.map((e) => new PromotionView(e));
  }
}
// $ 스토어 관리 뷰
export class MangeStoreView {
  store_id: Types.ObjectId;
  owner_id: Types.ObjectId;
  owner_type: string;
  campus_id: Types.ObjectId;
  store_name: string;
  store_thumbnail_image: string;
  store_images: string[];
  store_location: StoreLocation;
  store_call: string;
  category: CategoryView;
  sp_categorys: SpCategoryView[];
  store_facility: StoreFacility[];
  store_menus: StoreMenu[];
  store_holidays: Date[];
  store_time: StoreTime;
  store_rating: number;
  store_taste_rating: number;
  store_review_count: number;
  store_bookmark_count: number;
  store_active: boolean;
  store_block: boolean;
  store_created_at: Date;
  store_event_active_count: number;
  store_service_rating: number;
  active_reviews: ReviewMangeView[];
  block_reviews: ReviewMangeView[];

  actvie_events: EventMangeView[];
  reversed_events: EventMangeView[];
  end_events: EventMangeView[];
  block_events: EventMangeView[];

  actvie_labs: LabMangeView[];
  reversed_labs: LabMangeView[];
  end_labs: LabMangeView[];
  block_labs: LabMangeView[];

  active_recruitments: RecruitmentMangeView[];
  start_recruitments: RecruitmentMangeView[];
  end_recruitments: RecruitmentMangeView[];
  block_recruitments: RecruitmentMangeView[];

  active_discounts: DiscountMangeView[];
  start_discounts: DiscountMangeView[];
  end_discounts: DiscountMangeView[];
  block_discounts: DiscountMangeView[];

  actvie_promotions: LabMangeView[];
  start_promotions: LabMangeView[];
  end_promotions: LabMangeView[];
  block_promotions: LabMangeView[];

  admin: OtherAdmin | any;
  constructor(
    store: Store,
    active_reviews: Review[],
    block_reviews: Review[],

    actvie_events: Event[],
    reversed_events: Event[],
    end_events: Event[],
    block_events: Event[],

    actvie_labs: Lab[],
    reversed_labs: Lab[],
    end_labs: Lab[],
    block_labs: Lab[],

    active_recruitments: Recruitment[],
    start_recruitments: Recruitment[],
    end_recruitments: Recruitment[],
    block_recruitments: Recruitment[],

    active_discounts: Discount[],
    start_discounts: Discount[],
    end_discounts: Discount[],
    block_discounts: Discount[],
  ) {
    this.store_id = store.id;
    this.owner_id = store.owner_id;
    this.owner_type = store.owner_type;
    this.campus_id = store.campus_id;
    this.store_name = store.store_name;
    this.store_thumbnail_image = store.store_thumbnail_image;
    this.store_images = store.store_images;
    this.store_location = store.store_location;
    this.store_call = store.store_call;
    this.category = store.category;
    this.sp_categorys = store.sp_categorys;
    this.store_facility = store.store_facility;
    this.store_menus = store.store_menus;
    this.store_holidays = store.store_holidays;
    this.store_time = store.store_time;
    this.store_rating = store.store_rating;
    this.store_taste_rating = store.store_taste_rating;
    this.store_review_count = store.store_review_count;
    this.store_bookmark_count = store.store_bookmark_count;
    this.store_active = store.store_active;
    this.store_block = store.store_block;
    this.store_service_rating = store.store_service_rating;
    this.admin = store.admin ?? null;
    this.store_created_at = store.store_created_at;
    this.store_event_active_count = store.store_event_active_count;
    this.active_reviews = active_reviews.map((e) => new ReviewMangeView(e));
    this.block_reviews = block_reviews.map((e) => new ReviewMangeView(e));

    this.actvie_labs = actvie_labs.map((e) => new LabMangeView(e));
    this.reversed_labs = reversed_labs.map((e) => new LabMangeView(e));
    this.end_labs = end_labs.map((e) => new LabMangeView(e));
    this.block_labs = block_labs.map((e) => new LabMangeView(e));

    this.actvie_events = actvie_events.map((e) => new EventMangeView(e));
    this.reversed_events = reversed_events.map((e) => new EventMangeView(e));
    this.end_events = end_events.map((e) => new EventMangeView(e));
    this.block_events = block_events.map((e) => new EventMangeView(e));

    this.active_recruitments = active_recruitments.map(
      (e) => new RecruitmentMangeView(e),
    );
    this.start_recruitments = start_recruitments.map(
      (e) => new RecruitmentMangeView(e),
    );
    this.end_recruitments = end_recruitments.map(
      (e) => new RecruitmentMangeView(e),
    );
    this.block_recruitments = block_recruitments.map(
      (e) => new RecruitmentMangeView(e),
    );

    this.active_discounts = active_discounts.map(
      (e) => new DiscountMangeView(e),
    );
    this.start_discounts = start_discounts.map((e) => new DiscountMangeView(e));
    this.end_discounts = end_discounts.map((e) => new DiscountMangeView(e));
    this.block_discounts = block_discounts.map((e) => new DiscountMangeView(e));
  }
}

export class StoreQuery {
  campus_id: Types.ObjectId;
  owner_id: Types.ObjectId;
  block: boolean;
  type: string;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.owner_id = data.owner_id;
    this.block = data.block;
    this.type = data.type;
  }
  query() {
    const query = { store_active: true };
    if (this.campus_id) query['campus_id'] = this.campus_id;
    if (this.owner_id) query['owner_id'] = this.owner_id;
    if (this.block) query['store_block'] = this.block;
    if (this.type) query['owner_type'] = this.type;
    return query;
  }
}

export class StoreSetViewQuery {
  campus_id: Types.ObjectId;
  store_active: boolean;
  block: boolean;
  start: boolean;
  end: boolean;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.store_active = data.store_active;
  }
  query() {
    const query = {};
    if (this.store_active) query['store_active'] = this.store_active;
    if (this.campus_id) query['campus_id'] = this.campus_id;
    if (this.block) query['store_block'] = this.block;
    return query;
  }
}

export class StoreAdminQuery {
  campus_id: Types.ObjectId;
  owner_id: Types.ObjectId;
  block: boolean;
  type: string;
  store_active: boolean;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.owner_id = data.owner_id;
    this.block = data.block;
    this.type = data.type;
    this.store_active = data.store_active;
  }
  query() {
    const query = {};
    if (this.store_active) query['store_active'] = this.store_active;
    if (this.campus_id) query['campus_id'] = this.campus_id;
    if (this.owner_id) query['owner_id'] = this.owner_id;
    if (this.block) query['store_block'] = this.block;
    if (this.type) query['owner_type'] = this.type;
    return query;
  }
}
export class StoreAdminSearchQuery {
  store_active: boolean;
  campus_id: Types.ObjectId;
  owner_id: Types.ObjectId;
  block: boolean;
  type: string;
  store_name: string;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.block = data.block;
    this.type = data.type;
    this.store_active = data.store_active;
    this.store_name = data.store_name.trim();
  }
  query() {
    const query = {};
    if (this.store_active) query['store_active'] = this.store_active;
    if (this.campus_id) query['campus_id'] = this.campus_id;
    if (this.block) query['store_block'] = this.block;
    if (this.type) query['owner_type'] = this.type;
    // db.컬렉션.find({target : 'A'})
    if (this.store_name)
      query['store_name'] = {
        $in: [
          new RegExp(
            this.store_name + '|' + this.store_name.replace(/ /g, ''),
            'g',
          ),
          new RegExp(this.store_name.split('').join('\\s*'), 'g'),
          new RegExp('.*' + this.store_name + '.*', 'i'),
        ],
      };
    return query;
  }
}
// add : store search query object :성현
export class StoreUserSearchQuery {
  campus_id: Types.ObjectId;
  search: string;
  sort: string;

  constructor(data) {
    this.campus_id = data.campus_id;
    this.search = data.search.trim();

    //정렬
    switch (data.sort) {
      case 'view':
        this.sort = 'store_view';
        break;
      case 'total_view':
        this.sort = 'store_total_view';
        break;
      case 'rating':
        this.sort = 'store_rating';
        break;
      case 'review_count':
        this.sort = 'store_review_count';
        break;
      case 'store_event_active_count':
        this.sort = 'store_event_active_count';
        break;
      default:
        this.sort = 'total_view';
        break;
    }
  }

  query() {
    const query = {
      campus_id: this.campus_id,
      store_active: true,
      store_block: false,
    };
    if (this.campus_id) query['campus_id'] = this.campus_id;

    if (this.search) {
      const search = this.search.trim();
      const searchOrigin = new RegExp(search, 'gi');
      const searchSplit = new RegExp(search.split('').join('\\s*'), 'gi');

      query['$or'] = [
        { store_name: searchOrigin },
        { 'store_menus.name': searchOrigin },
        { store_name: searchSplit },
        { 'store_menus.name': searchSplit },
      ];
    }
    return query;
  }
  sortQuery() {
    const sort = {};
    sort[this.sort] = -1;
    sort['store_created_at'] = 1;
    return sort;
  }
}
// refact : 성현
export class StoreUserQuery {
  campus_id: Types.ObjectId;
  category_name: string;
  category_type: string;
  sort: string;
  page: number;
  count: number;
  constructor(data) {
    this.campus_id = data.campus_id;
    this.page = data.page ?? 0;
    this.count = 16;
    // 내림차순 - 정렬
    switch (data.sort) {
      case 'rating':
        this.sort = 'store_rating';
        break;
      case 'review_count':
        this.sort = 'store_review_count';
        break;
      case 'store_event_active_count':
        this.sort = 'store_event_active_count';
        break;
      default:
        this.sort = 'store_event_active_count';
        break;
    }

    // 쿼리
    this.category_name = data.category_name;
    // 쿼리
    this.category_type = data.category_type;
  }
  query() {
    const query = {
      campus_id: this.campus_id,
      store_active: true,
      store_block: false,
    };
    if (this.category_type && this.category_name) {
      if (this.category_type == 'sp')
        query['sp_categorys.category_name'] = this.category_name;
      else query['category.category_name'] = this.category_name;
    }
    return query;
  }
  sortQuery() {
    const sort = {};
    sort[this.sort] = -1;
    sort['store_created_at'] = 1;
    return sort;
  }
  skipPage() {
    return this.count * this.page;
  }
}
