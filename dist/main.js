import { DocumentBuilder, SwaggerModule, } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { corsOptions } from './config/cors.js';
import { helmetHandlers } from './security/http/helmet.handler.js';
import { nodeConfig } from './config/node.js';
import { paths } from './config/paths.js';
const { httpsOptions, port } = nodeConfig;
const setupSwagger = (app) => {
    const config = new DocumentBuilder()
        .setTitle('Auto')
        .setDescription('Beispiel für Software Engineering')
        .setVersion('2024.04.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    const options = {
        customSiteTitle: 'SWE 23/24',
    };
    SwaggerModule.setup(paths.swagger, app, document, options);
};
const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, { httpsOptions });
    app.use(helmetHandlers, compression());
    app.useGlobalPipes(new ValidationPipe());
    setupSwagger(app);
    app.enableCors(corsOptions);
    await app.listen(port);
};
await bootstrap();
//# sourceMappingURL=main.js.map