import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { RequestOtherUser } from 'src/user/objects/user.object';
import { RequestScript } from '../objects/user.request.object';
@Schema()
export class UserRequest extends Document {
  @Prop({ type: Boolean, default: false })
  request_check: boolean;

  @Prop({ type: Boolean, default: true })
  request_active: boolean;

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
    type: {
      _id: false,
      uid: Types.ObjectId,
      user_nickname: String,
      user_birth: String,
      user_gender: Date,
    },
  })
  user: RequestOtherUser;

  @Prop({
    type: [
      {
        _id: false,
        request_type: String,
        request_sub: String,
        request_created_at: Date,
      },
    ],
    default: [],
  })
  request_script: RequestScript[];
}

const _UserRequestSchema = SchemaFactory.createForClass(UserRequest);
export const UserRequestSchema = _UserRequestSchema;
