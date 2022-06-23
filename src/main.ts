import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { join } from 'path'
import { ProjectsModule } from './projects.module'
import { PROJECTS_PACKAGE_NAME } from './projects.pb'

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        ProjectsModule,
        {
            transport: Transport.GRPC,
            options: {
                url: process.env.APP_URL,
                package: PROJECTS_PACKAGE_NAME,
                protoPath: join(__dirname, '..', 'node_modules', 'syntx-protos', 'projects', 'projects.proto'),
            }
        },
    )
    await app.listen()
    console.log('Projects service started at ' + process.env.APP_URL)
}
bootstrap()