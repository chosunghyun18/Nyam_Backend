import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from 'src/user/objects/user.object';
import { Roles } from 'src/common/decorators/roles.decrator';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import {
  RequestScript,
  UserRequestQuery,
  UserRequestView,
  UserRequestManageView,
} from './objects/user.request.object';
import { LogsService } from 'src/logs/logs.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
/* *
 *  일시   : 2023년 2월 26일 일요일
 *  개발자 : 조성현
 *  체크 사항 :
 *  내용 : 요청사항 관련 API 리팩토링
 */

@UseGuards(AuthGuard)
@ApiTags('Request')
@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly logService: LogsService,
  ) {}
  // *  -------------------------- 관리자  ---------------------------- */
  //clear 유저 요청 답변 - 관리자
  @Post('admin/user')
  @Roles(Role.ADMIN)
  async user_request_answer(@CurrentUser() user, @Body() body) {
    const { request_sub, request_id } = body;
    const data = new RequestScript('admin', request_sub);
    const item = await this.requestService.admin_request_add(
      user.id,
      request_id,
      data,
    );
    return { request: new UserRequestManageView(item) };
  }

  @Put('admin/user/check')
  @Roles(Role.ADMIN)
  async user_request_check(@CurrentUser() user, @Body() body) {
    const { request_check, request_id } = body;
    const item = await this.requestService.admin_request_check(
      user.id,
      request_id,
      request_check,
    );
    return { request: new UserRequestManageView(item) };
  }

  //clear 유저 요청 리스트 - 관리자  - 답변 여부
  @Get('admin/user')
  @Roles(Role.ADMIN)
  async user_request_list(@CurrentUser() user, @Query() query) {
    const list = await this.requestService.admin_request_list(
      new UserRequestQuery(query),
    );
    return { request_list: list.map((e) => new UserRequestManageView(e)) };
  }

  // *  -------------------------- 유저  ---------------------------- */
  //clear 유저 요청 - 유저
  @Post('/user')
  @Roles(Role.USER)
  async user_request_add(@CurrentUser() user, @Body() body) {
    const { request_sub } = body;
    const data = new RequestScript('user', request_sub);
    const item = await this.requestService.user_request_add(user.id, data);
    const log_user = {
      user_type: '',
      uid: user.id,
      name: user.user_nickname,
      user_gender: user.user_gender,
      user_birth: user.user_birth,
    };
    await this.logService.action_log_add(
      new ActionLogAdd(
        log_user,
        null,
        null,
        item.id,
        'user_request',
        'Create',
        null,
        `${log_user.name} 님이 ${item.request_script} 문의를 생성하셨습니다. `,
      ),
    );
    return { request: new UserRequestView(item) };
  }

  @Get('/user')
  @Roles(Role.USER)
  async user_request_callAll(@CurrentUser() user) {
    const item = await this.requestService.user_request_list(user.id);
    return { data: new UserRequestView(item) };
  }
  // *  -------------------------- 매장 주인  ---------------------------- */

  // clear 주인 요청 - 주인
  // @Post('/owner')
  // @Roles(Role.OWNER)
  // async owner_request_add(@CurrentUser() user, @Body() body) {
  //   const data = new OwnerRequestAdd(user, body);
  //   const log_user = {
  //     user_type: 'owner',
  //     uid: user.id,
  //     name: user.owner_name,
  //     user_gender: user.owner_gender,
  //     user_birth: user.owner_birth,
  //   };
  //   const item = await this.requestService.owner_request_add(data);
  //   await this.logService.action_log_add(
  //     new ActionLogAdd(
  //       log_user,
  //       null,
  //       null,
  //       item.id,
  //       'owner_request',
  //       'Create',
  //       null,
  //       `${log_user.name} 님이 ${item.id} 요청사항을 생성하셨습니다. `,
  //     ),
  //   );
  //   return { request: new OwnerRequestView(item) };
  // }
}
