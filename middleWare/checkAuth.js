const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const headerToken = req.headers.authorization;
  console.log("the header ", headerToken);
  const token = headerToken?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.KEY_CLOAKPUBLIC_KEY);
    const { sub: id, User_Type } = decodedToken;

    req.user = { id, User_Type };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
