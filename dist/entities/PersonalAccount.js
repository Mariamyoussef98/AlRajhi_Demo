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
exports.PersonalAccount = exports.AccountTypes = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
var AccountTypes;
(function (AccountTypes) {
    AccountTypes["SavingsAccount"] = "Savings Account";
    AccountTypes["CurrentAccount"] = "Current Account";
})(AccountTypes || (exports.AccountTypes = AccountTypes = {}));
let PersonalAccount = exports.PersonalAccount = class PersonalAccount extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PersonalAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
    }),
    __metadata("design:type", String)
], PersonalAccount.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: AccountTypes,
        default: AccountTypes.CurrentAccount,
    }),
    __metadata("design:type", String)
], PersonalAccount.prototype, "Type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PersonalAccount.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (User) => User.personalAccounts),
    (0, typeorm_1.JoinColumn)({
        name: "User_id",
    }),
    __metadata("design:type", User_1.User)
], PersonalAccount.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.User, (user) => user.predefinedAccounts),
    __metadata("design:type", Array)
], PersonalAccount.prototype, "usersWhoPredefinedThisAccount", void 0);
exports.PersonalAccount = PersonalAccount = __decorate([
    (0, typeorm_1.Entity)("personalAccount")
], PersonalAccount);
//# sourceMappingURL=PersonalAccount.js.map