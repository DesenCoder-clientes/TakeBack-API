import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { ClientAddress } from './ClientAddress'

@Entity()
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    full_name: string

    @Column()
    birth_date: Date

    @Column()
    sex: string

    @Column()
    phone: string

    @Column()
    email: string

    @Column()
    cpf: string

    @Column()
    password: string

    @Column({
        default: false
    })
    remember: boolean

    @Column({
        nullable: true
    })
    signature: string

    @Column({
        nullable: true
    })
    balance: number

    @Column({
        nullable: true
    })
    blocked_balance: number

    @Column({
        default: true
    })
    pending_email_confirmation: boolean

    @OneToOne(type => ClientAddress)
    @JoinColumn()
    address: ClientAddress

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}