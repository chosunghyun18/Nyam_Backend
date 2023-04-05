import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './review.model';
import {
  ReviewAddRequest,
  ReviewInnerQuery,
  ReviewQuery,
  ReviewStore,
} from './review.object';
import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { StoreService } from 'src/store/store.service';
import { OtherUser } from 'src/user/objects/user.object';
import { Store } from 'src/store/store.model';
import { User } from 'src/user/models/user.model';
import { IoTEvents } from 'aws-sdk';
import { isGcsTfliteModelOptions } from 'firebase-admin/lib/machine-learning/machine-learning-api-client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly storeService: StoreService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

 

  // 리뷰 수 초기화 = 현제 수
  async resetUserReviewCount(user_id: Types.ObjectId) {
    const user = await this.userService.userFindById(user_id);
    user.user_review_count = await this.getUserReivewCount(user_id);
    await user.save();
    await this.applyUserReviewCount(user);
    return user;
  }

  async getUserReivewCount(user_id: Types.ObjectId) {
    const [reviews] = await Promise.all([
      this.userReviews(new ReviewInnerQuery({ user_id: user_id })),
    ]);
    return reviews.length;
  }

  async applyUserReviewCount(user: User) {
    const items = await this.reviewModel.find({ 'user.uid': user.id });
    const new_user = new OtherUser(user);
    await Promise.all([
      items.map((e) => {
        e.user = new_user;
        e.save();
      }),
    ]);
  }

  // 리뷰 수 -1
  async minusUserReviewCount(user_id: Types.ObjectId) {
    const user = await this.userService.userFindById(user_id);
    user.user_review_count = (await this.getUserReivewCount(user_id)) - 1;
    await user.save();
    await this.applyUserReviewCount(user);
    return user;
  }

  // clear 리뷰 삭제
  async reviewRemove(review_id: Types.ObjectId, user_id: Types.ObjectId) {
    const item = await this.reviewModel.findOne({
      _id: review_id,
      'user.uid': user_id,
    });
    if (!item)
      throw new NotFoundException(
        '데이터가 조회되지 않습니다. 본인의 리뷰인지 확인하세요',
      );
    await this.minusUserReviewCount(user_id);
    item.review_active = false;
    await item.save();
    await this.storeNewRating(item.store.store_id);
    return item;
  }

  async reviewList(query: ReviewQuery) {
    const items = await this.reviewModel
      .find(query.Query())
      .skip(query.Skip())
      .limit(query.count)
      .sort({ review_created_at: -1 });
    return items;
  }

  //clear  리뷰 페이지 네이션
  async reviewPage(query: ReviewQuery) {
    const totalcount = await this.reviewModel.find(query.Query());
    const totalPage = Math.ceil(totalcount.length / query.count) - 1;
    const currentPage = query.page;
    const prev = query.page == 0 ? false : true;
    const next = query.page < totalPage ? true : false;
    const pageRoute = {
      total: totalPage,
      prev: prev,
      next: next,
      currentPage: currentPage,
      reviewTotalCount: totalcount.length,
    };
    return pageRoute;
  }

  // 유저 삭제시
  async userRemove(user_id: Types.ObjectId) {
    const items = await this.reviewModel.find({ 'user.uid': user_id });

    const [reviews, stores] = await Promise.all([
      items.map((element) => {
        element.review_active = false;
        element.save();
      }),
      items.map((element) => element.store.store_id),
    ]);

    const set_stores = [...new Set(stores)];
    await Promise.all([
      set_stores.map((e) => {
        this.storeNewRating(e);
      }),
    ]);

    return true;
  }

  // clear 유저 변경시
  async userUpdate(user: User, admin: any | OtherAdmin) {
    const items = await this.reviewModel.find({ 'user.uid': user.id });
    const new_user = new OtherUser(user);

    await Promise.all([
      items.map((e) => {
        e.user = new_user;
        if (admin != null) e.admin = admin;
        e.review_block = user.user_block;
        e.review_active = user.user_active;
        e.save();
      }),
    ]);
    const store_list = items.map((e) => e.store.store_id);
    const new_set = [...new Set(store_list)];
    await Promise.all([
      new_set.map((e) => {
        this.storeNewRating(e);
      }),
    ]);
    return true;
  }
  // clear  유저 리뷰 리스트
  async userReviews(query: ReviewInnerQuery) {
    const reviews = await this.reviewModel
      .find(query.Query())
      .sort({ review_created_at: -1 });
    return reviews;
  }

  
  // clear 매장 리뷰 리스트
  async storeReviews(query: ReviewInnerQuery) {
    const reviews = await this.reviewModel.find(query.Query());
    reviews.map((e) => this.resetUserReviewCount(e.user.uid));
    return reviews;
  }
  // clear 매장 변경시 refact : add admin : 성현
  async storeUpdate(store: Store, admin: any | OtherAdmin) {
    const reviewStroe = new ReviewStore(store);
    const items = await this.reviewModel.find({
      'store.store_id': reviewStroe.store_id,
    });
    await Promise.all(
      items.map((e) => {
        if (admin != null) e.admin = admin;
        e.review_active = store.store_active;
        e.review_block = store.store_block;
        e.store = reviewStroe;
        e.save();
      }),
    );
    return true;
  }
}
