/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "projects";

export interface Project {
  id: string;
  name: string;
  leadId: string;
}

export interface ProjectByIdRequest {
  projectId: string;
}

export interface ProjectsByUserIdRequest {
  userId: string;
}

export interface ProjectsByLeadIdRequest {
  leadId: string;
}

export interface CreateProjectRequest {
  leadId: string;
  name: string;
}

export interface UpdateProjectRequest {
  projectId: string;
  leadId: string;
  name: string;
}

export interface DeleteProjectRequest {
  projectId: string;
}

export interface Invite {
  id: string;
  userId: string;
  projectId: string;
}

export interface InviteByIdRequest {
  inviteId: string;
}

export interface InvitesByUserIdRequest {
  userId: string;
}

export interface InvitesByProjectIdRequest {
  projectId: string;
}

export interface CreateInviteRequest {
  projectId: string;
  userId: string;
}

export interface DeleteInviteRequest {
  inviteId: string;
}

export const PROJECTS_PACKAGE_NAME = "projects";

export interface ProjectsServiceClient {
  getProjectById(request: ProjectByIdRequest): Observable<Project>;

  getProjectsByUserId(request: ProjectsByUserIdRequest): Observable<Project>;

  getProjectsByLeadId(request: ProjectsByLeadIdRequest): Observable<Project>;

  createProject(request: CreateProjectRequest): Observable<Project>;

  updateProject(request: UpdateProjectRequest): Observable<Project>;

  deleteProject(request: DeleteProjectRequest): Observable<Project>;
}

export interface ProjectsServiceController {
  getProjectById(
    request: ProjectByIdRequest
  ): Promise<Project> | Observable<Project> | Project;

  getProjectsByUserId(request: ProjectsByUserIdRequest): Observable<Project>;

  getProjectsByLeadId(request: ProjectsByLeadIdRequest): Observable<Project>;

  createProject(
    request: CreateProjectRequest
  ): Promise<Project> | Observable<Project> | Project;

  updateProject(
    request: UpdateProjectRequest
  ): Promise<Project> | Observable<Project> | Project;

  deleteProject(
    request: DeleteProjectRequest
  ): Promise<Project> | Observable<Project> | Project;
}

export function ProjectsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getProjectById",
      "getProjectsByUserId",
      "getProjectsByLeadId",
      "createProject",
      "updateProject",
      "deleteProject",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("ProjectsService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("ProjectsService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const PROJECTS_SERVICE_NAME = "ProjectsService";

export interface InvitesServiceClient {
  getInviteById(request: InviteByIdRequest): Observable<Invite>;

  getInvitesByUserId(request: InvitesByUserIdRequest): Observable<Invite>;

  getInvitesByProjectId(request: InvitesByProjectIdRequest): Observable<Invite>;

  createInvite(request: CreateInviteRequest): Observable<Invite>;

  deleteInvite(request: DeleteInviteRequest): Observable<Invite>;
}

export interface InvitesServiceController {
  getInviteById(
    request: InviteByIdRequest
  ): Promise<Invite> | Observable<Invite> | Invite;

  getInvitesByUserId(request: InvitesByUserIdRequest): Observable<Invite>;

  getInvitesByProjectId(request: InvitesByProjectIdRequest): Observable<Invite>;

  createInvite(
    request: CreateInviteRequest
  ): Promise<Invite> | Observable<Invite> | Invite;

  deleteInvite(
    request: DeleteInviteRequest
  ): Promise<Invite> | Observable<Invite> | Invite;
}

export function InvitesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getInviteById",
      "getInvitesByUserId",
      "getInvitesByProjectId",
      "createInvite",
      "deleteInvite",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("InvitesService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("InvitesService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const INVITES_SERVICE_NAME = "InvitesService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
