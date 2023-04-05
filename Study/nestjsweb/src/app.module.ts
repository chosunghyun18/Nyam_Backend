import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env.test', 
      ignoreEnvFile: process.env.NODE_ENV === 'prod', 
      // validationSchema: Joi.object({ 
      //   NODE_ENV: Joi.string().valid('dev', 'prod').required(), 
      //   DB_HOST: Joi.string().required(), 
      //   DB_PORT: Joi.string().required(), 
      //   DB_USERNAME: Joi.string().required(), 
      //   DB_PASSWORD: Joi.string().required(), 
      //   DB_NAME: Joi.string().required(), 
      // }),
      // 비어있는 값을 막기 위한 모듈로 나중에 수정 예정
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', 
      host: process.env.DB_HOST, 
      port: +process.env.DB_PORT, 
      username: process.env.DB_USERNAME, 
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME, 
      synchronize: true, 
      logging: true, 
      entities: [],
    }),
    
  ],
})

export class AppModule {}
