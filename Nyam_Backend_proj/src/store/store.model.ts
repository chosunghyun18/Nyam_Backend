import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryView, SpCategoryView } from 'src/category/category.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import {
  StoreFacility,
  StoreLocation,
  StoreMenu,
  StoreTime,
} from './store.object';
@Schema()
export class Store extends Document {
  // & 매장 주인
  @Prop({ type: Types.ObjectId, required: true })
  owner_id: Types.ObjectId;

  // & 매장 주인 타입
  @Prop({ type: String, required: true, enum: ['owner', 'admin'] })
  owner_type: string;

  // & 캠퍼스 Id
  @Prop({ type: Types.ObjectId, ref: 'campus', required: true })
  campus_id: Types.ObjectId;

  // & 매장 카테고리
  @Prop({
    type: {
      _id: false,
      category_id: Types.ObjectId,
      category_name: String,
    },
    required: true,
  })
  category: CategoryView;

  // & 매장 특별 장르
  @Prop({
    type: [
      {
        _id: false,
        category_id: Types.ObjectId,
        category_name: String,
        category_image: String,
      },
    ],
    default: [],
  })
  sp_categorys: SpCategoryView[];

  // & 매장 이름
  @Prop({ type: String, required: true })
  store_name: string;

  // 매장 썸네일 & 로고 : add : 성현
  @Prop({ type: String, required: true })
  store_thumbnail_image: string;

  // & 매장 이미지
  @Prop({ type: [String], default: [] })
  store_images: string[];

  // & 매장 위치
  @Prop({
    _id: false,

    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    local_address: String,
    load_address: String,
    region_1depth_name: String,
    region_2depth_name: String,
    region_3depth_name: String,
    region_4depth_name: String,
    region_5depth_name: String,
    lon: Number,
    lat: Number,
  })
  store_location: StoreLocation;

  // & 매장 번호
  @Prop({ type: String, required: true })
  store_call: string;

  // & 매장 시설
  @Prop({ type: [{ _id: false, name: String, image: String }], default: [] })
  store_facility: StoreFacility[];

  // & 매장 메뉴 리스트
  @Prop({
    type: { _id: false, name: String, price: Number, image: String },
    default: [],
  })
  store_menus: StoreMenu[];

  // & 매장 별점
  @Prop({ default: 0.0, type: Number })
  store_rating: number;

  // & 매장 맛별점
  @Prop({ default: 0.0, type: Number })
  store_taste_rating: number;
  // & 매장 서비스 별점
  @Prop({
    default: 0.0,
    type: Number,
  })
  store_service_rating: number;
  // & 매장 리뷰 수
  @Prop({ default: 0, type: Number })
  store_review_count: number;
  // & 매장 조회수
  @Prop({ default: 0, type: Number })
  store_view;
  // & 매장 전체 조회수
  @Prop({ default: 0, type: Number })
  store_total_view;
  // & 매장 휴일
  @Prop({ type: [Date], default: [] })
  store_holidays: Date[];

  // & 매장 영업 시간 : add : break_time 성현
  @Prop({
    type: {
      _id: false,
      mon: String,
      tue: String,
      wed: String,
      thu: String,
      fri: String,
      sat: String,
      sun: String,
      break_time: String,
    },
  })
  store_time: StoreTime;

  // & 즐겨찾기 리스트 카운트
  @Prop({ type: Number, default: 0 })
  store_bookmark_count: number;
  // & 매장 활성화 여부
  @Prop({ type: Boolean, default: true })
  store_active: boolean;

  // & 매장 차단 여부
  @Prop({ type: Boolean, default: false })
  store_block: boolean;

  // & 매장 생성일
  @Prop({ type: Date, required: true })
  store_created_at: Date;

  // & 매장 이벤트 활성화 수
  @Prop({ type: Number, default: 0 })
  store_event_active_count: number;

  // & 매장 라스트 관리자
  @Prop({
    type: {
      _id: false,
      uid: Types.ObjectId,
      admin_nickname: String,
      admin_profile: String,
      admin_active: Boolean,
    },
  })
  admin: OtherAdmin;
}

const _StoreSchema = SchemaFactory.createForClass(Store);
export const StoreSchema = _StoreSchema;
