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
import { PromotionService } from './promotion.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decrator';
import { Role } from 'src/user/objects/user.object';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import { Types } from 'mongoose';
import { StoreService } from '../store/store.service';

import {
  PromotionMangeView,
  PromotionQuery,
  PromotionView,
  PromotionAddRequest,
  PromotionUpdateRequest,
} from './promotion.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { LogsService } from 'src/logs/logs.service';
import { CampusService } from 'src/campus/campus.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
/* *
 *  일시   : 2023년 1월 21일
 *  개발자 : 조성현
 *  체크 사항 :
 *  내용 :
 */

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Promotion')
@Controller('promotion')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly storeServcie: StoreService,
    private readonly logService: LogsService,
    private readonly campusService: CampusService,
  ) {}

  // *  -------------------------- 관리자  ---------------------------- */
  // clear 가게 소식 리스트 - 관리자
  @Get('/admin/list')
  @Roles(Role.ADMIN)
  async promotion_admin_list(@CurrentUser() user, @Query() query) {
    const query_base = new PromotionQuery({});
    if (query.campus_id) query_base.campus_id = query.campus_id;
    if (query.store_id) query_base.store_id = query.store_id;
    const active_query = new PromotionQuery(query_base);
    active_query.active = true;
    const start_query = new PromotionQuery(query_base);
    start_query.start = true;
    const end_query = new PromotionQuery(query_base);
    end_query.end = true;
    const block_query = new PromotionQuery(query_base);
    block_query.promotion_block = true;

    const [active, start, end, block] = await Promise.all([
      this.promotionService.promotion_list(active_query),
      this.promotionService.promotion_list(start_query),
      this.promotionService.promotion_list(end_query),
      this.promotionService.promotion_list(block_query),
    ]);
    return {
      active_list: active.map((e) => new PromotionMangeView(e)),
      start_list: start.map((e) => new PromotionMangeView(e)),
      end_list: end.map((e) => new PromotionMangeView(e)),
      block_list: block.map((e) => new PromotionMangeView(e)),
    };
  }
  // clear 가게 소식 상세보기 - 관리자
  @Get('/admin/detail/:promotion_id')
  @Roles(Role.ADMIN)
  async promotion_detail_admin(
    @CurrentUser() user,
    @Param('promotion_id') promotion_id: Types.ObjectId,
  ) {
    const item = await this.promotionService.promotion_detail(
      promotion_id,
      true,
    );
    return {
      promotion: new PromotionMangeView(item),
    };
  }
  // clear 가게 소식 차단하기 - 관리자
  @Put('/block')
  @Roles(Role.ADMIN)
  async promotion_block(@CurrentUser() user, @Body() body) {
    const { promotion_id, action } = body;
    let item = await this.promotionService.promotion_block(
      promotion_id,
      action,
    );
    item = await this.promotionService.promotion_admin(
      item.id,
      new OtherAdmin(user),
    );
    return { promotion: new PromotionMangeView(item) };
  }
  // clear 가게 소식 삭제하기 - 관리자
  @Delete('/admin/remove/:promotion_id')
  @Roles(Role.ADMIN)
  async promotion_remove_admin(
    @CurrentUser() user,
    @Param('promotion_id') promotion_id: Types.ObjectId,
  ) {
    await this.promotionService.promotion_remove(promotion_id);
    await this.promotionService.promotion_admin(
      promotion_id,
      new OtherAdmin(user),
    );
    return true;
  }
  // clear 가게 소식 수정하기 - 관리자, 오너
  @Put('/admin/update')
  @Roles(Role.ADMIN)
  async promotion_update_admin(@CurrentUser() user, @Body() body) {
    let update_data;
    try {
      update_data = new PromotionUpdateRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    let item = await this.promotionService.promotion_update(update_data);
    item = await this.promotionService.promotion_admin(
      item.id,
      new OtherAdmin(user),
    );
    return {
      promotion: new PromotionMangeView(item),
    };
  }
  // clear 가게 소식 추가하기 - 관리자
  @Post('/admin/add/:store_id')
  @Roles(Role.ADMIN)
  async promotion_add_admin(
    @CurrentUser() user,
    @Body() body,
    @Param('store_id') store_id: Types.ObjectId,
  ) {
    let create_data;
    const store = await this.storeServcie.store_detail(store_id, true);

    try {
      create_data = new PromotionAddRequest(body, store);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    let item = await this.promotionService.promotion_add(create_data);

    item = await this.promotionService.promotion_admin(
      item.id,
      new OtherAdmin(user),
    );

    return {
      promotion: new PromotionMangeView(item),
    };
  }
  // *  -------------------------- 매장 주인  ---------------------------- */
  // clear 가게 소식 상세보기 - 관리자
  @Get('/owner/detail/:promotion_id')
  @Roles(Role.OWNER)
  async promotion_detail_owner(
    @CurrentUser() user,
    @Param('promotion_id') promotion_id: Types.ObjectId,
  ) {
    const item = await this.promotionService.promotion_detail(
      promotion_id,
      false,
    );
    const log_user = {
      user_type: 'owner',
      uid: user.id,
      name: user.owner_name,
      user_gender: user.owner_gender,
      user_birth: user.owner_birth,
    };
    const campus = await this.campusService.detail(item.campus_id);
    await this.logService.action_log_add(
      new ActionLogAdd(
        log_user,
        item.campus_id,
        campus.campus_name,
        item.store.store_id,
        'store',
        'Sub',
        { table_name: 'promotion', table_id: item.id, action: 'Read' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 조회하셨습니다. `,
      ),
    );
    return {
      promotion: new PromotionView(item),
    };
  }
  // clear 가게 소식 삭제하기 - 관리자 , 오너
  @Delete('/owner/remove/:promotion_id')
  @Roles(Role.OWNER)
  async promotion_remove_owner(
    @CurrentUser() user,
    @Param('promotion_id') promotion_id: Types.ObjectId,
  ) {
    const item = await this.promotionService.promotion_remove(promotion_id);
    const log_user = {
      user_type: 'owner',
      uid: user.id,
      name: user.owner_name,
      user_gender: user.owner_gender,
      user_birth: user.owner_birth,
    };
    const campus = await this.campusService.detail(item.campus_id);
    await this.logService.action_log_add(
      new ActionLogAdd(
        log_user,
        item.campus_id,
        campus.campus_name,
        item.store.store_id,
        'store',
        'Sub',
        { table_name: 'promotion', table_id: item.id, action: 'Delete' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 삭제하셨습니다. `,
      ),
    );
    return true;
  }
  // clear 가게 소식 수정하기 -  오너
  @Put('/owner/update')
  @Roles(Role.ADMIN, Role.OWNER)
  async promotion_update_owner(@CurrentUser() user, @Body() body) {
    let update_data;
    try {
      update_data = new PromotionUpdateRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    const item = await this.promotionService.promotion_update(update_data);
    const log_user = {
      user_type: 'owner',
      uid: user.id,
      name: user.owner_name,
      user_gender: user.owner_gender,
      user_birth: user.owner_birth,
    };
    const campus = await this.campusService.detail(item.campus_id);
    await this.logService.action_log_add(
      new ActionLogAdd(
        log_user,
        item.campus_id,
        campus.campus_name,
        item.store.store_id,
        'store',
        'Sub',
        { table_name: 'promotion', table_id: item.id, action: 'Update' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 수정하셨습니다. `,
      ),
    );

    return {
      promotion: new PromotionView(item),
    };
  }
  // clear 가게 소식 추가하기 -  오너
  @Post('/owner/add/:store_id')
  @Roles(Role.OWNER)
  async promotion_add_owner(
    @CurrentUser() user,
    @Body() body,
    @Param('store_id') store_id: Types.ObjectId,
  ) {
    let create_data;
    const store = await this.storeServcie.store_detail(store_id, false);

    try {
      create_data = new PromotionAddRequest(body, store);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    const item = await this.promotionService.promotion_add(create_data);
    const log_user = {
      user_type: 'owner',
      uid: user.id,
      name: user.owner_name,
      user_gender: user.owner_gender,
      user_birth: user.owner_birth,
    };
    const campus = await this.campusService.detail(item.campus_id);
    await this.logService.action_log_add(
      new ActionLogAdd(
        log_user,
        item.campus_id,
        campus.campus_name,
        item.store.store_id,
        'store',
        'Sub',
        { table_name: 'promotion', table_id: item.id, action: 'Create' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 추가하셨습니다. `,
      ),
    );
    return {
      promotion: new PromotionView(item),
    };
  }

  // *  -------------------------- 유저  ---------------------------- */

  // clear 가게 소식 리스트 - 유저
  @Get('/list/:campus_id')
  @Roles(Role.USER)
  async promotion_list(
    @CurrentUser() user,
    @Param('campus_id') campus_id: Types.ObjectId,
  ) {
    const query_data = new PromotionQuery({
      campus_id: campus_id,
      active: true,
      promotion_active: true,
      promotion_block: false,
    });
    query_data.campus_id = campus_id;
    query_data.active = true;
    const items = await this.promotionService.promotion_list(query_data);
    return { promotion_list: items.map((e) => new PromotionView(e)) };
  }
  // clear 가게 소식 클릭가게 소식 - 유저
  @Get('/click/:promotion_id')
  @Roles(Role.USER)
  async promotion_click(
    @CurrentUser() user,
    @Param('promotion_id') promotion_id: Types.ObjectId,
  ) {
    const item = await this.promotionService.promotion_detail(
      promotion_id,
      false,
    );
    const log_user = {
      user_type: 'user',
      uid: user.id,
      name: user.user_nickname,
      user_gender: user.user_gender,
      user_birth: user.user_birth,
    };
    const campus = await this.campusService.detail(item.campus_id);
    await this.logService.action_log_add(
      new ActionLogAdd(
        log_user,
        item.campus_id,
        campus.campus_name,
        item.store.store_id,
        'store',
        'Sub',
        { table_name: 'promotion', table_id: item.id, action: 'Click' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 클릭하셨습니다. `,
      ),
    );
    return true;
  }
}
