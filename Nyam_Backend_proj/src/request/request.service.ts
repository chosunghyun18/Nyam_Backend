import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/models/user.model';
import { Admin } from 'src/user/models/admin.model';
import { UserRequest } from './models/user.request.model';
import { RequestScript, UserRequestQuery } from './objects/user.request.object';
import { RequestOtherUser } from '../user/objects/user.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { OwnerRequestQuery } from '../request/objects/owner.request.object';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Admin.name) private readonly AdminModel: Model<Admin>,
    @InjectModel(UserRequest.name)
    private readonly userRequestModel: Model<UserRequest>,
  ) {}

  async user_request_add(user_id: Types.ObjectId, data: RequestScript) {
    const item = await this.userRequestModel.findOneAndUpdate(
      { 'user.uid': user_id },
      { $push: { request_script: data }, request_check: false },
      { upsert: true, new: true },
    );
    return item;
  }

  //clear 유저 요청 응답 - 관리자
  async admin_request_add(
    admin_id: Types.ObjectId,
    request_id: Types.ObjectId,
    data: RequestScript,
  ) {
    const admin = await this.AdminModel.findById(admin_id);
    const item = await this.userRequestModel.findById(request_id);
    item.admin = new OtherAdmin(admin);
    item.request_script.push(data);
    item.request_check = true;
    await item.save();
    return item;
  }
  async admin_request_check(
    admin_id: Types.ObjectId,
    request_id: Types.ObjectId,
    request_check: boolean,
  ) {
    const admin = await this.AdminModel.findById(admin_id);
    const item = await this.userRequestModel.findById(request_id);
    item.admin = new OtherAdmin(admin);
    item.request_check = request_check;
    await item.save();
    return item;
  }

  //clear 유저 요청 리스트 - 관리자  - 답변 여부
  async user_request_list(user_id: Types.ObjectId) {
    const user = await this.UserModel.findById(user_id);
    // 있는지 확인
    const item = await this.userRequestModel.findOne({ 'user.uid': user.id });
    return item;
  }

  async admin_request_list(findData: UserRequestQuery) {
    const list = await this.userRequestModel.find(findData.Query());
    return list;
  }
  async owner_request_list(findData: OwnerRequestQuery) {
    const list = await this.userRequestModel.find(findData.Query());
    return list;
  }

  // clear 유저 리스트
  async user_request(user: User) {
    const list = await this.userRequestModel
      .find({ 'user.uid': user.id })
      .sort({ user_request_created_at: -1 });
    return list;
  }

  // clear 유저 업데이트
  async user_update(user: User) {
    const new_user = new RequestOtherUser(user);
    const list = await this.userRequestModel.find({ 'user.uid': user.id });
    await Promise.all([
      list.map((e) => {
        e.user = new_user;
        e.request_active = user.user_active;
        e.save();
      }),
    ]);
    return true;
  }
}
