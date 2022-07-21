import { Injectable } from '@nestjs/common'
import 'dotenv/config'
import { ProjectUser } from 'src/entities/project-user.entity'
import { Project } from 'src/entities/project.entity'
import { In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
    CreateProjectRequest,
    ProjectId,
    SearchProjectsParams,
    UpdateProjectRequest,
} from '../projects.pb'
import { ProjectUserService } from './project-user.service'


@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        @InjectRepository(ProjectUser) private readonly projectUserRepo: Repository<ProjectUser>,
        private readonly projectUserService: ProjectUserService,
    ) {}

    public async getProjectById({ projectId }: ProjectId): Promise<Project> {
        return this.projectRepo.findOneBy({ id: projectId })
    }

    public async searchProjects(searchParams: SearchProjectsParams): Promise<Project[]> {
        const projectsIds: string[] = searchParams.projectsIds
        if (searchParams.usersIds) {
            projectsIds.push(
                ...(await this.projectUserService.getMutualProjectsIdsByUsersIds(searchParams.usersIds))
            )
        }
        return this.projectRepo.find({
            where: {
                id: In(projectsIds),
                leadId: searchParams.leadId,
                name: searchParams.projectName,
            },
            take: searchParams.limit,
            skip: searchParams.offset,
        })
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

    public async deleteProject({ projectId }: ProjectId): Promise<Project> {
        const project: Project = await this.projectRepo.findOneBy({ id: projectId })
        await this.projectRepo.delete(project)
        return project
    }

}
