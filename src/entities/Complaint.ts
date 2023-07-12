import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

// export enum StatusTypes {
//     Closed = "Closed",
//     Resolved = "Resolved",
//     InProgress = "In Progress"
// }

@Entity("complaint")
export class Complaint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userComplaint: String;

  @Column({
    default: "In Progress",
  })
  status: String;

  @ManyToOne(() => User, (User) => User.complaints)
  @JoinColumn({
    name: "User_id",
  })
  user: User;
}
