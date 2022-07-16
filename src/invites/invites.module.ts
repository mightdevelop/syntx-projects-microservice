import { Module } from '@nestjs/common'
import { InvitesController } from './invites.controller'
import 'dotenv/config'
import { Invite } from './entities/invite.entity'
import { InvitesService } from './services/invites.service'
import { ProjectUser } from 'src/entities/project-user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProjectUser,
            Invite,
        ])
    ],
    exports: [ InvitesService ],
    controllers: [ InvitesController ],
    providers: [
        InvitesService,
    ],
})
export class InvitesModule {}
