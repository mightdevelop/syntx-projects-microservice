import { Module } from '@nestjs/common'
import { InvitesController } from './invites.controller'
import { DataSource } from 'typeorm'
import 'dotenv/config'
import { Invite } from './entities/invite.entity'
import { InvitesService } from './services/invites.service'
import { ConfigService } from '@nestjs/config'

@Module({
    controllers: [ InvitesController ],
    providers: [
        InvitesService,
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
                    Invite,
                ],
                synchronize: true,
            }).initialize()
        },
        {
            provide: 'INVITE_REPO',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(Invite),
            inject: [ 'DATA_SOURCE' ]
        },
    ],
})
export class InvitesModule {}
