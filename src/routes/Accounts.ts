import { Router } from "express";
import { Complaint } from "../entities/Complaint";
import { User } from "../entities/User";
import { PersonalAccount } from "../entities/PersonalAccount";
import { getRepository } from "typeorm";

const router = Router();

//get all personal accounts of a user
router.get("/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = +req.params.phoneNumber;
    const user = await User.findOne({
      where: { phoneNumber: phoneNumber },
      relations: ["personalAccounts", "predefinedAccounts"],
    });

    if (!user) {
      res.status(404).json({ msg: "User not found" });
    }

    const formattedUser = {
      ...user,
      predefinedAccounts: user!.predefinedAccounts.map((account) => ({
        ...account,
        accountHolder: `${user!.firstName} ${user!.lastName}`,
      })),
    };

    res.json({ data: formattedUser });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

//get all predefined accounts for a user's specific account
router.get("/predefinedAccounts/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = +req.params.phoneNumber;
    const user = await User.findOne({
      where: { phoneNumber: phoneNumber },
      relations: ["personalAccounts", "predefinedAccounts"],
    });

    if (!user) {
      res.status(404).json({ msg: "User not found" });
    }
    const formattedUser = {
      ...user,
      predefinedAccounts: user!.predefinedAccounts.map((account) => ({
        ...account,
        accountHolder: `${user!.firstName} ${user!.lastName}`,
      })),
    };

    res.json({ predefinedAccounts: formattedUser!.predefinedAccounts });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

//get a specific account of a user using account number
router.get("/accountInfo/:accountNumber", async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;

    // Validate the accountNumber parameter
    if (!accountNumber || typeof accountNumber !== "string") {
      res.status(400).json({ message: "Invalid account number" });
    }

    const personalAccountRepository = getRepository(PersonalAccount);
    const account = await personalAccountRepository
      .createQueryBuilder("personalAccount")
      .leftJoinAndSelect("personalAccount.user", "user")
      .where("personalAccount.accountNumber = :accountNumber", {
        accountNumber,
      })
      .getOne();

    if (!account) {
      res.status(404).json({ message: "Account not found" });
    }

    if (!account!.user) {
      res.status(500).json({ message: "User not found for the account" });
    }

    const formattedAccount = {
      ...account,
      accountHolder: `${account!.user.firstName} ${account!.user.lastName} `, // Replace with the desired field from the User entity
      user: undefined,
    };

    res.json({ data: formattedAccount });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

// check if amount provided is in a specific account's balance (if not the find any account with that balance)
router.post("/checkTransfer", async (req, res) => {
  try {
    const { accountNumber, transferAmount } = req.body;

    const account = await PersonalAccount.findOne({
      where: { accountNumber: accountNumber },
      relations: ["user"],
    });
    if (!account) {
      res.status(404).json({ msg: "Account not found" });
    }
    if (account!.balance >= transferAmount) {
      res.json({ status: "Account has sufficient balance " });
    } else if (account!.balance < transferAmount) {
      const user = await account!.user;

     
      // Find all other accounts belonging to the same user (user.personalaccounts)
      const newUser = await User.findOne({
        where: { phoneNumber: user.phoneNumber },
        relations: ["personalAccounts"],
      });

    
      // Filter the accounts with balance >= transactionAmount
      const eligibleAccounts = newUser?.personalAccounts.filter(
        (acc) => acc.balance >= transferAmount
      );

      
      if (eligibleAccounts!.length > 0) {
        res.json({
          msg: "The account chosen does not have sufficient balance to cover this transaction.",
          eligibleAccounts: eligibleAccounts,
        });
      } else {
        res.json({
          message: "No account has a sufficient balance for the transaction",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

//transfer balance and update both accounts balances
router.post("/transfer", async (req, res) => {
  try {
    const { senderAccount, transferAmount } = req.body;

    //get sender account
    const sender = await PersonalAccount.findOne({
      where: { accountNumber: senderAccount },
      relations: ["user"],
    });
    if (!sender) {
      res.status(404).json({ msg: "Sender Account not found" });
    }
    //get receiver account
    // const receiver = await PersonalAccount.findOne({
    //   where: { accountNumber: receiverAccount },
    //   relations: ["user"],
    // });
    // if (!receiver) {
    //   res.status(404).json({ msg: "Receiver Account not found" });
    // }

    //update account balances
    // Update sender account balance
    sender!.balance -= +transferAmount;
    await sender!.save();

    // Update receiver account balance
    // receiver!.balance += +transferAmount;
    // await receiver!.save();

    res.json({ status: "Transfer successful" });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

export default router;
