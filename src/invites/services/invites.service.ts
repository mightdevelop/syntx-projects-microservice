import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import 'dotenv/config'
import { ProjectUser } from 'src/entities/project-user.entity'
import { Invite } from 'src/invites/entities/invite.entity'
import { Repository } from 'typeorm'
import {
    InviteByIdRequest,
    InvitesByUserIdRequest,
    InvitesByProjectIdRequest,
    CreateInviteRequest,
    DeleteInviteByIdRequest,
    DeleteInviteByUserIdAndProjectIdRequest,
} from '../../projects.pb'


@Injectable()
export class InvitesService {

    constructor(
        @Inject('INVITE_REPO') private readonly inviteRepo: Repository<Invite>,
        @Inject('PROJECT_USER_REPO') private readonly projectUserRepo: Repository<ProjectUser>,
    ) {}

    public async getInviteById(
        { inviteId }: InviteByIdRequest
    ): Promise<Invite> {
        return this.inviteRepo.findOneBy({ id: inviteId })
    }

    public async getInvitesByUserId(
        { userId }: InvitesByUserIdRequest
    ): Promise<Invite[]> {
        return this.inviteRepo.findBy({ userId })
    }

    public async getInvitesByProjectId(
        { projectId }: InvitesByProjectIdRequest
    ): Promise<Invite[]> {
        return this.inviteRepo.findBy({ projectId })
    }

    public async createInvite(
        dto: CreateInviteRequest
    ): Promise<Invite> {
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

    public async deleteInviteById(
        { inviteId }: DeleteInviteByIdRequest
    ): Promise<Invite> {
        const invite: Invite = await this.inviteRepo.findOneBy({ id: inviteId })
        if (!invite)
            throw new RpcException({ message: 'Invite not found' })
        await this.inviteRepo.delete(invite)
        return invite
    }

    public async deleteInviteByUserIdAndProjectId(
        dto: DeleteInviteByUserIdAndProjectIdRequest
    ): Promise<Invite> {
        const invite: Invite = await this.inviteRepo.findOneBy(dto)
        if (!invite)
            throw new RpcException({ message: 'Invite not found' })
        await this.inviteRepo.delete(invite)
        return invite
    }

}
