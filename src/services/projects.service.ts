import { Inject, Injectable } from '@nestjs/common'
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
} from '../pb/projects.pb'
import { ProjectUserService } from './project-user.service'
import { Error, EVENTBUS_PACKAGE_NAME } from 'src/pb/common.pb'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import { ProjectsEventsServiceClient, PROJECTS_EVENTS_SERVICE_NAME } from 'src/pb/projects-events.pb'
import { Status } from '@grpc/grpc-js/build/src/constants'


@Injectable()
export class ProjectsService {

    private projectsEventsService: ProjectsEventsServiceClient

    @Inject(EVENTBUS_PACKAGE_NAME)
    private readonly client: ClientGrpc

    onModuleInit(): void {
        this.projectsEventsService = this.client.getService<ProjectsEventsServiceClient>(PROJECTS_EVENTS_SERVICE_NAME)
    }

    constructor(
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        @InjectRepository(ProjectUser) private readonly projectUserRepo: Repository<ProjectUser>,
        private readonly projectUserService: ProjectUserService,
    ) {}

    public async getProjectById({ projectId }: ProjectId): Promise<Project> {
        const project: Project = await this.projectRepo
            .findOneBy({ id: projectId })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.getProjectByIdEvent({ error, project: { id: project.id } })
                throw new RpcException(error)
            })
        if (!project) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Project not found',
            }
            this.projectsEventsService.getProjectByIdEvent({ error, project: { id: project.id } })
            throw new RpcException(error)
        }
        this.projectsEventsService.getProjectByIdEvent({ project })
        return project
    }

    public async searchProjects(searchParams: SearchProjectsParams): Promise<Project[]> {
        const projectsIds: string[] = searchParams.projectsIds
        if (searchParams.usersIds) {
            projectsIds.push(
                ...(
                    await this.projectUserService
                        .getMutualProjectsIdsByUsersIds(searchParams.usersIds)
                        .catch(err => {
                            const error: Error = {
                                code: Status.UNAVAILABLE,
                                message: err,
                            }
                            this.projectsEventsService.searchProjectsEvent({
                                error,
                                projects: projectsIds.map(id => ({ id })),
                                searchParams
                            })
                            throw new RpcException(error)
                        })
                )
            )
        }
        const projects: Project[] = await this.projectRepo
            .find({
                where: {
                    id: In(projectsIds),
                    leadId: searchParams.leadId,
                    name: searchParams.projectName,
                },
                take: searchParams.limit,
                skip: searchParams.offset,
            })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.searchProjectsEvent({
                    error,
                    projects: projectsIds.map(id => ({ id })),
                    searchParams
                })
                throw new RpcException(error)
            })
        this.projectsEventsService.searchProjectsEvent({ projects, searchParams })
        return projects
    }

    public async createProject(dto: CreateProjectRequest): Promise<Project> {
        const project = new Project()
        project.name = dto.name
        project.leadId = dto.leadId
        await this.projectRepo
            .save(project)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.createProjectEvent({ error, project })
                throw new RpcException(error)
            })
        this.projectsEventsService.createProjectEvent({ project })
        await this.projectUserService.addUserToProject({ projectId: project.id, userId: project.leadId })
        return project
    }

    public async updateProject(dto: UpdateProjectRequest): Promise<Project> {
        const project = await this.projectRepo
            .findOneBy({ id: dto.projectId })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.updateProjectEvent({ error, project: { id: dto.projectId } })
                throw new RpcException(error)
            })
        if (!project) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Project not found',
            }
            this.projectsEventsService.updateProjectEvent({ error, project: { id: dto.projectId } })
            throw new RpcException(error)
        }
        project.name = dto.name || project.name
        project.leadId = dto.leadId || project.leadId
        await this.projectRepo
            .save(project)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.updateProjectEvent({ error, project })
                throw new RpcException(error)
            })
        this.projectsEventsService.updateProjectEvent({ project })
        return project
    }

    public async deleteProject({ projectId }: ProjectId): Promise<Project> {
        const project: Project = await this.projectRepo
            .findOneBy({ id: projectId })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.deleteProjectEvent({ error, project: { id: projectId } })
                throw new RpcException(error)
            })
        if (!project) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'Project not found',
            }
            this.projectsEventsService.deleteProjectEvent({ error, project: { id: projectId } })
            throw new RpcException(error)
        }
        await this.projectRepo
            .delete(project)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.projectsEventsService.deleteProjectEvent({ error, project: { id: projectId } })
                throw new RpcException(error)
            })
        this.projectsEventsService.deleteProjectEvent({ project })
        return project
    }

}
