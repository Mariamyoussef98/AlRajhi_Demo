import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm"
import {User} from "./User"

export enum StatusTypes {
    Returned = "Returned",
    UnderInvestigation = "Under Investigation",
    OnHold = "On Hold"
}

@Entity('complaint')
export class Complaint extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column() 
    userComplaint: String 

    @Column({
        type: "enum",
        enum: StatusTypes,
        default: StatusTypes.UnderInvestigation
    }) 
    status: StatusTypes 

    @ManyToOne(
        ()=> User,
        User => User.complaints
    )
    @JoinColumn ({
        name: 'User_id'
    })
    user:User

}