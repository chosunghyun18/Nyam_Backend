import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OwnerLicense } from '../objects/owner.object';
@Schema()
export class Owner extends Document {
  // &+ 이름
  @Prop({
    type: String,
    required: true,
  })
  owner_name: string;
  // &+ 아이디
  @Prop({
    unique: true,
    type: String,
    required: true,
  })
  owner_id: string;
  // &+ 사업자 이미지 리스트 등록증
  @Prop({
    type: [
      {
        id: false,
        owner_lince_image: String,
        owner_lince_name: String,
      },
    ],
    required: true,
  })
  owner_license: OwnerLicense[];
  // &+ 패스워드
  @Prop({
    type: String,
    required: true,
  })
  owner_password: string;

  // &+ 성별
  @Prop({
    type: String,
    required: true,
    enum: ['남성', '여성'],
  })
  owner_gender: string;
  // &+ 생년월일
  @Prop({ type: Date, required: true })
  owner_birth: Date;

  // &+ 휴대전화
  @Prop({ type: String, required: true, unique: true })
  owner_call: string;

  // &+ API KEY
  @Prop({ type: String, unique: true })
  owner_api_key: string;
  // &+ Device Token
  @Prop({ type: String, unique: true, required: true })
  owner_device_token: string;
  // &+ Auth Check
  @Prop({ type: Boolean, required: true, default: false })
  owner_auth: boolean;
  // &+ 생성일
  @Prop({ type: Date, required: true })
  owner_created_at: Date;
  // &+ 결제 게좌 번호
  @Prop({ type: String, required: true })
  owner_account: string;

  // & + Owner
  @Prop({ tpye: Boolean, default: true })
  owner_active: boolean;
  @Prop({ tpye: Boolean, default: false })
  owner_block: boolean;
}

const _OwnerSchema = SchemaFactory.createForClass(Owner);
export const OwnerSchema = _OwnerSchema;
