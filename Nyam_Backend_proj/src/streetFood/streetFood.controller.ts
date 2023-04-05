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
import { StreetFoodService } from './streetFood.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decrator';
import { Role } from 'src/user/objects/user.object';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import { Types } from 'mongoose';
import {
  StreetFoodMangeView,
  StreetFoodQuery,
  StreetFoodView,
  StreetFoodAddRequest,
  StreetFoodUpdateRequest,
} from './streetFood.object';

import { OtherAdmin } from 'src/user/objects/admin.object';
import { LogsService } from 'src/logs/logs.service';
import { CampusService } from 'src/campus/campus.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('StreetFood')
@Controller('streetfood')
export class StreetFoodController {
  constructor(
    private readonly streetFoodService: StreetFoodService,
    private readonly logService: LogsService,
    private readonly campusService: CampusService,
  ) {}

  // *  -------------------------- 관리자  ---------------------------- */
  //길거리 음식 리스트 - 관리자
  @Get('/admin/list')
  @Roles(Role.ADMIN)
  async street_food_admin_list(@CurrentUser() user, @Query() query) {
    const street_food_query = new StreetFoodQuery({});
    if (query.campus_id) {
      street_food_query.campus_id = query.campus_id;
    } else {
      throw new BadRequestException('캠퍼스 id 가 없습니다.');
    }
    const active_query = new StreetFoodQuery(street_food_query);
    active_query.active = true;
    const start_query = new StreetFoodQuery(street_food_query);
    start_query.start = true;
    const end_query = new StreetFoodQuery(street_food_query);
    end_query.end = true;
    const block_query = new StreetFoodQuery(street_food_query);
    block_query.street_food_block = true;

    const [active, start, end, block] = await Promise.all([
      this.streetFoodService.street_food_list(active_query),
      this.streetFoodService.street_food_list(start_query),
      this.streetFoodService.street_food_list(end_query),
      this.streetFoodService.street_food_list(block_query),
    ]);
    return {
      active_list: active.map((e) => new StreetFoodMangeView(e)),
      start_list: start.map((e) => new StreetFoodMangeView(e)),
      end_list: end.map((e) => new StreetFoodMangeView(e)),
      block_list: block.map((e) => new StreetFoodMangeView(e)),
    };
  }
  //길거리 음식 상세보기 - 관리자
  @Get('/admin/detail/:street_food_id')
  @Roles(Role.ADMIN)
  async street_food_detail_admin(
    @CurrentUser() user,
    @Param('street_food_id') street_food_id: Types.ObjectId,
  ) {
    const item = await this.streetFoodService.street_food_detail(
      street_food_id,
      true,
    );
    return {
      street_food: new StreetFoodMangeView(item),
    };
  }
  //길거리 음식 차단하기 - 관리자
  @Put('/block')
  @Roles(Role.ADMIN)
  async street_food_block(@CurrentUser() user, @Body() body) {
    const { street_food_id, action } = body;
    let item = await this.streetFoodService.street_food_block(
      street_food_id,
      action,
    );
    item = await this.streetFoodService.street_food_admin(
      item.id,
      new OtherAdmin(user),
    );
    return { street_food: new StreetFoodMangeView(item) };
  }
  //길거리 음식 삭제하기 - 관리자
  @Delete('/admin/remove/:street_food_id')
  @Roles(Role.ADMIN)
  async street_food_remove_admin(
    @CurrentUser() user,
    @Param('street_food_id') street_food_id: Types.ObjectId,
  ) {
    await this.streetFoodService.street_food_remove(street_food_id);
    await this.streetFoodService.street_food_admin(
      street_food_id,
      new OtherAdmin(user),
    );
    return true;
  }
  //길거리 음식 수정하기 - 관리자, 오너
  @Put('/admin/update')
  @Roles(Role.ADMIN)
  async street_food_update_admin(@CurrentUser() user, @Body() body) {
    let update_data;
    try {
      update_data = new StreetFoodUpdateRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    let item = await this.streetFoodService.street_food_update(update_data);
    item = await this.streetFoodService.street_food_admin(
      item.id,
      new OtherAdmin(user),
    );
    return {
      street_food: new StreetFoodMangeView(item),
    };
  }
  //길거리 음식 추가하기 - 관리자
  @Post('/admin/add')
  @Roles(Role.ADMIN)
  async street_food_add_admin(@CurrentUser() user, @Body() body) {
    let create_data;
    try {
      create_data = new StreetFoodAddRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    let item = await this.streetFoodService.street_food_add(create_data);

    item = await this.streetFoodService.street_food_admin(
      item.id,
      new OtherAdmin(user),
    );

    return {
      street_food: new StreetFoodMangeView(item),
    };
  }
  // *  -------------------------- 매장 주인  ---------------------------- */
  //길거리 음식 상세보기 - 관리자
  @Get('/owner/detail/:street_food_id')
  @Roles(Role.OWNER)
  async street_food_detail_owner(
    @CurrentUser() user,
    @Param('street_food_id') street_food_id: Types.ObjectId,
  ) {
    const item = await this.streetFoodService.street_food_detail(
      street_food_id,
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
    // await this.logService.action_log_add(
    //   new ActionLogAdd(
    //     log_user,
    //     item.campus_id,
    //     campus.campus_name,
    //     item.store.store_id,
    //     'store',
    //     'Sub',
    //     { table_name: 'street_food', table_id: item.id, action: 'Read' },
    //     `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 조회하셨습니다. `,
    //   ),
    // );
    return {
      street_food: new StreetFoodView(item),
    };
  }
  //길거리 음식 삭제하기 - 관리자 , 오너
  @Delete('/owner/remove/:street_food_id')
  @Roles(Role.OWNER)
  async street_food_remove_owner(
    @CurrentUser() user,
    @Param('street_food_id') street_food_id: Types.ObjectId,
  ) {
    const item = await this.streetFoodService.street_food_remove(
      street_food_id,
    );
    // const log_user = {
    //   user_type: 'owner',
    //   uid: user.id,
    //   name: user.owner_name,
    //   user_gender: user.owner_gender,
    //   user_birth: user.owner_birth,
    // };
    // const campus = await this.campusService.detail(item.campus_id);
    // await this.logService.action_log_add(
    //   new ActionLogAdd(
    //     log_user,
    //     item.campus_id,
    //     campus.campus_name,
    //     item.store.store_id,
    //     'store',
    //     'Sub',
    //     { table_name: 'street_food', table_id: item.id, action: 'Delete' },
    //     `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 삭제하셨습니다. `,
    //   ),
    // );
    return true;
  }
  //길거리 음식 수정하기 -  오너
  @Put('/owner/update')
  @Roles(Role.ADMIN, Role.OWNER)
  async street_food_update_owner(@CurrentUser() user, @Body() body) {
    let update_data;
    try {
      update_data = new StreetFoodUpdateRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    const item = await this.streetFoodService.street_food_update(update_data);
    const log_user = {
      user_type: 'owner',
      uid: user.id,
      name: user.owner_name,
      user_gender: user.owner_gender,
      user_birth: user.owner_birth,
    };
    const campus = await this.campusService.detail(item.campus_id);
    // await this.logService.action_log_add(
    //   new ActionLogAdd(
    //     log_user,
    //     item.campus_id,
    //     campus.campus_name,
    //     item.store.store_id,
    //     'store',
    //     'Sub',
    //     { table_name: 'street_food', table_id: item.id, action: 'Update' },
    //     `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 수정하셨습니다. `,
    //   ),
    // );

    return {
      street_food: new StreetFoodView(item),
    };
  }

  // *  -------------------------- 유저  ---------------------------- */

  //길거리 음식 리스트 - 유저
  @Get('user/list/:campus_id')
  @Roles(Role.USER)
  async street_food_list(
    @CurrentUser() user,
    @Param('campus_id') campus_id: Types.ObjectId,
  ) {
    const query_data = new StreetFoodQuery({
      campus_id: campus_id,
      active: true,
      street_food_active: true,
      street_food_block: false,
    });
    query_data.campus_id = campus_id;
    query_data.active = true;
    const items = await this.streetFoodService.street_food_list(query_data);

    return { street_food_list: items.map((e) => new StreetFoodView(e)) };
  }
  //길거리 음식 상세보기 - 유저
  @Get('user/detail/:street_food_id')
  @Roles(Role.USER)
  async street_food_click(
    @CurrentUser() user,
    @Param('street_food_id') street_food_id: Types.ObjectId,
  ) {
    const item = await this.streetFoodService.street_food_detail(
      street_food_id,
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
    // await this.logService.action_log_add(
    //   new ActionLogAdd(
    //     log_user,
    //     item.campus_id,
    //     campus.campus_name,
    //     item.store.store_id,
    //     'store',
    //     'Sub',
    //     { table_name: 'street_food', table_id: item.id, action: 'Click' },
    //     `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 가게 소식를 클릭하셨습니다. `,
    //   ),
    // );
    return {
      street_food: new StreetFoodView(item),
    };
  }
}
