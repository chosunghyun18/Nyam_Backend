import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/common/decorators/roles.decrator';
import { Role, UserExit } from 'src/user/objects/user.object';
import { CurrentUser } from 'src/common/decorators/user.decrator';
import { AdminSignUpRequest, MyAdmin } from '../user/objects/admin.object';
import { UserSignUpRequest } from '../user/objects/user.object';
import { CampusService } from 'src/campus/campus.service';
import { LogsService } from 'src/logs/logs.service';
import { AuthLogAdd } from 'src/logs/logs.object';
import { MyOwner, OwnerSignUpRequest } from '../user/objects/owner.object';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
/* *
 *  일시   : 2022년 11월 02일
 *  개발자 : 조성현
 *  체크 사항 :
 *  내용 : 유저 로그인 리펙
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logService: LogsService,
  ) {}
  // *  -------------------------- 유저  ---------------------------- */
  // clear 유저 로그인
  @Post('/user/signIn')
  async UserSignIn(@Body() body) {
    let data;
    const { device_token } = body;
    if (!device_token) throw new BadRequestException('데이터 부족합니다.');

    try {
      data = new UserExit(body);
    } catch (e) {
      throw new BadRequestException('데이터 부족합니다.');
    }
    const user = await this.userService.userFind(data);
    if (!user) {
      throw new NotFoundException('유저 없음');
    }
    if (user.user_block) throw new UnauthorizedException('차단된 유저입니다.');
    const api_key = await this.authService.createToken();
    await this.userService.userSaveToken(user.id, api_key);
    const update_user = await this.userService.userSaveDeviceToken(
      user.id,
      device_token,
    );

    const log_user = {
      name: update_user.user_nickname,
      uid: update_user.id,
      user_type: 'user',
      user_gender: update_user.user_gender,
      user_birth: update_user.user_birth,
    };
    await this.logService.auth_log_add(
      new AuthLogAdd(
        log_user,
        null,
        null,
        `${user.user_nickname}님이 로그인했습니다.`,
      ),
    );
    const result = await this.userService.my_user_data(update_user);
    return { user: result };
  }
  
  // User   Token Login refact : remove user_last_login: 성현
  @Post('/user/token-signin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  async TokenLogin(@Body() body, @CurrentUser() user) {
    const { device_token } = body;
    if (!device_token) throw new BadRequestException('데이터 부족합니다.');
    const api_key = await this.authService.createToken();
    await this.userService.userSaveLastTime(user.id);
    await this.userService.userSaveToken(user.id, api_key);
    const update_user = await this.userService.userSaveDeviceToken(
      user.id,
      device_token,
    );
    const log_user = {
      name: user.user_nickname,
      uid: user.id,
      user_type: 'user',
      user_gender: user.user_gender,
      user_birth: user.user_birth,
    };
    await this.logService.auth_log_add(
      new AuthLogAdd(
        log_user,
        null,
        null,
        `${user.user_nickname}님이 토큰 로그인했습니다.`,
      ),
    );
    const result = await this.userService.my_user_data(update_user);
    console.log('----update_user----');
    console.log(result);
    return { user: result };
  }
  ...
}
