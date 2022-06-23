import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'invites' })
export class Invite {

    @PrimaryGeneratedColumn('uuid')
        id: string

    @Column('uuid')
        userId: string

    @Column('uuid')
        projectId: string

}