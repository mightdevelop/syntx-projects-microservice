import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'project_user' })
export class ProjectUser {

    @PrimaryGeneratedColumn('uuid')
        id: string

    @Column('uuid')
        userId: string

    @Column('uuid')
        projectId: string

}