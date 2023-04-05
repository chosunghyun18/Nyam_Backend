import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherUser } from 'src/user/objects/user.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { ReviewCampus, ReviewStore } from './review.object';

@Schema()
export class Review extends Document {
  @Prop({
    type: {
      _id: false,
      uid: Types.ObjectId,
      user_nickname: String,
      user_profile: String,
      user_review_count: Number,
    },
    required: true,
  })
  user: OtherUser;
  @Prop({
    type: {
      _id: false,
      owner_id: Types.ObjectId,
      owner_type: String,
      store_id: Types.ObjectId,
      store_name: String,
    },
    required: true,
  })
  store: ReviewStore;
  @Prop({
    type: {
      _id: false,
      campus_id: Types.ObjectId,
      campus_name: String,
    },
    required: true,
  })
  campus: ReviewCampus;
  @Prop({ type: String, required: true })
  review_text: string;
  @Prop({ type: [String], required: true })
  review_images: string[];
  @Prop({ type: String, required: true })
  review_hidden_text: string;
  @Prop({ type: Number, required: true })
  review_service: number;
  @Prop({ type: Number, required: true })
  review_taste: number;
  @Prop({ type: Boolean, default: false })
  review_block: boolean;
  @Prop({ required: Boolean, default: true })
  review_active: boolean;
  @Prop({ type: Date, required: true })
  review_created_at: Date;
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

const _ReviewSchema = SchemaFactory.createForClass(Review);
export const ReviewSchema = _ReviewSchema;
