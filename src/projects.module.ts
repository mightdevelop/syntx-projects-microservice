import { Module } from '@nestjs/common'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './services/projects.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Project } from './entities/project.entity'
import { ProjectUser } from './entities/project-user.entity'
import { DataSource } from 'typeorm'
import 'dotenv/config'
import { InvitesModule } from './invites/invites.module'
import { ProjectUserService } from './services/project-user.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [ `@${process.env.NODE_ENV}.env`, '@.env' ],
            isGlobal: true,
        }),
        InvitesModule,
    ],
    controllers: [ ProjectsController ],
    providers: [
        ProjectsService,
        ProjectUserService,
        {
            inject: [ ConfigService ],
            provide: 'DATA_SOURCE',
            useFactory: async (config: ConfigService) => new DataSource({
                type: 'postgres',
                host: config.get('POSTGRES_HOST'),
                port: +config.get('POSTGRES_PORT'),
                username: config.get('POSTGRES_USERNAME'),
                password: config.get('POSTGRES_PASSWORD'),
                database: config.get('POSTGRES_DATABASE_NAME'),
                entities: [
                    Project,
                    ProjectUser,
                ],
                synchronize: true,
            }).initialize()
        },
        {
            provide: 'PROJECT_REPO',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
            inject: [ 'DATA_SOURCE' ]
        },
        {
            provide: 'PROJECT_USER_REPO',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(ProjectUser),
            inject: [ 'DATA_SOURCE' ]
        },
    ],
})
export class ProjectsModule {}
