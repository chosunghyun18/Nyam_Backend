import { getCurrentDate } from 'src/common/util/dateTime';
import { Types } from 'mongoose';
import { User } from '../models/user.model';
import { LabMangeView, LabView } from 'src/lab/lab.object';
import { ReviewMangeView, ReviewView } from 'src/review/review.object';
import { BookMarkView } from '../../bookmark/bookmark.object';
import {
  UserRequestView,
  UserRequestManageView,
} from '../../request/objects/user.request.object';
import { Review } from 'src/review/review.model';
import { Bookmark } from '../../bookmark/bookmark.model';
import { Lab } from 'src/lab/lab.model';
import { UserRequest } from '../../request/models/user.request.model';
import { ApiProperty } from '@nestjs/swagger';

export class NickNameCheckDto {
  @ApiProperty({ example: 'cho12', description: '사용자가 원하는 닉네임' })
  nickName: string;
}

export class SearchWord {
  search: string;
  search_created_at: Date;
  constructor(search: string) {
    this.search = search;
    this.search_created_at = getCurrentDate(new Date());
  }
}
export class UserSignUpRequest {
  user_nickname: string;
  user_email: string;
  user_profile: string;
  user_provider: string;
  user_providerId: string;
  user_gender: string;
  user_birth: Date;
  user_created_at: Date;
  user_last_campus: Types.ObjectId;
  user_last_signin: Date;
  user_push: boolean;
  user_device_token: string;
  user_api_key: string;

  constructor(data, api_key) {
    this.user_nickname = data.user_nickname;
    this.user_email = data.user_email;
    this.user_profile = data.user_profile;
    this.user_provider = data.user_provider;
    this.user_providerId = data.user_providerId;
    this.user_gender = data.user_gender;
    this.user_birth = new Date(data.user_birth);
    this.user_last_campus = data.user_last_campus;
    this.user_last_signin = getCurrentDate(new Date());
    this.user_push = data.user_push;
    this.user_device_token = data.user_device_token;
    this.user_created_at = getCurrentDate(new Date());
    this.user_api_key = api_key;
  }
}
export class UserUpdateRequest {
  user_nickname: string;
  user_profile: string;
  user_gender: string;
  user_birth: Date;
  user_push: boolean;
  constructor(data) {
    this.user_nickname = data.user_nickname;
    this.user_profile = data.user_profile;
    this.user_gender = data.user_gender;
    this.user_birth = new Date(data.user_birth);
    this.user_push = data.user_push;
  }
}
export class MyUser {
  uid: Types.ObjectId;
  user_nickname: string;
  user_email: string;
  user_profile: string;
  user_provider: string;
  user_providerId: string;
  user_gender: string;
  user_birth: Date;
  user_created_at: Date;
  user_last_campus: Types.ObjectId;
  user_last_signin: Date;
  user_push: boolean;
  user_device_token: string;
  user_api_key: string;
  user_push_types: Types.ObjectId[];
  // 내가 작성한 리뷰리스트
  reviews: ReviewView[];
  // 내가 만든 북마크 리스트
  bookmarks: BookMarkView[];
  // 내가 요청한 리스트
  requests: UserRequestView[];
  // 내가 참가한 랩 리스트
  labs: LabView[];
  constructor(user: User, reviews: Review[], bookmarks: Bookmark[]) {
    this.uid = user.id;
    this.user_nickname = user.user_nickname;
    this.user_email = user.user_email;
    this.user_profile = user.user_profile;
    this.user_provider = user.user_provider;
    this.user_providerId = user.user_providerId;
    this.user_gender = user.user_gender;
    this.user_birth = user.user_birth;
    this.user_created_at = user.user_created_at;
    this.user_last_campus = user.user_last_campus;
    this.user_last_signin = user.user_last_signin;
    this.user_push = user.user_push;
    this.user_device_token = user.user_device_token;
    this.user_api_key = user.user_api_key;
    this.user_push_types = user.user_push_types;
    this.reviews = reviews.map((e) => new ReviewView(e));
    this.bookmarks = bookmarks.map((e) => new BookMarkView(e));
  }
}
export class OtherUser {
  uid: Types.ObjectId;
  user_nickname: string;
  user_profile: string;
  user_review_count: number;
  constructor(user: User) {
    this.uid = user.id;
    this.user_nickname = user.user_nickname;
    this.user_profile = user.user_profile;
    this.user_review_count = user.user_review_count;
  }
}
export class RequestOtherUser {
  uid: Types.ObjectId;
  user_nickname: string;
  user_birth: Date;
  user_gender: string;
  constructor(user: User) {
    this.uid = user.id;
    this.user_nickname = user.user_nickname;
    this.user_birth = user.user_birth;
    this.user_gender = user.user_gender;
  }
}
export class MangeUser {
  uid: Types.ObjectId;
  user_nickname: string;
  user_email: string;
  user_profile: string;
  user_provider: string;
  user_providerId: string;
  user_gender: string;
  user_birth: Date;
  user_created_at: Date;
  user_last_campus: Types.ObjectId;
  user_last_signin: Date;
  user_push: boolean;
  user_device_token: string;
  user_api_key: string;
  user_push_types: Types.ObjectId[];
  user_active: boolean;
  user_block: boolean;
  // 내가 작성한 리뷰리스트
  active_reviews: ReviewMangeView[];
  block_reviews: ReviewMangeView[];

  // 내가 만든 북마크 리스트
  bookmarks: BookMarkView[];
  // 내가 요청한 리스트
  requests: UserRequestView[];
  // 내가 참가한 랩 리스트
  active_labs: LabMangeView[];
  block_labs: LabMangeView[];

  constructor(
    user: User,
    active_reviews: Review[],
    block_reviews: Review[],
    bookmarks: Bookmark[],
    requests: UserRequest[],
    active_labs: Lab[],
    block_labs: Lab[],
  ) {
    this.uid = user.id;
    this.user_nickname = user.user_nickname;
    this.user_email = user.user_email;
    this.user_profile = user.user_profile;
    this.user_provider = user.user_provider;
    this.user_providerId = user.user_providerId;
    this.user_gender = user.user_gender;
    this.user_birth = user.user_birth;
    this.user_created_at = user.user_created_at;
    this.user_last_campus = user.user_last_campus;
    this.user_last_signin = user.user_last_signin;
    this.user_push = user.user_push;
    this.user_device_token = user.user_device_token;
    this.user_api_key = user.user_api_key;
    this.user_push_types = user.user_push_types;
    this.user_active = user.user_active;
    this.user_block = user.user_block;

    this.active_reviews = active_reviews.map((e) => new ReviewMangeView(e));
    this.block_reviews = block_reviews.map((e) => new ReviewMangeView(e));
    this.bookmarks = bookmarks.map((e) => new BookMarkView(e));
    this.requests = requests.map((e) => new UserRequestManageView(e));
    this.active_labs = active_labs.map((e) => new LabMangeView(e));
    this.block_labs = block_labs.map((e) => new LabMangeView(e));
  }
}

// * Check Object
export class UserExit {
  user_email: string;
  user_provider: string;
  user_providerId: string;
  constructor(data) {
    (this.user_email = data.user_email),
      (this.user_provider = data.user_provider);
    this.user_providerId = data.user_providerId;
  }
}

// * 유저 타입
export enum Role {
  USER = 'user',
  OWNER = 'owner',
  ADMIN = 'admin',
}
