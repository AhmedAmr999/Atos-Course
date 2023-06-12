
const getDecodedToken = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    res.status(200).send(decodedToken);
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.getDecodedToken = getDecodedToken;
