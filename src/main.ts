import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import detect from 'detect-port';
import { AllExceptionsFilter } from './config/exceptions.js';
import { ResponseFormatInterceptor } from './config/interceptor.response.js';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const defaultPort = 3000;
  let port = defaultPort;
  try {
    port = await detect(defaultPort);

    if (port !== defaultPort) {
      logger.warn(
        `Porta ${defaultPort} já está ocupada. Usando porta ${port}.`
      );
    }

    const app = await NestFactory.create(AppModule);

    app.enableVersioning({
      type: VersioningType.HEADER,
      header: 'API-Version'
    });

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ResponseFormatInterceptor());

    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(port);
  } catch (err) {
    console.error('Error on starting server', err);
  }
}
(async () => {
  await bootstrap();
})();
