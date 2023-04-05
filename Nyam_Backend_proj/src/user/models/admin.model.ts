import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Admin extends Document {
  // &+ 이름
  @Prop({
    type: String,
    required: true,
  })
  admin_name: string;
  // &+닉네임
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  admin_nickname: string;
  // &+ 프로필 이미지
  @Prop({
    type: String,
    required: true,
  })
  admin_profile: string;
  // &+ 아이디
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  admin_id: string;
  // &+ 패스워드
  @Prop({
    type: String,
    required: true,
  })
  admin_password: string;

  @Prop({ type: String, enum: ['admin', 'cto'], default: 'admin' })
  admin_role: string;
  // &+ 생년월일
  @Prop({ type: Date, required: true })
  admin_birth: Date;

  // &+ 생성일
  @Prop({ type: Date, required: true })
  admin_created_at: Date;

  // &+ 활성여부
  @Prop({ type: Boolean, default: true })
  admin_active: boolean;
}

const _AdminSchema = SchemaFactory.createForClass(Admin);
export const AdminSchema = _AdminSchema;
