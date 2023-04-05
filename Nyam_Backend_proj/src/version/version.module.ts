import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';
import { Version, VersionSchema } from './version.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Version.name, schema: VersionSchema }]),
  ],
  controllers: [VersionController],
  providers: [VersionService],
  exports: [VersionService],
})
export class VersionModule {
  constructor() {
    console.log('version module 제작 완료');
  }
}
