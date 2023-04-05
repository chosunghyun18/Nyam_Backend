import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { RecruitmentStore } from './recruitment.object';

@Schema()
export class Recruitment extends Document {
  // & store
  @Prop({
    type: {
      _id: false,
      owner_id: Types.ObjectId,
      owner_type: String,
      store_id: Types.ObjectId,
      store_name: String,
      cateogry_id: Types.ObjectId,
      category_name: String,
    },
  })
  store: RecruitmentStore;

  // & campus
  @Prop({ type: Types.ObjectId, ref: 'campus', required: true })
  campus_id: Types.ObjectId;
  // & 구직 본문
  @Prop({ type: String, required: true })
  recruitment_sub: string;
  // & image
  @Prop({ type: String, required: true })
  recruitment_image: string;
  // & block
  @Prop({ type: Boolean, default: false })
  recruitment_block: boolean;
  // & active
  @Prop({ type: Boolean, default: true })
  recruitment_active: boolean;
  // & created At
  @Prop({ type: Date, required: true })
  recruitment_created_at: Date;
  // & 모집 시작일
  @Prop({ type: Date, required: true })
  recruitment_start_at: Date;
  // & 모집 종료일
  @Prop({ type: Date, required: true })
  recruitment_end_at: Date;
  // 아르바이트 기간
  @Prop({
    type: String,
    required: true,
    enum: ['남성', '여성', '상관 없음'],
  })
  recruitment_gender: string;
  // 모집 기간 형태
  @Prop({
    type: String,
    required: true,
    enum: [
      '대타',
      '일주일 이하',
      '1개월 이하',
      '1~3개월',
      '3개월 이상',
      '미정',
    ],
  })
  recruitment_type: string;
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

const _RecruitmentSchema = SchemaFactory.createForClass(Recruitment);
export const RecruitmentSchema = _RecruitmentSchema;
