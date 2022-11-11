import { Status } from '@grpc/grpc-js/build/src/constants'
import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import 'dotenv/config'
import { ProjectUser } from 'src/entities/project-user.entity'
import { InvitesService } from 'src/invites/services/invites.service'
import { Error } from 'src/pb/common.pb'
import { EVENTBUS_PACKAGE_NAME, ProjectsEventsServiceClient, PROJECTS_EVENTS_SERVICE_NAME } from 'src/pb/projects-events.pb'
import { Repository } from 'typeorm'
import { Bool, ProjectIdAndUserId } from '../pb/projects.pb'


@Injectable()
export class ProjectUserService {

    private projectsEventsService: ProjectsEventsServiceClient

    @Inject(EVENTBUS_PACKAGE_NAME)
    private readonly client: ClientGrpc

    onModuleInit(): void {
        this.projectsEventsService = this.client.getService<ProjectsEventsServiceClient>(PROJECTS_EVENTS_SERVICE_NAME)
    }

    constructor(
        @InjectRepository(ProjectUser)  private readonly projectUserRepo: Repository<ProjectUser>,
        private invitesService: InvitesService,
    ) {}

    public async getMutualProjectsIdsByUsersIds(usersIds: string[]): Promise<string[]> {
        return (await this.projectUserRepo.find({
            where: usersIds.map(userId => ({ userId }))
        })).map(raw => raw.projectId) || []
    }

    public async isUserProjectParticipant(dto: ProjectIdAndUserId): Promise<Bool> {
        return { bool: !!(await this.projectUserRepo.find({ where: dto })).length }
    }

    public async addUserToProject(dto: ProjectIdAndUserId): Promise<ProjectUser> {
        await this.invitesService.deleteInviteByUserIdAndProjectId(dto)

        const projectUser: ProjectUser = new ProjectUser()
        projectUser.projectId = dto.projectId
        projectUser.userId = dto.userId
        await this.projectUserRepo
            .save(projectUser)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.addUserToProject({ error, ...projectUser })
                throw new RpcException(error)
            })
        this.projectsEventsService.addUserToProject(projectUser)

        return projectUser
    }

    public async removeUserFromProject(dto: ProjectIdAndUserId): Promise<ProjectUser> {
        const projectUser: ProjectUser = await this.projectUserRepo.findOne({ where: dto })

        if (!projectUser) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Project not found',
            }
            this.projectsEventsService.removeUserFromProject({ error, ...projectUser })
            throw new RpcException(error)
        }
        await this.projectUserRepo
            .delete(projectUser)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.removeUserFromProject({ error, ...projectUser })
                throw new RpcException(error)
            })
        this.projectsEventsService.removeUserFromProject(projectUser)
        return projectUser
    }

}
