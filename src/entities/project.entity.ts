import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'projects' })
export class Project {

    @PrimaryGeneratedColumn('uuid')
        id: string

    @Column({ type: 'varchar', length: 50 })
        name: string

    @Column('uuid')
        leadId: string

}