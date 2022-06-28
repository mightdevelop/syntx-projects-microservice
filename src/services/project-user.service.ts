import { Inject, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import 'dotenv/config'
import { ProjectUser } from 'src/entities/project-user.entity'
import { InvitesService } from 'src/invites/services/invites.service'
import { Repository } from 'typeorm'
import { Bool, ProjectIdAndUserId } from '../projects.pb'


@Injectable()
export class ProjectUserService {

    constructor(
        @Inject('PROJECT_USER_REPO') private readonly projectUserRepo: Repository<ProjectUser>,
        private invitesService: InvitesService,
    ) {}

    public async getMutualProjectsIdsByUsersIds(usersIds: string[]): Promise<string[]> {
        return (await this.projectUserRepo.find({
            where: usersIds.map(userId => ({ userId }))
        })).map(row => row.projectId) || []
    }

    public async isUserProjectParticipant(dto: ProjectIdAndUserId): Promise<Bool> {
        return { bool: !!(await this.projectUserRepo.find({ where: dto })).length }
    }

    public async addUserToProject(dto: ProjectIdAndUserId): Promise<ProjectUser> {
        await this.invitesService.deleteInviteByUserIdAndProjectId(dto)

        const projectUserRow: ProjectUser = new ProjectUser()
        projectUserRow.projectId = dto.projectId
        projectUserRow.userId = dto.userId
        await this.projectUserRepo.save(projectUserRow)

        return projectUserRow
    }

    public async removeUserFromProject(dto: ProjectIdAndUserId): Promise<ProjectUser> {
        const projectUserRow: ProjectUser = await this.projectUserRepo.findOne({ where: dto })
        if (!projectUserRow)
            throw new RpcException({ message: 'User is not a project participant' })

        await this.projectUserRepo.delete(projectUserRow)
        return projectUserRow
    }

}
