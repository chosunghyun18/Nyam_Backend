import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Test-Connection')
@ApiSecurity('Authorisation')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiSecurity('x-token')
  @ApiSecurity('x-type')
  getHello(): string {
    return this.appService.getHello();
  }
}
