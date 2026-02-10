import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "warn", "error"],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Trading Backend API")
    .setDescription("API documentation for the trading backend services.")
    .setVersion(process.env.npm_package_version ?? "0.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document, {
    jsonDocumentUrl: "api-json",
  });

  const port = Number(process.env.PORT ?? 8000);
  await app.listen(port);
}
bootstrap();
