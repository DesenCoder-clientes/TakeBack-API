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
    fullName: string

    @Column()
    birthDate: Date

    @Column()
    phone: string

    @Column()
    email: string

    @Column()
    cpf: string

    @Column()
    password: string

    @Column({
        nullable: true
    })
    signature: string

    @Column({
        default: 0
    })
    balance: number

    @Column({
        default: 0
    })
    blockedBalance: number

    @Column({
        default: false
    })
    emailConfirmated: boolean

    @Column({
        default: false
    })
    phoneConfirmated: boolean

    @OneToOne(type => ClientAddress)
    @JoinColumn()
    address: ClientAddress

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}