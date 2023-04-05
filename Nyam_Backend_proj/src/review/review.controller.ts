import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decrator';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import { Role } from 'src/user/objects/user.object';
import { ReviewService } from './review.service';
import { Types } from 'mongoose';
import {
  ReviewMangeView,
  ReviewOwnerView,
  ReviewQuery,
  ReviewView,
  ReviewAddRequest,
} from './review.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { StoreService } from 'src/store/store.service';
import { LogsService } from 'src/logs/logs.service';
import { CampusService } from 'src/campus/campus.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
/* *
 *  일시   : 2022년 12월 27일 화요일
 *  개발자 : 조성현
 *  체크 사항 :
 *  내용 : 리뷰 관련 API 리팩토링
 */

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly storeService: StoreService,
    private readonly logService: LogsService,
    private readonly campusService: CampusService,
  ) {}
  // *  -------------------------- 관리자  ---------------------------- */
  //clear 리뷰 리스트 - 관리자
  @Get('/admin_list')
  @Roles(Role.ADMIN)
  async adminList(@CurrentUser() user, @Query() query_data) {
    const query = new ReviewQuery(query_data);
    const items = await this.reviewService.reviewList(query);
    const pageNavigation = await this.reviewService.reviewPage(query);
    return {
      reveiw_list: items.map((e) => new ReviewMangeView(e)),
      pageNavigation,
    };
  }
  // clear 리뷰 차단 - 관리자  *  매장 데이터 업데이트 -평점, 맛 , 사비스
  @Put('/block/:review_id')
  @Roles(Role.ADMIN)
  async block(
    @CurrentUser() user,
    @Body() body,
    @Param('review_id') review_id: Types.ObjectId,
  ) {
    const { action } = body;
    if (action == null) throw new BadRequestException('행동을 지정해주세요.');
    const item = await this.reviewService.reviewBlock(
      review_id,
      action,
      new OtherAdmin(user),
    );
    return { review: new ReviewMangeView(item) };
  }
  // *  -------------------------- 매장 주인  ---------------------------- */
  @Get('owner/owner_list')
  @Roles(Role.OWNER)
  async getOwnerStoreReviews(@CurrentUser() user, @Query() query_data) {
    const query = new ReviewQuery(query_data);
    const items = await this.reviewService.reviewList(query);
    const pageNavigation = await this.reviewService.reviewPage(query);
    return {
      reveiw_list: items.map((e) => new ReviewOwnerView(e)),
      pageNavigation,
    };
  }
  // *  -------------------------- 유저  ---------------------------- */
  // clear 리뷰 생성
  @Post('/add/:store_id')
  @Roles(Role.USER)
  async add(
    @CurrentUser() user,
    @Param('store_id') store_id: Types.ObjectId,
    @Body() body,
  ) {
    let create_data;
    const store = await this.storeService.store_detail(store_id, false);
    const campus = await this.campusService.detail(store.campus_id);
    try {
      create_data = new ReviewAddRequest(user, campus, store, body);
    } catch (e) {
      throw new BadRequestException('데이터 입력폼이 다릅니다.');
    }
    const review = await this.reviewService.reviewAdd(create_data);

    const log_user = {
      user_type: 'user',
      uid: user.id,
      name: user.user_nickname,
      user_gender: user.user_gender,
      user_birth: user.user_birth,
    };
    await this.logService.action_log_add(
      new ActionLogAdd(
        log_user,
        campus.id,
        campus.campus_name,
        store.id,
        'store',
        'Sub',
        { table_name: 'reveiw', table_id: review.id, action: 'Create' },
        `${log_user.name} 님이 ${campus.campus_name}의  ${store.store_name}의 매장에 리뷰를 추가하셨습니다. `,
      ),
    );
    return { review: new ReviewView(review) };
  }

  // @Delete('/remove/:review_id')
  // @Roles(Role.USER)
  // async remove(
  //   @CurrentUser() user,
  //   @Param('review_id') review_id: Types.ObjectId,
  // ) {
  //   const item = await this.reviewService.reviewRemove(review_id, user.id);
  //   const store = await this.storeService.store_detail(
  //     item.store.store_id,
  //     false,
  //   );
  //   return true;
  // }

  // clear 리뷰 리스트 - 유저
  @Get('/list/:campus_id')
  @Roles(Role.USER)
  async list(
    @CurrentUser() user,
    @Param('campus_id') campus_id: Types.ObjectId,
    @Query('page') page: number,
  ) {
    const query = new ReviewQuery({});
    query.campus_id = campus_id;
    query.page = page ?? 0;
    const items = await this.reviewService.reviewList(query);
    const pageNavigation = await this.reviewService.reviewPage(query);
    return {
      pageRoute: pageNavigation,
      review: items.map((e) => new ReviewView(e)),
    };
  }
}
