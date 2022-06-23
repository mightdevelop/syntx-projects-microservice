import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
    PROJECTS_SERVICE_NAME,
    Project as ProtoProject,
    ProjectsServiceController,
    ProjectByIdRequest,
    ProjectsByUserIdRequest,
    ProjectsByLeadIdRequest,
    CreateProjectRequest,
    UpdateProjectRequest,
    DeleteProjectRequest,
    ProjectUserRequest,
} from './projects.pb'
import { ProjectsService } from './services/projects.service'
import { concatMap, from, Observable } from 'rxjs'

@Controller()
export class ProjectsController implements ProjectsServiceController {

    @Inject(ProjectsService)
    private readonly projectsService: ProjectsService

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'getProjectById')
    public getProjectById(dto: ProjectByIdRequest): Observable<ProtoProject> {
        return from(this.projectsService.getProjectById(dto))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'getProjectsByUserId')
    public getProjectsByUserId(dto: ProjectsByUserIdRequest): Observable<ProtoProject> {
        return from(this.projectsService.getProjectsByUserId(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'getProjectsByLeadId')
    public getProjectsByLeadId(dto: ProjectsByLeadIdRequest): Observable<ProtoProject> {
        return from(this.projectsService.getProjectsByLeadId(dto)).pipe(concatMap(x => x))
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
    public deleteProject(dto: DeleteProjectRequest): Observable<ProtoProject> {
        return from(this.projectsService.deleteProject(dto))
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'addUserToProject')
    public async addUserToProject(dto: ProjectUserRequest): Promise<void> {
        await this.projectsService.addUserToProject(dto)
    }

    @GrpcMethod(PROJECTS_SERVICE_NAME, 'removeUserFromProject')
    public async removeUserFromProject(dto: ProjectUserRequest): Promise<void> {
        await this.projectsService.removeUserFromProject(dto)
    }

}