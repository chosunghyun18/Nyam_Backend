import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { PromotionStore } from './promotion.object';

@Schema()
export class Promotion extends Document {
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
  store: PromotionStore;

  // & campus
  @Prop({ type: Types.ObjectId, ref: 'campus', required: true })
  campus_id: Types.ObjectId;
  // add 가게 소식보기 enum : 성현
  @Prop({
    type: String,
    required: true,
    enum: ['신규 개업', '신메뉴 출시', '장기 휴무', '폐업 소식', '기타'],
  })
  promotion_title: string;

  @Prop({ type: String, required: true })
  promotion_sub: string;
  // & block
  @Prop({ type: Boolean, default: false })
  promotion_block: boolean;
  // & active
  @Prop({ type: Boolean, default: true })
  promotion_active: boolean;
  // & created At
  @Prop({ type: Date, required: true })
  promotion_created_at: Date;
  // & start day
  @Prop({ type: Date, required: true })
  promotion_start_at: Date;
  // & created At
  @Prop({ type: Date, required: true })
  promotion_end_at: Date;

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

const _PromotionSchema = SchemaFactory.createForClass(Promotion);
export const PromotionSchema = _PromotionSchema;
