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
import { DiscountService } from './discount.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decrator';
import { Role } from 'src/user/objects/user.object';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import { Types } from 'mongoose';
import { StoreService } from '../store/store.service';

import {
  DiscountMangeView,
  DiscountQuery,
  DiscountView,
  DiscountAddRequest,
  DiscountUpdateRequest,
} from './discount.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { LogsService } from 'src/logs/logs.service';
import { CampusService } from 'src/campus/campus.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { getCurrentDate } from 'src/common/util/dateTime';
/* *
 *  일시   : 2022년 1월 14일
 *  개발자 : 조성현
 *  체크 사항 : 마감 할인 클릭 및  로그 사항이 작업진행 필요
 *  내용 : 마감 할인 관련 API 리팩토링
 */

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Discount')
@Controller('discount')
export class DiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly storeServcie: StoreService,
    private readonly logService: LogsService,
    private readonly campusService: CampusService,
  ) {}

  // *  -------------------------- 관리자  ---------------------------- */
  // clear 마감 할인 리스트 - 관리자
  @Get('/admin/list')
  @Roles(Role.ADMIN)
  async discount_admin_list(@CurrentUser() user, @Query() query) {
    const query_base = new DiscountQuery({});
    if (query.campus_id) query_base.campus_id = query.campus_id;
    if (query.store_id) query_base.store_id = query.store_id;
    const active_query = new DiscountQuery(query_base);
    active_query.active = true;
    const start_query = new DiscountQuery(query_base);
    start_query.start = true;
    const end_query = new DiscountQuery(query_base);
    end_query.end = true;
    const block_query = new DiscountQuery(query_base);
    block_query.discount_block = true;

    const [active, reserved, end, block] = await Promise.all([
      this.discountService.discount_list(active_query),
      this.discountService.discount_list(start_query),
      this.discountService.discount_list(end_query),
      this.discountService.discount_list(block_query),
    ]);
    return {
      active_list: active.map((e) => new DiscountMangeView(e)),
      reserved_list: reserved.map((e) => new DiscountMangeView(e)),
      end_list: end.map((e) => new DiscountMangeView(e)),
      block_list: block.map((e) => new DiscountMangeView(e)),
    };
  }
  // clear 마감 할인 상세보기 - 관리자
  @Get('/admin/detail/:discount_id')
  @Roles(Role.ADMIN)
  async discount_detail_admin(
    @CurrentUser() user,
    @Param('discount_id') discount_id: Types.ObjectId,
  ) {
    const item = await this.discountService.discount_detail(discount_id, true);
    return {
      discount: new DiscountMangeView(item),
    };
  }
  // clear 마감 할인 차단하기 - 관리자
  @Put('/block')
  @Roles(Role.ADMIN)
  async discount_block(@CurrentUser() user, @Body() body) {
    const { discount_id, action } = body;
    let item = await this.discountService.discount_block(discount_id, action);
    item = await this.discountService.discount_admin(
      item.id,
      new OtherAdmin(user),
    );
    return { discount: new DiscountMangeView(item) };
  }
  // clear 마감 할인 삭제하기 - 관리자
  @Delete('/admin/remove/:discount_id')
  @Roles(Role.ADMIN)
  async discount_remove_admin(
    @CurrentUser() user,
    @Param('discount_id') discount_id: Types.ObjectId,
  ) {
    await this.discountService.discount_remove(discount_id);
    await this.discountService.discount_admin(
      discount_id,
      new OtherAdmin(user),
    );
    return true;
  }
  // clear 마감 할인 수정하기 - 관리자, 오너
  @Put('/admin/update')
  @Roles(Role.ADMIN)
  async discount_update_admin(@CurrentUser() user, @Body() body) {
    let update_data;
    try {
      update_data = new DiscountUpdateRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    let item = await this.discountService.discount_update(update_data);
    item = await this.discountService.discount_admin(
      item.id,
      new OtherAdmin(user),
    );
    return {
      discount: new DiscountMangeView(item),
    };
  }
  // clear 마감 할인 추가하기 - 관리자
  @Post('/admin/add/:store_id')
  @Roles(Role.ADMIN)
  async discount_add_admin(
    @CurrentUser() user,
    @Body() body,
    @Param('store_id') store_id: Types.ObjectId,
  ) {
    let create_data;
    const store = await this.storeServcie.store_detail(store_id, true);

    try {
      create_data = new DiscountAddRequest(body, store);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }

    const active_query = new DiscountQuery({
      campus_id: create_data.campus_id,
      store_id: store.id,
      active: true,
      discount_active: true,
      discount_block: false,
    });
    active_query.active = true;
    const time_out_query = new DiscountQuery({
      campus_id: create_data.campus_id,
      store_id: store.id,
      active: true,
      discount_active: true,
      discount_block: false,
    });
    time_out_query.time_out = true;

    const [active, time_out] = await Promise.all([
      this.discountService.discount_list(active_query),
      this.discountService.discount_list(time_out_query),
    ]);

    if (active.length != 0) {
      throw new BadRequestException('마감할인이 진행중입니다.');
    }

    let item = await this.discountService.discount_add(create_data, time_out);

    item = await this.discountService.discount_admin(
      item.id,
      new OtherAdmin(user),
    );

    return {
      discount: new DiscountMangeView(item),
    };
  }
  // *  -------------------------- 매장 주인  ---------------------------- */
  // clear 마감 할인 상세보기 - 관리자
  @Get('/owner/detail/:discount_id')
  @Roles(Role.OWNER)
  async discount_detail_owner(
    @CurrentUser() user,
    @Param('discount_id') discount_id: Types.ObjectId,
  ) {
    const item = await this.discountService.discount_detail(discount_id, false);
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
        { table_name: 'discount', table_id: item.id, action: 'Read' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 마감 할인를 조회하셨습니다. `,
      ),
    );
    return {
      discount: new DiscountView(item),
    };
  }
  // clear 마감 할인 삭제하기 - 관리자 , 오너
  @Delete('/owner/remove/:discount_id')
  @Roles(Role.OWNER)
  async discount_remove_owner(
    @CurrentUser() user,
    @Param('discount_id') discount_id: Types.ObjectId,
  ) {
    const item = await this.discountService.discount_remove(discount_id);
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
        { table_name: 'discount', table_id: item.id, action: 'Delete' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 마감 할인를 삭제하셨습니다. `,
      ),
    );
    return true;
  }
  // clear 마감 할인 수정하기 -  오너
  @Put('/owner/update')
  @Roles(Role.ADMIN, Role.OWNER)
  async discount_update_owner(@CurrentUser() user, @Body() body) {
    let update_data;
    try {
      update_data = new DiscountUpdateRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    const item = await this.discountService.discount_update(update_data);
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
        { table_name: 'discount', table_id: item.id, action: 'Update' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 마감 할인를 수정하셨습니다. `,
      ),
    );

    return {
      discount: new DiscountView(item),
    };
  }
  // clear 마감 할인 추가하기 -  오너
  @Post('/owner/add/:store_id')
  @Roles(Role.OWNER)
  async discount_add_owner(
    @CurrentUser() user,
    @Body() body,
    @Param('store_id') store_id: Types.ObjectId,
  ) {
    let create_data;
    const store = await this.storeServcie.store_detail(store_id, false);

    try {
      create_data = new DiscountAddRequest(body, store);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    const active_query = new DiscountQuery({
      campus_id: create_data.campus_id,
      store_id: store_id,
      active: true,
      discount_active: true,
      discount_block: false,
    });
    active_query.active = true;

    const time_out_query = new DiscountQuery({
      campus_id: create_data.campus_id,
      store_id: store_id,
      active: true,
      discount_active: true,
      discount_block: false,
    });
    time_out_query.time_out = true;

    const [active, time_out] = await Promise.all([
      this.discountService.discount_list(active_query),
      this.discountService.discount_list(time_out_query),
    ]);
    if (active) {
      throw new BadRequestException('마감할인이 진행중입니다.');
    }

    const item = await this.discountService.discount_add(create_data, time_out);

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
        { table_name: 'discount', table_id: item.id, action: 'Create' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 마감 할인를 추가하셨습니다. `,
      ),
    );
    return {
      discount: new DiscountView(item),
    };
  }

  // *  -------------------------- 유저  ---------------------------- */

  // clear 마감 할인 리스트 - 유저
  @Get('/list/:campus_id')
  @Roles(Role.USER)
  async discount_list(
    @CurrentUser() user,
    @Param('campus_id') campus_id: Types.ObjectId,
  ) {
    const active_query = new DiscountQuery({
      campus_id: campus_id,
      active: true,
      discount_active: true,
      discount_block: false,
    });

    active_query.active = true;

    const time_out_query = new DiscountQuery({
      campus_id: campus_id,
      active: true,
      discount_active: true,
      discount_block: false,
    });

    time_out_query.time_out = true;

    const [active, end] = await Promise.all([
      this.discountService.discount_list(active_query),
      this.discountService.discount_list(time_out_query),
    ]);

    return {
      discount_list: active.map((e) => new DiscountView(e)),
      time_out_list: end.map((e) => new DiscountView(e)),
    };
  }
  // clear 마감 할인 클릭마감 할인 - 유저
  @Get('/click/:discount_id')
  @Roles(Role.USER)
  async discount_click(
    @CurrentUser() user,
    @Param('discount_id') discount_id: Types.ObjectId,
  ) {
    const item = await this.discountService.discount_detail(discount_id, false);
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
        { table_name: 'discount', table_id: item.id, action: 'Click' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 마감 할인를 클릭하셨습니다. `,
      ),
    );
    return true;
  }
}
