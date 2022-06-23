import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
    INVITES_SERVICE_NAME,
    Invite as ProtoInvite,
    InvitesServiceController,
    InviteByIdRequest,
    InvitesByUserIdRequest,
    InvitesByProjectIdRequest,
    CreateInviteRequest,
    DeleteInviteRequest,
} from '../projects.pb'
import { concatMap, from, Observable } from 'rxjs'
import { InvitesService } from './services/invites.service'

@Controller()
export class InvitesController implements InvitesServiceController {

    @Inject(InvitesService)
    private readonly invitesService: InvitesService

    @GrpcMethod(INVITES_SERVICE_NAME, 'getInviteById')
    public getInviteById(dto: InviteByIdRequest): Observable<ProtoInvite> {
        return from(this.invitesService.getInviteById(dto))
    }

    @GrpcMethod(INVITES_SERVICE_NAME, 'getInvitesByUserId')
    public getInvitesByUserId(dto: InvitesByUserIdRequest): Observable<ProtoInvite> {
        return from(this.invitesService.getInvitesByUserId(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(INVITES_SERVICE_NAME, 'getInvitesByProjectId')
    public getInvitesByProjectId(dto: InvitesByProjectIdRequest): Observable<ProtoInvite> {
        return from(this.invitesService.getInvitesByProjectId(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(INVITES_SERVICE_NAME, 'createInvite')
    public createInvite(dto: CreateInviteRequest): Observable<ProtoInvite> {
        return from(this.invitesService.createInvite(dto))
    }

    @GrpcMethod(INVITES_SERVICE_NAME, 'deleteInvite')
    public deleteInvite(dto: DeleteInviteRequest): Observable<ProtoInvite> {
        return from(this.invitesService.deleteInvite(dto))
    }

}