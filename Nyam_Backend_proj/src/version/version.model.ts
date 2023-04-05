import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {} from './version.object';
@Schema()
export class Version extends Document {
  // & 새 버전
  @Prop({ type: String, required: true })
  new_version: string;
}

const _VersionSchema = SchemaFactory.createForClass(Version);
export const VersionSchema = _VersionSchema;
