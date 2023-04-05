import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SearchWord } from '../objects/user.object';
@Schema()
export class User extends Document {
  // &+ 닉네임
  @Prop({
    type: String,
    required: true,
  })
  user_nickname: string;
  // &+ 이메일
  @Prop({
    type: String,
    required: true,
  })
  user_email: string;
  // &+ 프로필 이미지
  @Prop({
    type: String,
    default: '',
  })
  user_profile: string;
  // &+ 소셜 타입
  @Prop({
    type: String,
    required: true,
  })
  user_provider: string;
  // &+ 소설 id
  @Prop({ type: String, required: true })
  user_providerId: string;

  // &+ 성별 추가 : 성현
  @Prop({
    type: String,
    required: true,
    enum: ['남성', '여성', '상관 없음'],
  })
  user_gender: string;
  // &+ 생년월일
  @Prop({ type: Date, required: true })
  user_birth: Date;
  // &+ 생성일
  @Prop({ type: Date, required: true })
  user_created_at: Date;

  // &+ 마지막 로그인  캠퍼스 위치
  @Prop({ type: Types.ObjectId, required: true })
  user_last_campus: Types.ObjectId;

  // &+ 마지막 로그인  시간
  @Prop({ type: Date, required: true })
  user_last_signin: Date;

  // &+ 광고 홍보 수신여부
  @Prop({ type: Boolean, required: true })
  user_push: boolean;
  // &+ 장르 리스트
  @Prop({ type: [Types.ObjectId], default: [] })
  user_push_types: Types.ObjectId[];
  // &+ API KEY
  @Prop({ type: String })
  user_api_key: string;
  // &+ Device Token
  @Prop({ type: String })
  user_device_token: string;

  @Prop({
    type: Number,
    default: 0,
  })
  user_review_count: number;

  // &+ Active
  @Prop({ type: Boolean, default: true })
  user_active: boolean;
  // &+ Block
  @Prop({ type: Boolean, default: false })
  user_block: boolean;

  @Prop({
    type: [
      {
        _id: false,
        search: String,
        search_created_at: Date,
      },
    ],
    default: [],
  })
  user_search_keywords: SearchWord[];
}

const _UserSchema = SchemaFactory.createForClass(User);
export const UserSchema = _UserSchema;
