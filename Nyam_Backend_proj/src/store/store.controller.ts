import {
  Controller,
  Post,
  UseGuards,
  BadRequestException,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decrator';
import { Role } from 'src/user/objects/user.object';
import { StoreService } from './store.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import {
  StoreAddRequest,
  MangeStoreView,
  OwnerStoreView,
  StoreQuery,
  StoreAdminQuery,
  StoreAdminSearchQuery,
  StoreUserQuery,
  StoreUserSearchQuery,
  StoreUpdateRequest,
  StoreAdminUpdateRequest,
  StoreSetViewQuery,
} from './store.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { UserService } from 'src/user/user.service';
import { SearchWord } from 'src/user/objects/user.object';
import { modelNames, Types } from 'mongoose';
import { LogsService } from 'src/logs/logs.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { CampusService } from 'src/campus/campus.service';
import { CategoryService } from '../category/category.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
/* *
 *  일시   : 2022년 11월 16일 슈요일
 *  개발자 : 조성현
 *  체크 사항 :
 *  내용 : 스토어 관련 API 리팩토링
 */

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly logService: LogsService,
    private readonly campusService: CampusService,
    private readonly userService: UserService,
  ) {}
  // *  -------------------------- 관리자  ---------------------------- */
  // clear 매장 생성 - 관리자
  
  // clear 매장 리스트 리뷰 이벤트 없음 - 관리자
  /**
   * 성현
   * @param user
   * @param query
   * @returns 매장들 리스트
   */
  @Get('/admin/list')
  @Roles(Role.ADMIN)
  async store_list_admin(@CurrentUser() user, @Query() query) {
    const list = await this.storeService.store_admin_list(
      new StoreAdminQuery(query),
    );
    return { stores: list };
  }
  @Get('/admin/search')
  @Roles(Role.ADMIN)
  async store_admin_search_list_admin(@CurrentUser() user, @Query() query) {
    const list = await this.storeService.store_admin_search_list(
      new StoreAdminSearchQuery(query),
    );

    return { stores: list };
  }
  // clear 매장 리스트 v2
  /**
   *성현
   * @param user
   * @param query
   * @returns 매장들의 리뷰 이벤트+모든것
   */
  @Get('/admin/listdetail')
  @Roles(Role.ADMIN)
  async store_list_detail_admin(@CurrentUser() user, @Query() query) {
    const list = await this.storeService.store_list(new StoreQuery(query));
    const manges = [];
    for (let i = 0; i < list.length; i++) {
      const item = await this.storeService.store_detail_sub_admin(list[i].id);
      manges.push(item);
      manges.push(list[i]);
    }
    return { stores: manges };
  }

  

  //매장 삭제하기 v2 : add 성현
  @Put('/admin/remove/:store_id')
  @Roles(Role.ADMIN)
  async store_remove_admin_v2(
    @CurrentUser() user,
    @Body() body,
    @Param('store_id') store_id: Types.ObjectId,
  ) {
    const { active } = body;
    if (active == null) throw new BadRequestException('삭제여부를 입력하세요.');
    await this.storeService.store_remove_v2(store_id, user.id, true, active);
    await this.storeService.store_admin(store_id, new OtherAdmin(user));
    const store = await this.storeService.store_all_detail(store_id);
    await this.storeService.store_update_sub(store, new OtherAdmin(user));
    return {
      result: store,
    };
  }

  //clear 매장 삭제하기 v1
  @Delete('/admin/remove/:store_id')
  @Roles(Role.ADMIN)
  async store_remove_admin_v1(
    @CurrentUser() user,
    @Param('store_id') store_id: Types.ObjectId,
  ) {
    await this.storeService.store_remove_v1(store_id, user.id, true);
    await this.storeService.store_admin(store_id, new OtherAdmin(user));
    const store = await this.storeService.store_detail(store_id, true);
    await this.storeService.store_update_sub(store, new OtherAdmin(user));
    return true;
  }


  @Put('/admin/view/total')
  @Roles(Role.ADMIN)
  async set_store_total_view_admin(@Query() query) {
    // use query as password
    await this.storeService.store_set_view(new StoreSetViewQuery(query));
    return true;
  }
  // *  -------------------------- 매장 주인  ---------------------------- */
  ....
  // *  -------------------------- 유저  ---------------------------- */
  // clear 매장 리스트 - 유저  refac: 성현  memory 최적화를 위한 불필요한 객체 생성 없엠
  @Get('/user')
  @Roles(Role.USER)
  async store_list_user(@CurrentUser() user, @Query() query) {
    if (!query.campus_id)
      throw new BadRequestException('대학교 정보를 입력해주세요');

    const search_query = new StoreUserQuery(query);

    const pageRoute = await this.storeService.pageCheck(search_query);

    const list = await this.storeService.store_user_list(search_query);

    const results = [];

    for (let i = 0; i < list.length; i++) {
      const item = await this.storeService.store_detail_sub_user(list[i]);

      results.push(item);
    }
    return {
      pageRoute: pageRoute,
      stores: results,
    };
  }

  @Get('/user/search')
  @Roles(Role.USER)
  async store_user_list_user_search(@CurrentUser() user, @Query() query) {
    if (!query.campus_id)
      throw new BadRequestException('대학교 정보를 입력해주세요');
    const campus = await this.campusService.detail(query.campus_id);
    const search_query = new StoreUserSearchQuery(query);
    const list = await this.storeService.store_user_search_list(search_query);
    await this.userService.addSearchKeyword(
      user.id,
      new SearchWord(search_query.search),
    );
    //add
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
        user.id,
        'user',
        'Read',
        null,
        `${log_user.name} 님이  ${query.search}를 검색하셨습니다`,
      ),
    );

    return {
      stores: list,
    };
  }

  // clear 매장 상세보기 - 유저 reafct: add logoff :성현 
  @Roles(Role.USER)
  @Get('/user/detail/:store_id')
  async store_detail_user(
    @CurrentUser() user,
    @Param('store_id') store_id: Types.ObjectId,
    @Query('log_off') log_off: boolean,
  ) {
    const store = await this.storeService.store_detail(store_id, false);
    const data = await this.storeService.store_detail_sub_user(store);
    console.log(log_off);
    if (log_off) {
      const log_user = {
        user_type: 'user',
        uid: user.id,
        name: user.user_nickname,
        user_gender: user.user_gender,
        user_birth: user.user_birth,
      };
      const campus = await this.campusService.detail(store.campus_id);
      await this.logService.action_log_add(
        new ActionLogAdd(
          log_user,
          store.campus_id,
          campus.campus_name,
          store.id,
          'store',
          'Read',
          null,
          `${log_user.name} 님이 ${campus.campus_name}의  ${store.store_name} 매장을 조조 하셨습니다. `,
        ),
      );
    }
    return { store: data };
  }
}
