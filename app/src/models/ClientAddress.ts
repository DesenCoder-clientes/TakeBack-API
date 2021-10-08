import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { City } from './City'

@Entity()
export class ClientAddress {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        nullable: true
    })
    street: string

    @ManyToOne(type => City)
    city: City

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}