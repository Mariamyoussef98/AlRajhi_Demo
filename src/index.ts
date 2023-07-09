import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Complaint } from "./entities/Complaint";
import { Branch } from "./entities/Branch";
import { PersonalAccount } from "./entities/PersonalAccount";
import express from "express";
import userRouter from "./routes/Users";
import ComplaintsRouter from "./routes/Complaints";
import accountsRouter from "./routes/Accounts";

const app = express();

const main = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: "db.xzorivsxlxeozkpnzmcv.supabase.co",
      port: 5432,
      username: "postgres",
      password: "AlRajhi_Demo",
      database: "postgres",
      entities: [User, Complaint, PersonalAccount, Branch],
      migrations: ["src/migration/**/*.js"],
      synchronize: true,
      

    });
    
    console.log("Connected to Postgres");

    app.use(express.json());

    app.use("/api/users", userRouter);
    app.use("/api/complaints", ComplaintsRouter);
    app.use("/api/accounts", accountsRouter);
   

    app.listen(3000, () => {
      console.log("Now running on port 3000");
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to db");
  }
};

main();
