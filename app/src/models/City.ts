import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { State } from './State'

@Entity()
export class City {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @ManyToOne(type => State, cities => City)
    state: State

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}