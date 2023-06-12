const jwtmod = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const token = bearerHeader && bearerHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }
  const public_key = process.env.KEY_CLOAKPUBLIC_KEY;
  try {
    const decodedToken = jwtmod.verify(token, public_key, {
      algorithms: ["RS256"],
    });
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    console.log("Error verifying JWT:", error);
    res.sendStatus(401);
  }
};
