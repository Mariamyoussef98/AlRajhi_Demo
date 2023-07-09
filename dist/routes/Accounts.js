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
const PersonalAccount_1 = require("../entities/PersonalAccount");
const typeorm_1 = require("typeorm");
const router = (0, express_1.Router)();
router.get("/:phoneNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = +req.params.phoneNumber;
        const user = yield User_1.User.findOne({
            where: { phoneNumber: phoneNumber },
            relations: ["personalAccounts", "predefinedAccounts"],
        });
        if (!user) {
            res.status(404).json({ msg: "User not found" });
        }
        const formattedUser = Object.assign(Object.assign({}, user), { predefinedAccounts: user.predefinedAccounts.map((account) => (Object.assign(Object.assign({}, account), { accountHolder: `${user.firstName} ${user.lastName}` }))) });
        res.json({ data: formattedUser });
    }
    catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}));
router.get("/predefinedAccounts/:phoneNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = +req.params.phoneNumber;
        const user = yield User_1.User.findOne({
            where: { phoneNumber: phoneNumber },
            relations: ["personalAccounts", "predefinedAccounts"],
        });
        if (!user) {
            res.status(404).json({ msg: "User not found" });
        }
        const formattedUser = Object.assign(Object.assign({}, user), { predefinedAccounts: user.predefinedAccounts.map((account) => (Object.assign(Object.assign({}, account), { accountHolder: `${user.firstName} ${user.lastName}` }))) });
        res.json({ predefinedAccounts: formattedUser.predefinedAccounts });
    }
    catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}));
router.get("/accountInfo/:accountNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountNumber = req.params.accountNumber;
        if (!accountNumber || typeof accountNumber !== "string") {
            res.status(400).json({ message: "Invalid account number" });
        }
        const personalAccountRepository = (0, typeorm_1.getRepository)(PersonalAccount_1.PersonalAccount);
        const account = yield personalAccountRepository
            .createQueryBuilder("personalAccount")
            .leftJoinAndSelect("personalAccount.user", "user")
            .where("personalAccount.accountNumber = :accountNumber", {
            accountNumber,
        })
            .getOne();
        if (!account) {
            res.status(404).json({ message: "Account not found" });
        }
        if (!account.user) {
            res.status(500).json({ message: "User not found for the account" });
        }
        const formattedAccount = Object.assign(Object.assign({}, account), { accountHolder: `${account.user.firstName} ${account.user.lastName} `, user: undefined });
        res.json({ data: formattedAccount });
    }
    catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}));
router.post("/checkTransfer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountNumber, transferAmount } = req.body;
        const account = yield PersonalAccount_1.PersonalAccount.findOne({
            where: { accountNumber: accountNumber },
            relations: ["user"],
        });
        if (!account) {
            res.status(404).json({ msg: "Account not found" });
        }
        if (account.balance >= transferAmount) {
            res.json({ status: "Account has sufficient balance " });
        }
        else if (account.balance < transferAmount) {
            const user = yield account.user;
            const newUser = yield User_1.User.findOne({
                where: { phoneNumber: user.phoneNumber },
                relations: ["personalAccounts"],
            });
            const eligibleAccounts = newUser === null || newUser === void 0 ? void 0 : newUser.personalAccounts.filter((acc) => acc.balance >= transferAmount);
            if (eligibleAccounts.length > 0) {
                res.json({
                    msg: "The account chosen does not have sufficient balance to cover this transaction.",
                    eligibleAccounts: eligibleAccounts,
                });
            }
            else {
                res.json({
                    message: "No account has a sufficient balance for the transaction",
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}));
router.post("/transfer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderAccount, receiverAccount, transferAmount } = req.body;
        const sender = yield PersonalAccount_1.PersonalAccount.findOne({
            where: { accountNumber: senderAccount },
            relations: ["user"],
        });
        if (!sender) {
            res.status(404).json({ msg: "Sender Account not found" });
        }
        const receiver = yield PersonalAccount_1.PersonalAccount.findOne({
            where: { accountNumber: receiverAccount },
            relations: ["user"],
        });
        if (!receiver) {
            res.status(404).json({ msg: "Receiver Account not found" });
        }
        sender.balance -= +transferAmount;
        yield sender.save();
        receiver.balance += +transferAmount;
        yield receiver.save();
        res.json({ status: "Transfer successful" });
    }
    catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}));
exports.default = router;
//# sourceMappingURL=Accounts.js.map