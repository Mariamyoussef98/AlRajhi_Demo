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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { createConnection } = require("typeorm");
const User_1 = require("./entities/User");
const Complaint_1 = require("./entities/Complaint");
const Branch_1 = require("./entities/Branch");
const PersonalAccount_1 = require("./entities/PersonalAccount");
const express_1 = __importDefault(require("express"));
const Users_1 = __importDefault(require("./routes/Users"));
const Complaints_1 = __importDefault(require("./routes/Complaints"));
const Accounts_1 = __importDefault(require("./routes/Accounts"));
const app = (0, express_1.default)();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield createConnection({
            type: "postgres",
            host: "db.xzorivsxlxeozkpnzmcv.supabase.co",
            port: 5432,
            username: "postgres",
            password: "AlRajhi_Demo",
            database: "postgres",
            entities: [User_1.User, Complaint_1.Complaint, PersonalAccount_1.PersonalAccount, Branch_1.Branch],
            migrations: ["src/migration/**/*.js"],
            synchronize: true,
        });
        console.log("Connected to Postgres");
        app.use(express_1.default.json());
        app.use("/api/users", Users_1.default);
        app.use("/api/complaints", Complaints_1.default);
        app.use("/api/accounts", Accounts_1.default);
        app.listen(3000, () => {
            console.log("Now running on port 3000");
        });
    }
    catch (error) {
        console.error(error);
        throw new Error("Unable to connect to db");
    }
});
main();
//# sourceMappingURL=index.js.map