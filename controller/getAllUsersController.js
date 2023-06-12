const axios = require("axios");
const KeycloakAdminClient = require("keycloak-admin").default;

const getAccessToken = async () => {
  try {
    const keycloakAdmin = new KeycloakAdminClient();
    keycloakAdmin.setConfig({
      baseUrl: process.env.BASE_URL_KEYCLOAK_ADMIN,
      realmName: process.env.MY_REALM,
      client_id: process.env.MY_CLIENT,
    });

    const response = await axios.post(
      process.env.BASE_URL_KEYCLOAK_ADMIN,
      new URLSearchParams({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        grant_type: process.env.GRANT_TYPE,
        client_id: process.env.MY_CLIENT,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error("Failed to authenticate:", error);
    throw new Error("Failed to retrieve access token");
  }
};

const getUsersWithToken = async (token) => {
  try {
    const response = await axios.get(process.env.BASE_URL_GET_USERS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to retrieve users:", error.message);
  }
};

const postAdmin = async (req, res, next) => {
  try {
    const access_token = await getAccessToken();
    const users = await getUsersWithToken(access_token);

    // Filter users where User_Type is "STUDENT"
    const studentUsers = users.filter((user) => {
      const userTypes = user.attributes && user.attributes.User_Type;
      return userTypes && userTypes.includes("STUDENT");
    });

    res.status(200).json({ users: studentUsers });
  } catch (error) {
    console.error("Failed to process request:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

exports.postAdmin = postAdmin;

