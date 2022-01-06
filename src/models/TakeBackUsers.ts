import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class TakeBackUsers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  name: string;

  @Column({
    nullable: false
  })
  cpf: string;

  @Column({
    select: false,
    nullable: false
  })
  password: string;

  @Column({
    default: true,
    nullable: false
  })
  isActive: boolean;

  @Column({
    nullable: false
  })
  email: string;

  @Column({
    default: false,
    nullable: false
  })
  isRoot: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
