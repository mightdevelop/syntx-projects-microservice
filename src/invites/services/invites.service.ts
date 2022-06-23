import { ConflictException, Inject, Injectable } from '@nestjs/common'
import 'dotenv/config'
import { Invite } from 'src/invites/entities/invite.entity'
import { Repository } from 'typeorm'
import {
    InviteByIdRequest,
    InvitesByUserIdRequest,
    InvitesByProjectIdRequest,
    CreateInviteRequest,
    DeleteInviteRequest,
} from '../../projects.pb'


@Injectable()
export class InvitesService {

    constructor(
        @Inject('INVITE_REPO') private readonly inviteRepo: Repository<Invite>,
        @Inject('PROJECT_USER_REPO') private readonly projectUserRepo: Repository<Invite>,
    ) {}

    public async getInviteById({ inviteId }: InviteByIdRequest): Promise<Invite> {
        return this.inviteRepo.findOneBy({ id: inviteId })
    }

    public async getInvitesByUserId({ userId }: InvitesByUserIdRequest): Promise<Invite[]> {
        return this.inviteRepo.findBy({ userId })
    }

    public async getInvitesByProjectId({ projectId }: InvitesByProjectIdRequest): Promise<Invite[]> {
        return this.inviteRepo.findBy({ projectId })
    }

    public async createInvite(dto: CreateInviteRequest): Promise<Invite> {
        const isUserProjectParticipant = !!await this.projectUserRepo.findOneBy({
            projectId: dto.projectId,
            userId: dto.userId,
        })
        if (isUserProjectParticipant)
            throw new ConflictException({ message: 'User is already a project participant' })

        const invite = new Invite()
        invite.projectId = dto.projectId
        invite.userId = dto.userId
        await this.inviteRepo.save(invite)

        return invite
    }

    public async deleteInvite({ inviteId }: DeleteInviteRequest): Promise<Invite> {
        const invite: Invite = await this.inviteRepo.findOneBy({ id: inviteId })
        await this.inviteRepo.delete(invite)
        return invite
    }

}
