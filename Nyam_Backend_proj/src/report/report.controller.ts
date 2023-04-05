import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from 'src/user/objects/user.object';
import { Roles } from 'src/common/decorators/roles.decrator';
import { CurrentUser } from 'src/common/decorators/user.decrator';

import {
  UserReportAdd,
  UserReportQuery,
  UserReportManageView,
  UserReportView,
} from './objects/user.report.object';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { LogsService } from 'src/logs/logs.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { ApiTags } from '@nestjs/swagger';
import { CampusService } from 'src/campus/campus.service';
/* *
 *  일시   : 2023년 2월 25일 월요일
 *  개발자 : 조성현
 *  체크 사항 : 추가 적인 확장 가능성 및 인터페이스
 *  내용 : 유저제보 관련 api
 */

@UseGuards(AuthGuard)
@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(
    private readonly campusService: CampusService,
    private readonly reportService: ReportService,
    private readonly logService: LogsService,
  ) {}
  // *  -------------------------- 관리자  ---------------------------- */

  // 유저 요청 리스트 - 관리자  - 답변 여부,enum
  @Get('admin/user')
  @Roles(Role.ADMIN)
  async user_report_list(@CurrentUser() user, @Query() query) {
    const list = await this.reportService.user_report_list(
      new UserReportQuery(query),
    );

    return { report_list: list.map((e) => new UserReportManageView(e)) };
  }

  // 유저 요청 확인 체크
  @Put('admin/user')
  @Roles(Role.ADMIN)
  async user_report_check(@CurrentUser() user, @Body() body) {
    const { report_id, check } = body;
    const item = await this.reportService.user_report_check(
      new OtherAdmin(user),
      report_id,
      check,
    );

    return { result: item };
  }

  // 유저 요청 삭제
  @Delete('admin/user')
  @Roles(Role.ADMIN)
  async user_report_delete(@CurrentUser() user, @Body() body) {
    const { report_id, active } = body;
    const item = await this.reportService.user_report_delete(
      new OtherAdmin(user),
      report_id,
      active,
    );
    return { result: item };
  }

  // *  -------------------------- 유저  ---------------------------- */
  // 유저 요청 - 유저
  @Post('/user')
  @Roles(Role.USER)
  async user_report_add(@CurrentUser() user, @Query() query, @Body() body) {
    const { campus_id } = query;
    const data = new UserReportAdd(user, campus_id, body);
    const item = await this.reportService.user_report_add(data);
    const log_user = {
      user_type: 'user',
      uid: user.id,
      name: user.user_nickname,
      user_gender: user.user_gender,
      user_birth: user.user_birth,
    };
    const campus = await this.campusService.detail(campus_id);
    await this.logService.action_log_add(
      new ActionLogAdd(
        log_user,
        campus.campus_name,
        campus_id,
        item.id,
        'user_report',
        'Create',
        null,
        `${log_user.name} 님이 ${item.user_report_store_name} 과 관련된 ${item.user_report_type}의 제보를 생성하셨습니다. `,
      ),
    );
    return { report: new UserReportView(item) };
  }

  // *  -------------------------- 매장 주인  ---------------------------- */
  // none
}
