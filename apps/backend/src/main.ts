import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Simple Storage dApp API')
    .setDescription('Azka Radhitya Pratama - 241011400210')
    .setVersion('1.0')
    .addTag('simple-storage')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, documentFactory);

  const port = process.env.PORT || 3000;
app.listen(port);
}

bootstrap().catch(error => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});