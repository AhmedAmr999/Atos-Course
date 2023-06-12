import { useEffect, useState, useRef } from "react";
import Keycloak from "keycloak-js";

export default function useAuth() {
  const keycloakConfig = {
    url: "http://127.0.0.1:8080/",
    realm: "myrealm",
    clientId: "myclient",
  };

  const [isLogin, setLogin] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  let isRun = useRef(false);
  const client = useRef(null);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;
    client.current = new Keycloak(keycloakConfig);

    client.current.init({ onLoad: "login-required" }).then((res) => {
      setLogin(res);
      setToken(client.current.token);
      setUsername(client.current.tokenParsed.preferred_username);
      setUserType(client.current.tokenParsed.User_Type);
      setUserId(client.current.tokenParsed.sub);
    });
  }, []);

  const logout = () => {
    client.current.logout();
    setToken(null);
    setUserType(null);
    setUsername(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload(client.current.init({ onLoad: "login-required" }));
  };

  return [isLogin, token, userType, username, userId, logout];
}
