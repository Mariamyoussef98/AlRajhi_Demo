import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Complaint } from "./Complaint";
import { PersonalAccount } from "./PersonalAccount";
import { Branch } from "./Branch";



export enum Gender {
  Male = 'male',
  Female = 'female',
}


@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: String;

  @Column()
  lastName: String;

  @Column({
    unique: true,
  })
  phoneNumber: number;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Male,
  })
  gender: Gender;

  @Column()
  isLoanEligible: boolean;

  
  @ManyToOne(() => Branch, branch => branch.users)
  branch: Branch;

  @Column({
    default: false,
  })
  hasComplaints: boolean;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];

  @OneToMany(() => PersonalAccount, (personalAccount) => personalAccount.user)
  personalAccounts: PersonalAccount[];

  @ManyToMany(() => PersonalAccount, (personalAccount) => personalAccount.usersWhoPredefinedThisAccount)
  @JoinTable({ name: "predefinedAccounts" })
  predefinedAccounts: PersonalAccount[];
}
