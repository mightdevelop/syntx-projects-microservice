import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
    PROJECTS_SERVICE_NAME,
    Project as ProtoProject,
    ProjectsServiceController,
    ProjectId,
    CreateProjectRequest,
    UpdateProjectRequest,
    ProjectIdAndUserId,
    Bool,
    SearchProjectsParams,
} from './projects.pb'
import { ProjectsService } from './services/projects.service'
import { concatMap, from, Observable } from 'rxjs'
import { ProjectUserService } from './services/project-user.service'

@Controller()
export class ProjectsController implements ProjectsServiceController {

    @Inject(ProjectsService)
    private readonly projectsService: ProjectsService

    @Inject(ProjectUserService)
    private readonly projectUserService: ProjectUserService

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'getProjectById')
    public getProjectById(dto: ProjectId): Observable<ProtoProject> {
        return from(this.projectsService.getProjectById(dto))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'searchProjects')
    public searchProjects(dto: SearchProjectsParams): Observable<ProtoProject> {
        return from(this.projectsService.searchProjects(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'isUserProjectParticipant')
    public isUserProjectParticipant(dto: ProjectIdAndUserId): Observable<Bool> {
        return from(this.projectUserService.isUserProjectParticipant(dto))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'createProject')
    public createProject(dto: CreateProjectRequest): Observable<ProtoProject> {
        return from(this.projectsService.createProject(dto))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'updateProject')
    public updateProject(dto: UpdateProjectRequest): Observable<ProtoProject> {
        return from(this.projectsService.updateProject(dto))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'deleteProject')
    public deleteProject(dto: ProjectId): Observable<ProtoProject> {
        return from(this.projectsService.deleteProject(dto))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'addUserToProject')
    public async addUserToProject(dto: ProjectIdAndUserId): Promise<void> {
        await this.projectUserService.addUserToProject(dto)
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'removeUserFromProject')
    public async removeUserFromProject(dto: ProjectIdAndUserId): Promise<void> {
        await this.projectUserService.removeUserFromProject(dto)
    }

}