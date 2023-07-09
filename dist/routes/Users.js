"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../entities/User");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find({ relations: ["branch"] });
        const formattedUsers = users.map(user => (Object.assign(Object.assign({}, user), { branchName: user.branch.branchName, branch: undefined })));
        res.json({ data: formattedUsers });
        res.json({ data: users });
    }
    catch (error) { }
}));
router.get("/:phoneNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = +req.params.phoneNumber;
        const user = yield User_1.User.findOne({ where: { phoneNumber: phoneNumber }, relations: ["branch", "personalAccounts", "predefinedAccounts"] });
        if (!user) {
            res.status(404).json({ msg: "User not found" });
        }
        const formattedUser = Object.assign(Object.assign({}, user), { predefinedAccounts: user.predefinedAccounts.map((account) => (Object.assign(Object.assign({}, account), { accountHolder: `${user.firstName} ${user.lastName}` }))), branchName: user.branch.branchName, branch: undefined });
        const userComplaints = yield User_1.User.findOne({
            where: { phoneNumber },
            relations: ["complaints"],
        });
        if (userComplaints.complaints.length > 0) {
            user.hasComplaints = true;
            yield User_1.User.save(user);
        }
        else {
            user.hasComplaints = false;
            yield User_1.User.save(user);
        }
        res.json({ data: formattedUser });
    }
    catch (error) { }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, phoneNumber, isLoanEligible } = req.body;
        const user = User_1.User.create({
            firstName,
            lastName,
            phoneNumber,
            isLoanEligible,
        });
        yield user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.default = router;
//# sourceMappingURL=Users.js.map