import { Router } from "express";
import { User } from "../entities/User";

const router = Router();

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ relations: ["branch"] });
    const formattedUsers = users.map(user => ({
      ...user,
      branchName: user.branch.branchName,
      branch: undefined
    }));
    res.json({ data: formattedUsers });
    res.json({ data: users });
  } catch (error) {}
});

//get info of a specific user with accounts
router.get("/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = +req.params.phoneNumber;
    const user = await User.findOne({ where: { phoneNumber: phoneNumber }, relations: ["branch","personalAccounts", "predefinedAccounts" ] });
  

    if (!user) {
       res.status(404).json({ msg: "User not found" });
    }


    const formattedUser = {
      ...user,
      predefinedAccounts: user!.predefinedAccounts.map((account) => ({
        ...account,
        accountHolder: `${user!.firstName} ${user!.lastName}`,
      })),
      branchName: user!.branch.branchName,
      branch: undefined
    };
    
    //check for complaints
    const userComplaints = await User.findOne({
      where: { phoneNumber },
      relations: ["complaints"],
    });
    if (userComplaints!.complaints.length > 0) {
      user!.hasComplaints = true;
      await User.save(user!); // Save the updated user
    } else {
      user!.hasComplaints = false;
      await User.save(user!);
    }

    res.json({ data: formattedUser });
  } catch (error) {}
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, isLoanEligible } = req.body;
    const user = User.create({
      firstName,
      lastName,
      phoneNumber,
      isLoanEligible,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
