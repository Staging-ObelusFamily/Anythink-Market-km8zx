const mongoose = require("mongoose");
require("../models/User");
require("../models/Item");
require("../models/Comment");
require("dotenv").config();

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const seedUsers = [];
// const seedItems = []

const randomStr = (length = 24) => {
  // Declare all characters
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Pick characers randomly
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

for (let i = 0; i < 100; i += 1) {
  seedUsers.push({
    role: "user",
    favorites: [],
    following: [],
    username: `coolnickname${i}`,
    email: `esapir${i}@gmail.com`,
    salt: "3632065afe7775bd0081339bd263c01a",
    hash: "f6d1a2978b60cc6fb369e17f8ec2374b37b1cecc35a4f5ab4284b0171c8561722f69966ecd4eb04f2e2fdb80c3f398a2c6648b0e922759d18f4415a2f0ad71c642705fcc12afa777601d6dd2accd22aeecea093b0cf96c4d28510cf20f02a18d23a8815cad5e190014e4e15e985a6f84f3c7a36a5cf98f71dd8e6d6f1355037c8baf9cce43a4e8f294f360f37e68219f6c0caa5486534b6df7d08dbd3d3ebaf821d1831ea6ce3625bb4ce95a389b84af3c730f80ae87e0fda8f27be13fac2c0ff18886af34a5fb83c676977a1802e1a25403fda39d6e7ee5af82eba7a9192c8c5117132465d88157e6d7d8015131a3fd0e31d064adb02ec39c582a09c318d371eceb99ca56fd6a174440d16e1af8225a55154e8bcd58a9d60793ced7fa770ff3547e67cf0d61e4233a7612d5fa41e096ea34f4e5b89dd9fbc44d73ed2e4f899fab2c2897b52d8357d48ead4af47b53dcd41cd35d90eab645e47e150d52adfcb9853d9c0cf2bdccdf67c656d54f34a5db9c0741d01ca905283a730e0d16258b39b9e89f1efb3d4d4fbe833c2fddd9080f5e0a1300ba06380ed7802638f0ac7851653dad3b6cde77a80fe2080002b89d6c0d23ee947b91936caa4e547f7102917c1b8bae3fd4cc6141ce024951749011e6577fddd3e4eb1522c82f39d7299ae4c2029addf665acfc59ea5ba58ab551b233979b77c4e9e182cded1a441dde3da3e4",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  });
}

const seedDB = async () => {
  await Comment.deleteMany({});
  await Item.deleteMany({});
  await User.deleteMany({});

  const usersData = await User.insertMany(seedUsers);

  const seedItems = [];
  for (const user of usersData) {
    seedItems.push({
      slug: `item_${user.id}`,
      title: `title`,
      description: `description`,
      image: "",
      favoritesCount: 0,
      comments: [],
      tagList: [],
      seller: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const itemsData = await Item.insertMany(seedItems);

  const seedComments = [];

  for (const item of itemsData) {
    seedComments.push({
      body: `this is a comment for item with title ${item.title}`,
      seller: item.seller,
      item: item.id,
    });
  }

  await Comment.insertMany(seedComments);
};

seedDB().then(() => {
  mongoose.connection.close();
});
