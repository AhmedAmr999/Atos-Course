const API_ENDPOINT = "http://localhost:3002/users";

export async function login(username, password) {
  const response = await fetch(`${API_ENDPOINT}/login`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("userType", data.userType);
  return data.message;
}

export async function signup(username, password, userType) {
  const response = await fetch(`${API_ENDPOINT}/signup`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
      userType: userType,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (userType !== "ADMIN") {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    localStorage.setItem("userId", data.userId);
  }

  return data.message;
}

export const fetchUserInfo = async () => {
  try {
    const response = await fetch("http://localhost:3002/users/profileInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    localStorage.setItem("userId", data.userId);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function getAllUsers() {
  try {
    const response = await fetch("http://localhost:3002/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
