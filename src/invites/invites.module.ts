import { Module } from '@nestjs/common'
import { InvitesController } from './invites.controller'
import 'dotenv/config'
import { Invite } from './entities/invite.entity'
import { InvitesService } from './services/invites.service'
import { ProjectUser } from 'src/entities/project-user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'
import { EVENTBUS_PACKAGE_NAME } from 'src/pb/common.pb'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProjectUser,
            Invite,
        ]),
        ClientsModule.register([
            {
                name: EVENTBUS_PACKAGE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: '127.0.0.1:50057',
                    package: EVENTBUS_PACKAGE_NAME,
                    protoPath: join(
                        __dirname, '..', '..', 'node_modules', 'syntx-protos', 'eventbus', 'projects-events.proto'
                    ),
                }
            }
        ]),
    ],
    exports: [ InvitesService ],
    controllers: [ InvitesController ],
    providers: [
        InvitesService,
    ],
})
export class InvitesModule {}
