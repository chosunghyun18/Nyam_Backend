import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { OtherOwner } from 'src/user/objects/owner.object';

@Schema()
export class OwnerRequest extends Document {
  @Prop({
    type: {
      _id: false,
      uid: Types.ObjectId,
      owner_name: String,
    },
  })
  owner: OtherOwner;

  @Prop({ type: String, default: '' })
  owner_request_sub: string;
  @Prop({ type: [String], default: '' })
  owner_request_images: string[];

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
  @Prop({ type: Boolean, default: false })
  owner_request_check: boolean;
  @Prop({ type: String, default: '' })
  owner_request_answer: string;
  @Prop({ type: String, default: '' })
  owner_request_answer_image: string;
  @Prop({ type: Date })
  owner_request_answer_time: Date;
  // & Created At
  @Prop({ type: Date, required: true })
  owner_request_created_at: Date;
  @Prop({ type: Date, required: true })
  owner_request_end_at: Date;
  @Prop({ type: Boolean, default: true })
  owner_request_active: boolean;
}

const _OwnerRequestSchema = SchemaFactory.createForClass(OwnerRequest);
export const OwnerRequestSchema = _OwnerRequestSchema;
