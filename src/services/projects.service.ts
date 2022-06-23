import { Inject, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import 'dotenv/config'
import { ProjectUser } from 'src/entities/project-user.entity'
import { Project } from 'src/entities/project.entity'
import { InvitesService } from 'src/invites/services/invites.service'
import { Repository } from 'typeorm'
import {
    ProjectByIdRequest,
    ProjectsByUserIdRequest,
    CreateProjectRequest,
    DeleteProjectRequest,
    UpdateProjectRequest,
    ProjectsByLeadIdRequest,
    ProjectUserRequest,
} from '../projects.pb'


@Injectable()
export class ProjectsService {

    constructor(
        @Inject('PROJECT_REPO') private readonly projectRepo: Repository<Project>,
        @Inject('PROJECT_USER_REPO') private readonly projectUserRepo: Repository<ProjectUser>,
        private invitesService: InvitesService,
    ) {}

    public async getProjectById({ projectId }: ProjectByIdRequest): Promise<Project> {
        return this.projectRepo.findOneBy({ id: projectId })
    }

    public async getProjectsByUserId({ userId }: ProjectsByUserIdRequest): Promise<Project[]> {
        const projectUserRows: ProjectUser[] = await this.projectUserRepo.findBy({ userId })
        if (projectUserRows.length === 0) return []
        return this.projectRepo.find({ where: projectUserRows.map(row => ({ id: row.projectId })) })
    }

    public async getProjectsByLeadId({ leadId }: ProjectsByLeadIdRequest): Promise<Project[]> {
        return this.projectRepo.findBy({ leadId }) || []
    }

    public async createProject(dto: CreateProjectRequest): Promise<Project> {
        const project = new Project()
        project.name = dto.name
        project.leadId = dto.leadId
        await this.projectRepo.save(project)

        const projectUserRow = new ProjectUser()
        projectUserRow.projectId = project.id
        projectUserRow.userId = project.leadId
        await this.projectUserRepo.save(projectUserRow)

        return project
    }

    public async updateProject(dto: UpdateProjectRequest): Promise<Project> {
        const project = await this.projectRepo.findOneBy({ id: dto.projectId })
        project.name = dto.name
        project.leadId = dto.leadId
        await this.projectRepo.save(project)
        return project
    }

    public async deleteProject({ projectId }: DeleteProjectRequest): Promise<Project> {
        const project: Project = await this.projectRepo.findOneBy({ id: projectId })
        await this.projectRepo.delete(project)
        return project
    }

    public async addUserToProject(dto: ProjectUserRequest): Promise<ProjectUser> {
        await this.invitesService.deleteInviteByUserIdAndProjectId(dto)

        const projectUserRow: ProjectUser = new ProjectUser()
        projectUserRow.projectId = dto.projectId
        projectUserRow.userId = dto.userId
        await this.projectUserRepo.save(projectUserRow)

        return projectUserRow
    }

    public async removeUserFromProject(dto: ProjectUserRequest): Promise<ProjectUser> {
        const projectUserRow: ProjectUser = await this.projectUserRepo.findOneBy(dto)
        if (!projectUserRow)
            throw new RpcException({ message: 'User is not a project participant' })

        await this.projectUserRepo.delete(projectUserRow)
        return projectUserRow
    }

}
