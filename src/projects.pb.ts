/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "projects";

export interface Void {}

export interface Bool {
  bool: boolean;
}

export interface Project {
  id: string;
  name: string;
  leadId: string;
}

export interface ProjectId {
  projectId: string;
}

export interface SearchProjectsParams {
  leadId?: string | undefined;
  projectName?: string | undefined;
  usersIds: string[];
  projectsIds: string[];
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface UserId {
  userId: string;
}

export interface CreateProjectRequest {
  leadId: string;
  name: string;
}

export interface UpdateProjectRequest {
  projectId: string;
  leadId?: string | undefined;
  name?: string | undefined;
}

export interface ProjectIdAndUserId {
  projectId: string;
  userId: string;
}

export interface Invite {
  id: string;
  userId: string;
  projectId: string;
}

export interface InviteId {
  inviteId: string;
}

export interface SearchInvitesParams {
  userId?: string | undefined;
  projectId?: string | undefined;
  invitesIds: string[];
  limit?: number | undefined;
  offset?: number | undefined;
}

export const PROJECTS_PACKAGE_NAME = "projects";

export interface ProjectsServiceClient {
  getProjectById(request: ProjectId): Observable<Project>;

  searchProjects(request: SearchProjectsParams): Observable<Project>;

  isUserProjectParticipant(request: ProjectIdAndUserId): Observable<Bool>;

  createProject(request: CreateProjectRequest): Observable<Project>;

  updateProject(request: UpdateProjectRequest): Observable<Project>;

  deleteProject(request: ProjectId): Observable<Project>;

  addUserToProject(request: ProjectIdAndUserId): Observable<Void>;

  removeUserFromProject(request: ProjectIdAndUserId): Observable<Void>;
}

export interface ProjectsServiceController {
  getProjectById(
    request: ProjectId
  ): Promise<Project> | Observable<Project> | Project;

  searchProjects(request: SearchProjectsParams): Observable<Project>;

  isUserProjectParticipant(
    request: ProjectIdAndUserId
  ): Promise<Bool> | Observable<Bool> | Bool;

  createProject(
    request: CreateProjectRequest
  ): Promise<Project> | Observable<Project> | Project;

  updateProject(
    request: UpdateProjectRequest
  ): Promise<Project> | Observable<Project> | Project;

  deleteProject(
    request: ProjectId
  ): Promise<Project> | Observable<Project> | Project;

  addUserToProject(
    request: ProjectIdAndUserId
  ): Promise<Void> | Observable<Void> | Void;

  removeUserFromProject(
    request: ProjectIdAndUserId
  ): Promise<Void> | Observable<Void> | Void;
}

export function ProjectsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getProjectById",
      "searchProjects",
      "isUserProjectParticipant",
      "createProject",
      "updateProject",
      "deleteProject",
      "addUserToProject",
      "removeUserFromProject",
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
  getInviteById(request: InviteId): Observable<Invite>;

  searchInvites(request: SearchInvitesParams): Observable<Invite>;

  createInvite(request: ProjectIdAndUserId): Observable<Invite>;

  deleteInviteById(request: InviteId): Observable<Invite>;

  deleteInviteByUserIdAndProjectId(
    request: ProjectIdAndUserId
  ): Observable<Invite>;
}

export interface InvitesServiceController {
  getInviteById(
    request: InviteId
  ): Promise<Invite> | Observable<Invite> | Invite;

  searchInvites(request: SearchInvitesParams): Observable<Invite>;

  createInvite(
    request: ProjectIdAndUserId
  ): Promise<Invite> | Observable<Invite> | Invite;

  deleteInviteById(
    request: InviteId
  ): Promise<Invite> | Observable<Invite> | Invite;

  deleteInviteByUserIdAndProjectId(
    request: ProjectIdAndUserId
  ): Promise<Invite> | Observable<Invite> | Invite;
}

export function InvitesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getInviteById",
      "searchInvites",
      "createInvite",
      "deleteInviteById",
      "deleteInviteByUserIdAndProjectId",
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
