import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User";

export enum AccountTypes {
  SavingsAccount = "Savings Account",
  CurrentAccount = "Current Account",
}

@Entity("personalAccount")
export class PersonalAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  accountNumber: String;

  @Column({
    type: "enum",
    enum: AccountTypes,
    default: AccountTypes.CurrentAccount,
  })
  Type: AccountTypes;

  @Column()
  balance: number;

  @ManyToOne(() => User, (User) => User.personalAccounts)
  @JoinColumn({
    name: "User_id",
  })
  user: User;

  @ManyToMany(() => User, (user) => user.predefinedAccounts)
  usersWhoPredefinedThisAccount: User[];
}
