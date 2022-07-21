import { ConflictException, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import 'dotenv/config'
import { ProjectUser } from 'src/entities/project-user.entity'
import { Invite } from 'src/invites/entities/invite.entity'
import { In, Repository } from 'typeorm'
import {
    SearchInvitesParams,
    InviteId,
    ProjectIdAndUserId,
} from '../../projects.pb'
import { Status } from '@grpc/grpc-js/build/src/constants'


@Injectable()
export class InvitesService {

    constructor(
        @InjectRepository(Invite) private readonly inviteRepo: Repository<Invite>,
        @InjectRepository(ProjectUser) private readonly projectUserRepo: Repository<ProjectUser>,
    ) {}

    public async getInviteById(
        { inviteId }: InviteId
    ): Promise<Invite> {
        return this.inviteRepo.findOneBy({ id: inviteId })
    }

    public async searchInvites(searchParams: SearchInvitesParams): Promise<Invite[]> {
        return this.inviteRepo.find({
            where: {
                id: In(searchParams.invitesIds),
                userId: searchParams.userId,
                projectId: searchParams.projectId,
            },
            take: searchParams.limit,
            skip: searchParams.offset,
        })
    }

    public async createInvite(
        dto: ProjectIdAndUserId
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
        { inviteId }: InviteId
    ): Promise<Invite> {
        const invite: Invite = await this.inviteRepo.findOneBy({ id: inviteId })
        if (!invite)
            throw new RpcException({ code: Status.NOT_FOUND, message: 'Invite not found' })
        await this.inviteRepo.delete(invite)
        return invite
    }

    public async deleteInviteByUserIdAndProjectId(
        dto: ProjectIdAndUserId
    ): Promise<Invite> {
        const invite: Invite = await this.inviteRepo.findOneBy(dto)
        if (!invite)
            throw new RpcException({ code: Status.NOT_FOUND, message: 'Invite not found' })
        await this.inviteRepo.delete(invite)
        return invite
    }

}
