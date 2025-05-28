const bcrypt = require("bcrypt");
const { ReasonPhrases } = require("http-status-codes");
const hashPassword = async (pass) => {
  try {
    const saltRound = 10;
    const hashed = await bcrypt.hash(pass, saltRound);
    return hashed;
  } catch (err) {
    throw new Error(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { hashPassword };
