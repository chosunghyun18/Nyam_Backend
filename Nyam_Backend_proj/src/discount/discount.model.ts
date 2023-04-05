import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { DiscountStore } from './discount.object';

@Schema()
export class Discount extends Document {
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
  store: DiscountStore;

  // & campus
  @Prop({ type: Types.ObjectId, ref: 'campus', required: true })
  campus_id: Types.ObjectId;
  // & 마감 할인 본문
  @Prop({ type: String, required: true })
  discount_sub: string;
  // & image
  @Prop({ type: String, required: true })
  discount_image: string;
  // &  마감 할인 비율
  @Prop({ type: String, required: true })
  discount_rate: string;
  // & block
  @Prop({ type: Boolean, default: false })
  discount_block: boolean;
  // & active
  @Prop({ type: Boolean, default: true })
  discount_active: boolean;
  @Prop({ type: Date, required: true })
  discount_created_at: Date;
  // & 마감 할인 시작일
  @Prop({ type: Date, required: true })
  discount_start_at: Date;
  // & 마감 할인 종료일
  @Prop({ type: Date, required: true })
  discount_end_at: Date;

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

const _DiscountSchema = SchemaFactory.createForClass(Discount);
export const DiscountSchema = _DiscountSchema;
