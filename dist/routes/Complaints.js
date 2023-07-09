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
const Complaint_1 = require("../entities/Complaint");
const User_1 = require("../entities/User");
const router = (0, express_1.Router)();
router.get("/:phoneNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = +req.params.phoneNumber;
        const userWithComplaints = yield User_1.User.findOne({
            where: { phoneNumber },
            relations: ["complaints"],
        });
        if (!userWithComplaints)
            return res.status(404).json({ msg: "User not found" });
        return res.json({ data: userWithComplaints.complaints });
    }
    catch (error) {
        return res.status(500).json({ message: "error" });
    }
}));
router.post("/:phoneNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = +req.params.phoneNumber;
        const user = yield User_1.User.findOne({ where: { phoneNumber } });
        if (!user)
            return res.status(404).json({ msg: "User not found" });
        const { userComplaint } = req.body;
        const newComplaint = Complaint_1.Complaint.create({
            userComplaint,
            user,
        });
        yield newComplaint.save();
        return res.json({
            Status: "success",
            Complaint: newComplaint.userComplaint,
        });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
    return res.status(500).json({ message: "Unexpected error occurred" });
}));
exports.default = router;
//# sourceMappingURL=Complaints.js.map