"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Gender = void 0;
const typeorm_1 = require("typeorm");
const Complaint_1 = require("./Complaint");
const PersonalAccount_1 = require("./PersonalAccount");
const Branch_1 = require("./Branch");
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
})(Gender || (exports.Gender = Gender = {}));
let User = exports.User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Gender,
        default: Gender.Male,
    }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], User.prototype, "isLoanEligible", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Branch_1.Branch, branch => branch.users),
    __metadata("design:type", Branch_1.Branch)
], User.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "hasComplaints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Complaint_1.Complaint, (complaint) => complaint.user),
    __metadata("design:type", Array)
], User.prototype, "complaints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PersonalAccount_1.PersonalAccount, (personalAccount) => personalAccount.user),
    __metadata("design:type", Array)
], User.prototype, "personalAccounts", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => PersonalAccount_1.PersonalAccount, (personalAccount) => personalAccount.usersWhoPredefinedThisAccount),
    (0, typeorm_1.JoinTable)({ name: "predefinedAccounts" }),
    __metadata("design:type", Array)
], User.prototype, "predefinedAccounts", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("user")
], User);
//# sourceMappingURL=User.js.map