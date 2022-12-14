import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import 'dotenv/config'
import { ProjectUser } from 'src/entities/project-user.entity'
import { Invite } from 'src/invites/entities/invite.entity'
import { In, Repository } from 'typeorm'
import {
    SearchInvitesParams,
    InviteId,
    ProjectIdAndUserId,
    DeleteInviteRequest,
} from '../../pb/projects.pb'
import { Status } from '@grpc/grpc-js/build/src/constants'
import { Error } from 'src/pb/common.pb'
import { EVENTBUS_PACKAGE_NAME, InvitesEventsServiceClient, INVITES_EVENTS_SERVICE_NAME } from 'src/pb/projects-events.pb'


@Injectable()
export class InvitesService {

    private invitesEventsService: InvitesEventsServiceClient

    @Inject(EVENTBUS_PACKAGE_NAME)
    private readonly client: ClientGrpc

    onModuleInit(): void {
        this.invitesEventsService = this.client.getService<InvitesEventsServiceClient>(INVITES_EVENTS_SERVICE_NAME)
    }

    constructor(
        @InjectRepository(Invite) private readonly inviteRepo: Repository<Invite>,
        @InjectRepository(ProjectUser) private readonly projectUserRepo: Repository<ProjectUser>,
    ) {}

    public async getInviteById(
        { inviteId }: InviteId
    ): Promise<Invite> {
        const invite: Invite = await this.inviteRepo
            .findOneBy({ id: inviteId })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.invitesEventsService.getInviteByIdEvent({ error, invite: { id: invite.id } })
                throw new RpcException(error)
            })
        if (!invite) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Invite not found',
            }
            this.invitesEventsService.getInviteByIdEvent({ error, invite: { id: invite.id } })
            throw new RpcException(error)
        }
        this.invitesEventsService.getInviteByIdEvent({ invite })
        return invite
    }

    public async searchInvites(searchParams: SearchInvitesParams): Promise<Invite[]> {
        const invites: Invite[] = await this.inviteRepo
            .find({
                where: {
                    id: In(searchParams.invitesIds),
                    userId: searchParams.userId,
                    projectId: searchParams.projectId,
                },
                take: searchParams.limit,
                skip: searchParams.offset,
            })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.invitesEventsService.searchInvitesEvent({
                    error,
                    invites: searchParams.invitesIds.map(id => ({ id })),
                    searchParams
                })
                throw new RpcException(error)
            })
        this.invitesEventsService.searchInvitesEvent({ invites, searchParams })
        return invites
    }

    public async createInvite(
        dto: ProjectIdAndUserId
    ): Promise<Invite> {
        const isUserProjectParticipant = !!await this.projectUserRepo
            .findOneBy({
                projectId: dto.projectId,
                userId: dto.userId,
            })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.invitesEventsService.createInviteEvent({
                    error,
                    invite: { id: invite.id },
                })
                throw new RpcException(error)
            })
        if (isUserProjectParticipant)
            throw new ConflictException({ message: 'User is already a project participant' })

        const invite = new Invite()
        invite.projectId = dto.projectId
        invite.userId = dto.userId
        await this.inviteRepo
            .save(invite)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.invitesEventsService.createInviteEvent({
                    error,
                    invite: { id: invite.id },
                })
                throw new RpcException(error)
            })
        this.invitesEventsService.createInviteEvent({ invite })

        return invite
    }

    public async deleteInvite(
        { data }: DeleteInviteRequest
    ): Promise<Invite> {
        let invite: Invite
        if (data.$case === 'inviteId') {
            invite = await this.inviteRepo
                .findOneBy({ id: data.inviteId })
                .catch(err => {
                    const error: Error = {
                        code: Status.UNAVAILABLE,
                        message: err,
                    }
                    this.invitesEventsService.deleteInviteEvent({
                        error,
                        invite: { id: invite.id },
                    })
                    throw new RpcException(error)
                })
        }
        else {
            invite = await this.inviteRepo
                .findOneBy(data.projectIdAndUserId)
                .catch(err => {
                    const error: Error = {
                        code: Status.UNAVAILABLE,
                        message: err,
                    }
                    this.invitesEventsService.deleteInviteEvent({
                        error,
                        invite: { id: invite.id },
                    })
                    throw new RpcException(error)
                })
        }
        if (!invite) {
            throw new RpcException({ code: Status.NOT_FOUND, message: 'Invite not found' })
        }
        await this.inviteRepo
            .delete(invite)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.invitesEventsService.deleteInviteEvent({
                    error,
                    invite: { id: invite.id },
                })
                throw new RpcException(error)
            })
        return invite
    }

}
