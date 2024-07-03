const AssignUser = require("../models/assignUser");
const xlsx = require("xlsx");
const axios = require("axios");

async function handleGetAllAssignUser(req, res) {
  try {
    const { authenticatedUserEmail } = req.query;

    if (!authenticatedUserEmail) {
      return res
        .status(400)
        .json({ message: "Authenticated user email is required" });
    }

    const users = await AssignUser.find({
      addedBy: authenticatedUserEmail.toLowerCase(),
    });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found assigned by this user" });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching assigned users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function handlePostAllAssignUser(req, res) {
  try {
    const authenticatedUserEmail =
      req.body.authenticatedUserEmail.toLowerCase();
    console.log("Authenticated user:", authenticatedUserEmail);

    if (
      req.body.auName &&
      req.body.auEmail &&
      req.body.auSkills &&
      req.body.auGroup
    ) {
      const { auSkills, auEmail, ...userData } = req.body;
      const existingUser = await AssignUser.findOne({
        auEmail: auEmail.toLowerCase(),
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User already exists with this email." });
      }

      const skillsArray = auSkills.split(",").map((skill) => skill.trim());

      const assignUser = new AssignUser({
        ...userData,
        auSkills: skillsArray,
        auEmail: auEmail.toLowerCase(),
        addedBy: authenticatedUserEmail,
        auWIP: ["in-progress"],
      });

      const newAssignUser = await assignUser.save();

      const isClicked = req.body.isClicked
        ? JSON.parse(req.body.isClicked)
        : {};
      for (const [skill, clicked] of Object.entries(isClicked)) {
        if (clicked) {
          const updatedSlot = await updateSlot(authenticatedUserEmail, skill);
          if (!updatedSlot.success) {
            return res
              .status(500)
              .json({ message: "Failed to update slot quantities." });
          }
        }
      }

      return res.status(201).json({ success: true, newAssignUser });
    }

    if (req.file && req.body.isClicked) {
      const fileBuffer = req.file.buffer;
      const skills = JSON.parse(req.body.isClicked);
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);

      const existingEmails = new Set();
      const duplicates = [];

      for (const student of data) {
        const newStudentData = {};
        for (const key in student) {
          if (Object.hasOwnProperty.call(student, key)) {
            let formattedKey = key.toLowerCase();
            if (formattedKey === "name") formattedKey = "auName";
            else if (formattedKey === "email") formattedKey = "auEmail";
            else if (formattedKey === "group") formattedKey = "auGroup";
            newStudentData[formattedKey] = student[key];
          }
        }

        const email = newStudentData.auEmail.toLowerCase();

        if (existingEmails.has(email)) {
          duplicates.push(email);
        } else {
          existingEmails.add(email);
        }
      }

      if (duplicates.length > 0) {
        return res.status(409).json({ success: false, duplicates });
      } else {
        for (const student of data) {
          const newStudentData = {};
          for (const key in student) {
            if (Object.hasOwnProperty.call(student, key)) {
              let formattedKey = key.toLowerCase();
              if (formattedKey === "name") formattedKey = "auName";
              else if (formattedKey === "email") formattedKey = "auEmail";
              else if (formattedKey === "group") formattedKey = "auGroup";
              newStudentData[formattedKey] = student[key];
            }
          }

          const email = newStudentData.auEmail.toLowerCase();
          try {
            const existingUser = await AssignUser.findOne({ auEmail: email });
            if (!existingUser) {
              const assignUser = new AssignUser({
                ...newStudentData,
                auEmail: email,
                auSkills: Object.keys(skills).filter((skill) => skills[skill]),
                addedBy: authenticatedUserEmail,
                auWIP: ["in-progress"],
              });
              await assignUser.save();
            }
          } catch (error) {
            console.error("Error saving user:", error);
          }
        }

        for (const skill in skills) {
          if (skills[skill]) {
            const updatedSlot = await updateSlot(authenticatedUserEmail, skill);
            if (!updatedSlot.success) {
              return res
                .status(500)
                .json({ message: "Failed to update slot quantities." });
            }
          }
        }

        return res
          .status(201)
          .json({ success: true, message: "Users uploaded successfully." });
      }
    }

    return res.status(400).json({ message: "Invalid request format." });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateSlot(email, skill) {
  try {
    const skillLevelMap = {
      "Creative Problem solving": "level1",
      "Entrepreneurial Mindset": "level2",
      Negotiation: "level3",
      "Story-telling": "level4",
      "First Principles Thinking": "level5",
      "Sharp Remote Communication": "level6",
      Collaboration: "level7",
      "Emotional Intelligence": "level8",
      "Productivity Management": "level9",
      "Entire Game": "allLevels",
    };

    const response = await axios.get(
      `${process.env.BASE_URL}/initialslot/${email}`
    );
    const slotDetails = response.data.AllProducts;

    if (skill === "allLevels") {
      for (const skillName in skillLevelMap) {
        const level = skillLevelMap[skillName];
        if (slotDetails[level] > 0) {
          slotDetails[level]--;
        }
      }
    } else {
      const level = skillLevelMap[skill];

      if (level && slotDetails[level] > 0) {
        slotDetails[level]--;
      }
    }

    const slotResponse = await axios.patch(
      `${process.env.BASE_URL}/initialslot/${email}`,
      {
        AllProducts: slotDetails,
      }
    );

    if (slotResponse.status !== 200) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating slot quantities:", error);
    return { success: false };
  }
}

module.exports = {
  handleGetAllAssignUser,
  handlePostAllAssignUser,
};
