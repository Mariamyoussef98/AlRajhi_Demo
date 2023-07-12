import { Router } from "express";
import { Complaint } from "../entities/Complaint";
import { User } from "../entities/User";

const router = Router();

//get all complaints of a specific user
router.get("/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = +req.params.phoneNumber;
    const userWithComplaints = await User.findOne({
      where: { phoneNumber },
      relations: ["complaints"],
    });

    if (!userWithComplaints)
      return res.status(404).json({ msg: "User not found" });

    return res.json({ data: userWithComplaints.complaints });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
});

//create a new complaint for a user
router.post("/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = +req.params.phoneNumber;
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const { userComplaint, status } = req.body;
    const newComplaint = Complaint.create({
      userComplaint,
      status,
      user,
    });

    await newComplaint.save();
    return res.json({
      Status: "success",
      Complaint: newComplaint.userComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
  return res.status(500).json({ message: "Unexpected error occurred" });
});

export default router;
