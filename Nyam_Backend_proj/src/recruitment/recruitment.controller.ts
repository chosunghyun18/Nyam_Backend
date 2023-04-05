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
import { RecruitmentService } from './recruitment.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/common/decorators/roles.decrator';
import { Role } from 'src/user/objects/user.object';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import { Types } from 'mongoose';
import { StoreService } from '../store/store.service';

import {
  RecruitmentMangeView,
  RecruitmentQuery,
  RecruitmentView,
  RecruitmentAddRequest,
  RecruitmentUpdateRequest,
} from './recruitment.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { LogsService } from 'src/logs/logs.service';
import { CampusService } from 'src/campus/campus.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

/* *
 *  일시   : 2022년 1월 11일
 *  개발자 : 조성현
 *  체크 사항 : 구인구직 클릭 및  로그 사항이 작업진행 필요
 *  내용 : 구인구직 관련 API 리팩토링
 */

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Recruitment')
@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly recruitmentService: RecruitmentService,
    private readonly storeServcie: StoreService,
    private readonly logService: LogsService,
    private readonly campusService: CampusService,
  ) {}

  // *  -------------------------- 관리자  ---------------------------- */
  // clear 구인구직 리스트 - 관리자
  @Get('/admin/list')
  @Roles(Role.ADMIN)
  async recruitment_admin_list(@CurrentUser() user, @Query() query) {
    const query_base = new RecruitmentQuery({});
    if (query.campus_id) query_base.campus_id = query.campus_id;
    if (query.store_id) query_base.store_id = query.store_id;
    const active_query = new RecruitmentQuery(query_base);
    active_query.active = true;
    const start_query = new RecruitmentQuery(query_base);
    start_query.start = true;
    const end_query = new RecruitmentQuery(query_base);
    end_query.end = true;
    const block_query = new RecruitmentQuery(query_base);
    block_query.recruitment_block = true;

    const [active, reserved, end, block] = await Promise.all([
      this.recruitmentService.recruitment_list(active_query),
      this.recruitmentService.recruitment_list(start_query),
      this.recruitmentService.recruitment_list(end_query),
      this.recruitmentService.recruitment_list(block_query),
    ]);
    return {
      active_list: active.map((e) => new RecruitmentMangeView(e)),
      reserved_list: reserved.map((e) => new RecruitmentMangeView(e)),
      end_list: end.map((e) => new RecruitmentMangeView(e)),
      block_list: block.map((e) => new RecruitmentMangeView(e)),
    };
  }
  // clear 구인구직 상세보기 - 관리자
  @Get('/admin/detail/:recruitment_id')
  @Roles(Role.ADMIN)
  async recruitment_detail_admin(
    @CurrentUser() user,
    @Param('recruitment_id') recruitment_id: Types.ObjectId,
  ) {
    const item = await this.recruitmentService.recruitment_detail(
      recruitment_id,
      true,
    );
    return {
      recruitment: new RecruitmentMangeView(item),
    };
  }
  // clear 구인구직 차단하기 - 관리자
  @Put('/block')
  @Roles(Role.ADMIN)
  async recruitment_block(@CurrentUser() user, @Body() body) {
    const { recruitment_id, action } = body;
    let item = await this.recruitmentService.recruitment_block(
      recruitment_id,
      action,
    );
    item = await this.recruitmentService.recruitment_admin(
      item.id,
      new OtherAdmin(user),
    );
    return { recruitment: new RecruitmentMangeView(item) };
  }
  // clear 구인구직 삭제하기 - 관리자
  @Delete('/admin/remove/:recruitment_id')
  @Roles(Role.ADMIN)
  async recruitment_remove_admin(
    @CurrentUser() user,
    @Param('recruitment_id') recruitment_id: Types.ObjectId,
  ) {
    await this.recruitmentService.recruitment_remove(recruitment_id);
    await this.recruitmentService.recruitment_admin(
      recruitment_id,
      new OtherAdmin(user),
    );
    return true;
  }
  // clear 구인구직 수정하기 - 관리자, 오너
  @Put('/admin/update')
  @Roles(Role.ADMIN)
  async recruitment_update_admin(@CurrentUser() user, @Body() body) {
    let update_data;
    try {
      update_data = new RecruitmentUpdateRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    let item = await this.recruitmentService.recruitment_update(update_data);
    item = await this.recruitmentService.recruitment_admin(
      item.id,
      new OtherAdmin(user),
    );
    return {
      recruitment: new RecruitmentMangeView(item),
    };
  }
  // clear 구인구직 추가하기 - 관리자
  @Post('/admin/add/:store_id')
  @Roles(Role.ADMIN)
  async recruitment_add_admin(
    @CurrentUser() user,
    @Body() body,
    @Param('store_id') store_id: Types.ObjectId,
  ) {
    let create_data;
    const store = await this.storeServcie.store_detail(store_id, true);

    try {
      create_data = new RecruitmentAddRequest(body, store);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    let item = await this.recruitmentService.recruitment_add(create_data);

    item = await this.recruitmentService.recruitment_admin(
      item.id,
      new OtherAdmin(user),
    );

    return {
      recruitment: new RecruitmentMangeView(item),
    };
  }
  // *  -------------------------- 매장 주인  ---------------------------- */
  // clear 구인구직 상세보기 - 관리자
  @Get('/owner/detail/:recruitment_id')
  @Roles(Role.OWNER)
  async recruitment_detail_owner(
    @CurrentUser() user,
    @Param('recruitment_id') recruitment_id: Types.ObjectId,
  ) {
    const item = await this.recruitmentService.recruitment_detail(
      recruitment_id,
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
        { table_name: 'recruitment', table_id: item.id, action: 'Read' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 구인구직를 조회하셨습니다. `,
      ),
    );
    return {
      recruitment: new RecruitmentView(item),
    };
  }
  // clear 구인구직 삭제하기 - 관리자 , 오너
  @Delete('/owner/remove/:recruitment_id')
  @Roles(Role.OWNER)
  async recruitment_remove_owner(
    @CurrentUser() user,
    @Param('recruitment_id') recruitment_id: Types.ObjectId,
  ) {
    const item = await this.recruitmentService.recruitment_remove(
      recruitment_id,
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
        { table_name: 'recruitment', table_id: item.id, action: 'Delete' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 구인구직를 삭제하셨습니다. `,
      ),
    );
    return true;
  }
  // clear 구인구직 수정하기 -  오너
  @Put('/owner/update')
  @Roles(Role.ADMIN, Role.OWNER)
  async recruitment_update_owner(@CurrentUser() user, @Body() body) {
    let update_data;
    try {
      update_data = new RecruitmentUpdateRequest(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    const item = await this.recruitmentService.recruitment_update(update_data);
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
        { table_name: 'recruitment', table_id: item.id, action: 'Update' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 구인구직를 수정하셨습니다. `,
      ),
    );

    return {
      recruitment: new RecruitmentView(item),
    };
  }
  // clear 구인구직 추가하기 -  오너
  @Post('/owner/add/:store_id')
  @Roles(Role.OWNER)
  async recruitment_add_owner(
    @CurrentUser() user,
    @Body() body,
    @Param('store_id') store_id: Types.ObjectId,
  ) {
    let create_data;
    const store = await this.storeServcie.store_detail(store_id, false);

    try {
      create_data = new RecruitmentAddRequest(body, store);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 요청입니다.');
    }
    const item = await this.recruitmentService.recruitment_add(create_data);
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
        { table_name: 'recruitment', table_id: item.id, action: 'Create' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 구인구직를 추가하셨습니다. `,
      ),
    );
    return {
      recruitment: new RecruitmentView(item),
    };
  }

  // *  -------------------------- 유저  ---------------------------- */

  // clear 구인구직 리스트 - 유저
  @Get('/list/:campus_id')
  @Roles(Role.USER)
  async recruitment_list(
    @CurrentUser() user,
    @Param('campus_id') campus_id: Types.ObjectId,
  ) {
    const query_data = new RecruitmentQuery({
      campus_id: campus_id,
      active: true,
      recruitment_active: true,
      recruitment_block: false,
    });
    console.log(query_data);
    query_data.campus_id = campus_id;
    query_data.active = true;
    const items = await this.recruitmentService.recruitment_list(query_data);
    const log_user = {
      user_type: 'user',
      uid: user.id,
      name: user.user_nickname,
      user_gender: user.user_gender,
      user_birth: user.user_birth,
    };
    items.forEach(async (item) => {
      const campus = await this.campusService.detail(item.campus_id);
      await this.logService.action_log_add(
        new ActionLogAdd(
          log_user,
          item.campus_id,
          campus.campus_name,
          item.store.store_id,
          'store',
          'Sub',
          { table_name: 'recruitment', table_id: item.id, action: 'Read' },
          `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의  구인구직를 조회하셨습니다. `,
        ),
      );
    });
    return { recruitment_list: items.map((e) => new RecruitmentView(e)) };
  }
  // clear 구인구직 클릭구인구직 - 유저
  @Get('/click/:recruitment_id')
  @Roles(Role.USER)
  async recruitment_click(
    @CurrentUser() user,
    @Param('recruitment_id') recruitment_id: Types.ObjectId,
  ) {
    const item = await this.recruitmentService.recruitment_detail(
      recruitment_id,
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
        { table_name: 'recruitment', table_id: item.id, action: 'Click' },
        `${log_user.name} 님이 ${campus.campus_name} 캠퍼스에  ${item.store.store_name} 매장의 구인구직를 클릭하셨습니다. `,
      ),
    );
    return true;
  }
}
