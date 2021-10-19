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

    @Column({
        nullable: true
    })
    district: string

    @Column({
        nullable: true
    })
    number: number

    @ManyToOne(type => City)
    city: City

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}