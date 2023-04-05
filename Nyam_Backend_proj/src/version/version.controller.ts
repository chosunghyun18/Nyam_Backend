import {
  Controller,
  Post,
  BadRequestException,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { VersionService } from './version.service';
import { VersionInfo } from './version.object';
import { modelNames, Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

/* *
 *  일시   : 2022년 10월 28일 금요일
 *  개발자 : 조성현
 *  체크 사항 :
 *  내용 : version check api
 */
@ApiTags('Version')
@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  // clear 버전 생성 - 관리자
  @Post('/')
  async addVersion(@Body() body) {
    let data;
    try {
      data = new VersionInfo(body);
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 입니다.');
    }
    const version = await this.versionService.addVersion(data);
    return version;
  }
  @Get('/:version_name')
  async checkVersion(@Param('version_name') version_name: string) {
    const result = await this.versionService.checkVersion(version_name);
    return { check_result: result };
  }
  @Put('/')
  async updateVersion(@Body() body) {
    const { version_id, version_name } = body;
    try {
      const version = await this.versionService.updateVersion(
        version_id,
        version_name,
      );
      return version;
    } catch (e) {
      throw new BadRequestException('잘못된 데이터 입니다.');
    }
  }
}
