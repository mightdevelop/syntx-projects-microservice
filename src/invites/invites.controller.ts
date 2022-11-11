import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
    INVITES_SERVICE_NAME,
    Invite as ProtoInvite,
    InvitesServiceController,
    SearchInvitesParams,
    InviteId,
    ProjectIdAndUserId,
} from '../pb/projects.pb'
import { concatMap, from, Observable } from 'rxjs'
import { InvitesService } from './services/invites.service'

@Controller()
export class InvitesController implements InvitesServiceController {

    @Inject(InvitesService)
    private readonly invitesService: InvitesService

    @GrpcMethod(INVITES_SERVICE_NAME, 'getInviteById')
    public getInviteById(dto: InviteId): Observable<ProtoInvite> {
        return from(this.invitesService.getInviteById(dto))
    }

    @GrpcMethod(INVITES_SERVICE_NAME, 'searchInvites')
    public searchInvites(dto: SearchInvitesParams): Observable<ProtoInvite> {
        return from(this.invitesService.searchInvites(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(INVITES_SERVICE_NAME, 'createInvite')
    public createInvite(dto: ProjectIdAndUserId): Observable<ProtoInvite> {
        return from(this.invitesService.createInvite(dto))
    }

    @GrpcMethod(INVITES_SERVICE_NAME, 'deleteInviteById')
    public deleteInviteById(dto: InviteId): Observable<ProtoInvite> {
        return from(this.invitesService.deleteInviteById(dto))
    }

    @GrpcMethod(INVITES_SERVICE_NAME, 'deleteInviteByUserIdAndProjectId')
    public deleteInviteByUserIdAndProjectId(dto: ProjectIdAndUserId): Observable<ProtoInvite> {
        return from(this.invitesService.deleteInviteByUserIdAndProjectId(dto))
    }

}