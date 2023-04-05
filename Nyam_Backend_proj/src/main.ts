import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('server.port');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'client'), {
    prefix: '/api/v1/client',
  });
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1');

  const swagger_options = new DocumentBuilder()
    .setTitle('Nyam-Docs')
    .setDescription('API description')
    .setVersion('1.1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-token',
        in: 'header',
        description: 'Enter token',
      },
      'x-token',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-type',
        in: 'header',
        description: 'Enter type',
      },
      'x-type',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swagger_options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, '0.0.0.0');
  console.log('Application Listening on Port : ', port);
}
bootstrap();
