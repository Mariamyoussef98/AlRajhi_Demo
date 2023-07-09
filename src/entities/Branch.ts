import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";

@Entity("branch")
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branchName: String;

  @OneToMany(() => User, (user) => user.branch)
  users: User[];
}
