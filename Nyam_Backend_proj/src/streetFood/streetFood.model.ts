import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { StreetFoodAddress } from 'src/streetFood/streetFood.object';
@Schema()
export class StreetFood extends Document {
  @Prop({ type: Types.ObjectId, ref: 'campus', required: true })
  campus_id: Types.ObjectId;
  @Prop({
    _id: false,

    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    local_address: String,
    load_address: String,
    region_1depth_name: String,
    region_2depth_name: String,
    region_3depth_name: String,
    region_4depth_name: String,
    region_5depth_name: String,
    lon: Number,
    lat: Number,
  })
  street_food_address: StreetFoodAddress;

  @Prop({
    type: String,
    required: true,
  })
  street_food_name: string;

  @Prop({ type: String, required: true })
  street_food_sub: string;

  @Prop({ type: String, required: true })
  street_food_image: string;

  @Prop({ type: String, required: true })
  street_food_location: string;

  @Prop({ type: Boolean, default: false })
  street_food_block: boolean;

  @Prop({ type: Boolean, default: true })
  street_food_active: boolean;

  @Prop({ type: Date, required: true })
  street_food_created_at: Date;

  @Prop({ type: Date, required: true })
  street_food_start_at: Date;

  @Prop({ type: Date, required: true })
  street_food_end_at: Date;

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

const _StreetFoodSchema = SchemaFactory.createForClass(StreetFood);
export const StreetFoodSchema = _StreetFoodSchema;
