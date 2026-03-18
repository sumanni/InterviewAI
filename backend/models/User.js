const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, default: "" },
  photo: { type: String, default: "" },
  googleId: { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", UserSchema);
