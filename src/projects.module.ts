import { Module } from '@nestjs/common'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './services/projects.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Project } from './entities/project.entity'
import { ProjectUser } from './entities/project-user.entity'
import 'dotenv/config'
import { InvitesModule } from './invites/invites.module'
import { ProjectUserService } from './services/project-user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Invite } from './invites/entities/invite.entity'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [ `@${process.env.NODE_ENV}.env`, '@.env' ],
            isGlobal: true,
        }),
        InvitesModule,
        TypeOrmModule.forRootAsync({
            inject: [ ConfigService ],
            useFactory: async (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('POSTGRES_HOST'),
                port: +config.get('POSTGRES_PORT'),
                username: config.get('POSTGRES_USERNAME'),
                password: config.get('POSTGRES_PASSWORD'),
                database: config.get('POSTGRES_DATABASE_NAME'),
                entities: [
                    Project,
                    ProjectUser,
                    Invite,
                ],
                synchronize: true,
            })
        }),
        TypeOrmModule.forFeature([
            Project,
            ProjectUser,
        ])
    ],
    controllers: [ ProjectsController ],
    providers: [
        ProjectsService,
        ProjectUserService,
    ],
})
export class ProjectsModule {}
