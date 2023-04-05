import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { OtherUser } from 'src/user/objects/user.object';

@Schema()
export class UserReport extends Document {
  @Prop({
    type: {
      _id: false,
      uid: Types.ObjectId,
      user_nickname: String,
      user_profile: String,
    },
  })
  user: OtherUser;

  @Prop({ type: String, default: '' })
  user_report_sub: string;

  @Prop({ type: String, default: '' })
  user_report_store_name: string;

  // @Prop({ type: [String], default: '' })
  // user_report_images: string[];

  @Prop({ type: String, default: false })
  user_report_image: string;

  // & campus
  @Prop({ type: Types.ObjectId, ref: 'campus', required: true })
  campus_id: Types.ObjectId;

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

  @Prop({
    type: String,
    required: true,
    enum: [
      '매장 추가 제보',
      '구인 구직 제보',
      '우리 동네 간식 제보',
      '가게 소식 제보',
      '기타',
    ],
  })
  user_report_type: string;

  @Prop({ type: Boolean, default: false })
  user_report_check: boolean;

  @Prop({ type: Boolean, default: true })
  user_report_active: boolean;

  @Prop({ type: Date, required: true })
  user_report_created_at: Date;
}

const _UserReportSchema = SchemaFactory.createForClass(UserReport);
export const UserReportSchema = _UserReportSchema;
