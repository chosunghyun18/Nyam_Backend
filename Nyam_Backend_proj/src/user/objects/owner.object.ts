import { getCurrentDate } from 'src/common/util/dateTime';
import { Types } from 'mongoose';
import { Owner } from '../models/owner.model';
import { MangeStoreView, OwnerStoreView } from 'src/store/store.object';
import {
  OwnerRequestMageView,
  OwnerRequestView,
} from '../../request/objects/owner.request.object';

export class OwnerSignUpRequest {
  owner_name: string;
  owner_id: string;
  owner_password: string;
  owner_gender: string;
  owner_birth: Date;
  owner_call: string;
  owner_device_token: string;
  owner_account: string;
  owner_license: OwnerLicense[];
  owner_created_at: Date;
  constructor(data) {
    this.owner_name = data.owner_name;
    this.owner_id = data.owner_id;
    this.owner_password = data.owner_password;
    this.owner_gender = data.owner_gender;
    this.owner_call = data.owner_call;
    this.owner_device_token = data.owner_device_token;
    this.owner_account = data.owner_account;
    this.owner_license = data.owner_license;
    this.owner_birth = new Date(data.owner_birth);
    this.owner_created_at = getCurrentDate(new Date());
  }
}

export class MyOwner {
  uid: Types.ObjectId;
  owner_name: string;
  owner_id: string;
  owner_password: string;
  owner_gender: string;
  owner_birth: Date;
  owner_call: string;
  owner_device_token: string;
  owner_account: string;
  owner_license: OwnerLicense[];
  owner_api_key: string;
  owner_auth: boolean;
  // 내 소유 스토어 리스트
  stores: OwnerStoreView[];
  // 내 요청 건의한 리스트
  requests: OwnerRequestView[];
  constructor(
    owner: Owner,
    stores: OwnerStoreView[],
    // requests: OwnerRequestView[],
  ) {
    this.uid = owner.id;
    this.owner_name = owner.owner_name;
    this.owner_id = owner.owner_id;
    this.owner_password = owner.owner_password;
    this.owner_gender = owner.owner_gender;
    this.owner_birth = owner.owner_birth;
    this.owner_call = owner.owner_call;
    this.owner_account = owner.owner_account;
    this.owner_license = owner.owner_license;
    this.owner_api_key = owner.owner_api_key;
    this.owner_device_token = owner.owner_device_token;
    this.owner_auth = owner.owner_auth;
    this.stores = stores;

    // this.requests = requests;
  }
}

export class OwnerMange {
  uid: Types.ObjectId;
  owner_name: string;
  owner_id: string;
  owner_password: string;
  owner_gender: string;
  owner_birth: Date;
  owner_call: string;
  owner_device_token: string;
  owner_account: string;
  owner_license: OwnerLicense[];
  owner_api_key: string;
  owner_block: boolean;
  onwer_active: boolean;
  owner_auth: boolean;
  // 내 소유 스토어 리스트
  active_stores: MangeStoreView[];
  block_stores: MangeStoreView[];
  // 내 요청 건의한 리스트
  requests: OwnerRequestMageView[];
  constructor(
    owner: Owner,
    active_stores: MangeStoreView[],
    block_stores: MangeStoreView[],
  ) {
    this.uid = owner.id;
    this.owner_name = owner.owner_name;
    this.owner_id = owner.owner_id;
    this.owner_password = owner.owner_password;
    this.owner_gender = owner.owner_gender;
    this.owner_birth = owner.owner_birth;
    this.owner_call = owner.owner_call;
    this.owner_account = owner.owner_account;
    this.owner_license = owner.owner_license;
    this.owner_api_key = owner.owner_api_key;
    this.owner_device_token = owner.owner_device_token;

    this.owner_auth = owner.owner_auth;
    this.owner_block = owner.owner_block;
    this.onwer_active = owner.owner_active;
    this.active_stores = active_stores;
    this.block_stores = block_stores;
  }
}

export class OwnerUpdate {
  owner_call: string;
  owner_account: string;
  owner_license: OwnerLicense[];
  constructor(data) {
    this.owner_call = data.owner_call;
    this.owner_account = data.owner_account;
    this.owner_license = data.owner_license;
  }
}
export class OtherOwner {
  uid: Types.ObjectId;
  owner_name: string;
  constructor(owner: Owner) {
    this.uid = owner.id;
    this.owner_name = owner.owner_name;
  }
}

/*
 * Model in Object Class
 */

// $ 사업자 등록증
export class OwnerLicense {
  owner_lince_image: string;
  owner_lince_name: string;
  constructor(data) {
    this.owner_lince_name = data.owner_lince_name;
    this.owner_lince_image = data.owner_lince_image;
  }
}
