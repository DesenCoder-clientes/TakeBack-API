import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Companies } from "./Company";

@Entity()
export class Industries {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column({
    type: "float",
  })
  categoryFee: number;

  @Column({
    default: 1,
  })
  iconCategory: number;

  @OneToMany(() => Industries, () => Companies)
  companies: Companies[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
