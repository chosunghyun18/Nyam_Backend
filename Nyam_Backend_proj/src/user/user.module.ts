import { forwardRef, Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { Owner, OwnerSchema } from './models/owner.model';
import { Admin, AdminSchema } from './models/admin.model';
import { ReviewModule } from 'src/review/review.module';
import { LabModule } from 'src/lab/lab.module';
import { RequestModule } from 'src/request/request.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { StoreModule } from 'src/store/store.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Owner.name, schema: OwnerSchema },
    ]),
    forwardRef(() => StoreModule),
    forwardRef(() => LabModule),
    forwardRef(() => BookmarkModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => RequestModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
