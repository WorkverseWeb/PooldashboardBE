const ProfileImage = require("../models/upload");

async function handleGetAllImages(req, res) {
  try {
    const email = req.params.email;
    const profileImage = await ProfileImage.findOne({ email: email });

    if (!profileImage) {
      return res.status(404).send("Image not found");
    }

    const imageData = Buffer.from(profileImage.imageData, "base64"); // Convert Base64 string to buffer
    res.set("Content-Type", profileImage.contentType);
    res.send(imageData);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
}

async function handlePostAllImages(req, res) {
  try {
    const imageData = req.file.buffer.toString("base64");
    const contentType = req.file.mimetype;
    const email = req.body.email;

    let profileImage = await ProfileImage.findOne({ email: email });

    if (profileImage) {
      profileImage.imageData = imageData;
      profileImage.contentType = contentType;
    } else {
      profileImage = new ProfileImage({
        imageData: imageData,
        contentType: contentType,
        email: email,
      });
    }

    await profileImage.save();
    res.status(200).send("File uploaded and stored in database");
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
}

module.exports = {
  handleGetAllImages,
  handlePostAllImages,
};
