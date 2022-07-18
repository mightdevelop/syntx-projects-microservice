import { Injectable } from '@nestjs/common'
import 'dotenv/config'
import { ProjectUser } from 'src/entities/project-user.entity'
import { Project } from 'src/entities/project.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
    ProjectByIdRequest,
    ProjectsByUserIdRequest,
    CreateProjectRequest,
    DeleteProjectRequest,
    UpdateProjectRequest,
    ProjectsByLeadIdRequest,
    UsersIds,
} from '../projects.pb'
import { ProjectUserService } from './project-user.service'


@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        @InjectRepository(ProjectUser) private readonly projectUserRepo: Repository<ProjectUser>,
        private readonly projectUserService: ProjectUserService,
    ) {}

    public async getProjectById({ projectId }: ProjectByIdRequest): Promise<Project> {
        return this.projectRepo.findOneBy({ id: projectId })
    }

    public async getProjectsByUserId({ userId }: ProjectsByUserIdRequest): Promise<Project[]> {
        const projectUserRows: ProjectUser[] = await this.projectUserRepo.findBy({ userId })
        if (projectUserRows.length === 0) return []
        return this.projectRepo.find({ where: projectUserRows.map(raw => ({ id: raw.projectId })) })
    }

    public async getProjectsByLeadId({ leadId }: ProjectsByLeadIdRequest): Promise<Project[]> {
        return this.projectRepo.findBy({ leadId }) || []
    }

    public async getMutualProjectsByUsersIds({ usersIds }: UsersIds): Promise<Project[]> {
        const projectsIds: string[] = await this.projectUserService.getMutualProjectsIdsByUsersIds(usersIds)
        return this.projectRepo.find({ where: projectsIds.map(id => ({ id })) }) || []
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
        project.name = dto.name || project.name
        project.leadId = dto.leadId || project.leadId
        await this.projectRepo.save(project)
        return project
    }

    public async deleteProject({ projectId }: DeleteProjectRequest): Promise<Project> {
        const project: Project = await this.projectRepo.findOneBy({ id: projectId })
        await this.projectRepo.delete(project)
        return project
    }

}
