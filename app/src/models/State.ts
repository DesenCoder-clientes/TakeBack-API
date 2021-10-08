import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { City } from './City'

@Entity()
export class State {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    initials: string

    @OneToMany(type => City, state => State)
    cities: City

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}