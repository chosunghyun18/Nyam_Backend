import { Module, forwardRef } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRequest, UserRequestSchema } from './models/user.request.model';
import { OwnerRequest, OwnerRequestSchema } from './models/owner.request.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserRequest.name, schema: UserRequestSchema },
      { name: OwnerRequest.name, schema: OwnerRequestSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
