/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { Error } from "./common.pb";
import { Empty } from "./google/protobuf/empty.pb";

export const protobufPackage = "eventbus";

export interface Project {
  id?: string | undefined;
  name?: string | undefined;
  leadId?: string | undefined;
}

export interface ProjectEvent {
  error?: Error | undefined;
  project: Project | undefined;
}

export interface AddOrRemoveUserFromProjectEvent {
  error?: Error | undefined;
  projectId: string;
  userId: string;
}

export interface IsUserProjectParticipantEvent {
  error?: Error | undefined;
  projectId: string;
  userId: string;
  bool: boolean;
}

export interface SearchProjectsParams {
  boardId?: string | undefined;
  projectsIds: string[];
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface SearchProjectsEvent {
  error?: Error | undefined;
  searchParams: SearchProjectsParams | undefined;
  projects: Project[];
}

export interface Invite {
  id?: string | undefined;
  userId?: string | undefined;
  projectId?: string | undefined;
}

export interface InviteEvent {
  error?: Error | undefined;
  invite: Invite | undefined;
}

export interface SearchInvitesParams {
  userId?: string | undefined;
  projectId?: string | undefined;
  invitesIds: string[];
  limit?: number | undefined;
  offset?: number | undefined;
}

export interface SearchInvitesEvent {
  error?: Error | undefined;
  searchParams: SearchInvitesParams | undefined;
  invites: Invite[];
}

export const EVENTBUS_PACKAGE_NAME = "eventbus";

export interface ProjectsEventsServiceClient {
  getProjectByIdEvent(request: ProjectEvent): Observable<Empty>;

  searchProjectsEvent(request: SearchProjectsEvent): Observable<Empty>;

  isUserProjectParticipantEvent(
    request: IsUserProjectParticipantEvent
  ): Observable<Empty>;

  createProjectEvent(request: ProjectEvent): Observable<Empty>;

  updateProjectEvent(request: ProjectEvent): Observable<Empty>;

  deleteProjectEvent(request: ProjectEvent): Observable<Empty>;

  addUserToProjectEvent(
    request: AddOrRemoveUserFromProjectEvent
  ): Observable<Empty>;

  removeUserFromProjectEvent(
    request: AddOrRemoveUserFromProjectEvent
  ): Observable<Empty>;
}

export interface ProjectsEventsServiceController {
  getProjectByIdEvent(request: ProjectEvent): void;

  searchProjectsEvent(request: SearchProjectsEvent): void;

  isUserProjectParticipantEvent(request: IsUserProjectParticipantEvent): void;

  createProjectEvent(request: ProjectEvent): void;

  updateProjectEvent(request: ProjectEvent): void;

  deleteProjectEvent(request: ProjectEvent): void;

  addUserToProjectEvent(request: AddOrRemoveUserFromProjectEvent): void;

  removeUserFromProjectEvent(request: AddOrRemoveUserFromProjectEvent): void;
}

export function ProjectsEventsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getProjectByIdEvent",
      "searchProjectsEvent",
      "isUserProjectParticipantEvent",
      "createProjectEvent",
      "updateProjectEvent",
      "deleteProjectEvent",
      "addUserToProjectEvent",
      "removeUserFromProjectEvent",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("ProjectsEventsService", method)(
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
      GrpcStreamMethod("ProjectsEventsService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const PROJECTS_EVENTS_SERVICE_NAME = "ProjectsEventsService";

export interface InvitesEventsServiceClient {
  getInviteByIdEvent(request: InviteEvent): Observable<Empty>;

  searchInvitesEvent(request: SearchInvitesEvent): Observable<Empty>;

  createInviteEvent(request: InviteEvent): Observable<Empty>;

  deleteInviteEvent(request: InviteEvent): Observable<Empty>;
}

export interface InvitesEventsServiceController {
  getInviteByIdEvent(request: InviteEvent): void;

  searchInvitesEvent(request: SearchInvitesEvent): void;

  createInviteEvent(request: InviteEvent): void;

  deleteInviteEvent(request: InviteEvent): void;
}

export function InvitesEventsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getInviteByIdEvent",
      "searchInvitesEvent",
      "createInviteEvent",
      "deleteInviteEvent",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("InvitesEventsService", method)(
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
      GrpcStreamMethod("InvitesEventsService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const INVITES_EVENTS_SERVICE_NAME = "InvitesEventsService";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
