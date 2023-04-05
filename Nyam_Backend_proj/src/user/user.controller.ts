import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import { Role, UserUpdateRequest, SearchWord } from './objects/user.object';
import { Roles } from 'src/common/decorators/roles.decrator';
import { Types } from 'mongoose';
import { OtherAdmin } from 'src/user/objects/admin.object';
import { LogsService } from 'src/logs/logs.service';
import { ActionLogAdd } from 'src/logs/logs.object';
import { OwnerUpdate } from './objects/owner.object';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { NickNameCheckDto } from 'src/user/objects/user.object';
import { ApiBody, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

/* *
 *  일시   : 2022년 12월 1일 목요일
 *  개발자 : 조성현
 *  체크 사항 :
 *  내용 : 유저 관련 API 리팩토링
 */
// *  -------------------------- 유저  ---------------------------- */
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logService: LogsService,
  ) {}
  // clear 유저 닉네임
  @ApiOperation({
    summary: '유저 백엔드/유저/닉네임 체크',
    description: '유저의 닉네임 생성가능 여부를 확인한다.',
  })
  @ApiBody({ type: NickNameCheckDto })
  @Post('/nickName')
  async NickNameCheck(@Body() body: NickNameCheckDto) {
    let nickName = body.nickName;
    const exists = await this.userService.userNickCheck(nickName);
    console.log(exists);
    if (exists) {
      const tmpuser = await this.userService.userFindByNickName(nickName);
      if (tmpuser.user_active == false) {
        console.log('탈퇴한 유저입니다');
        return { enable: true };
      }
      console.log('활동중인 유저입니다');
      return { enable: false };
    }
    return { enable: true };
  }
  @ApiOperation({
    summary: '유저 백엔드/캠퍼스/유저 마지막 캠퍼스수정',
    description: '유저의 캠퍼스아이디를 수정한다.',
  })
  @ApiSecurity('x-token')
  @ApiSecurity('x-type')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Put('/campus')
  async user_campus_update(@CurrentUser() user, @Body() body) {
    const { campus_id } = body;
    if (!campus_id) throw new BadRequestException('잘못된 요청입니다.'); // campus 검증 로직 필요
    const update_user = await this.userService.UserSaveLastLocation(
      user.id,
      campus_id,
    );
    return true;
  }


  @Get('search/recent')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  async user_search_get(@CurrentUser() user) {
    const result = await this.userService.userFindById(user.id);
    if (!result) throw new BadRequestException('잘못된 요청입니다.');
    return { search_result: result.user_search_keywords };
  }

  @Delete('search/recent')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  async deleteSearchKeyword(@CurrentUser() user, @Body() body) {
    const { search } = body;
    if (!search) throw new BadRequestException('잘못된 요청입니다.'); // campus 검증 로직 필요
    const userResult = await this.userService.deleteSearchKeyword(
      user.id,
      new SearchWord(search),
    );
    return userResult;
  }
  @Delete('search/recentAll')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  async deleteSearchKeywordAll(@CurrentUser() user) {
    const userResult = await this.userService.deleteAllSearchKeyword(user.id);
    return userResult;
  }


  // 탈퇴 : remove log :성현 
  @ApiOperation({
    summary: '유저 백엔드/캠퍼스/유저 마지막 캠퍼스수정',
    description: '유저의 캠퍼스아이디를 수정한다.',
  })
  @ApiSecurity('x-token')
  @ApiSecurity('x-type')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Delete('/user/remove')
  async user_remove(@CurrentUser() user) {
    const data = await this.userService.userRemove(user);
    const update_user = await this.userService.userUpdate(data, user.id);
    // const log_user = {
    //   user_type: 'user',
    //   uid: update_user.id,
    //   name: update_user.user_nickname,
    //   user_gender: update_user.user_gender,
    //   user_birth: update_user.user_birth,
    // };
    // this.logService.action_log_add(
    //   new ActionLogAdd(
    //     log_user,
    //     null,
    //     null,
    //     update_user.id,
    //     'user',
    //     'Delete',
    //     null,
    //     `${log_user.name} 님이 자신의 회원정보를 탈퇴하셨습니다. `,
    //   ),
    // );

    return true;
  }
...
}
