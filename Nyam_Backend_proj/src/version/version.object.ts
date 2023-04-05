import { Types } from 'mongoose';

//$ 버전정보 get , post 용
export class VersionInfo {
  new_version: string;
  constructor(data) {
    this.new_version = data.new_version;
  }
}
