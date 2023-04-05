import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Version } from './version.model';
import { VersionInfo } from './version.object';
@Injectable()
export class VersionService {
  constructor(
    @InjectModel(Version.name)
    private readonly versionModel: Model<Version>,
  ) {}

  // clear version 생성
  async addVersion(data: VersionInfo) {
    const new_data = await this.versionModel.create(data);
    return new_data;
  }

  // clear version 정보 호출
  async checkVersion(version_info: string) {
    const version = await this.versionModel.findOne({
      new_version: version_info,
    });
    if (!version) return false;
    return true;
  }

  async updateVersion(version_id: Types.ObjectId, version_info: string) {
    const version = await this.versionModel.findById(version_id);
    version.new_version = version_info;
    await version.save();

    return version;
  }
}
