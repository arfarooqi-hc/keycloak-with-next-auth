export async function getAccessToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", "test-client");
  params.append("client_secret", "9iGU6iinozIGZriPitHuJ8UzEUbEfDSI");

  const res = await fetch("http://localhost:8080/realms/master/protocol/openid-connect/token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Token fetch failed: ${res.status} - ${JSON.stringify(data)}`);
  }

  return data.access_token;
}


export async function getUsers() {

  const token = await getAccessToken();

  const res = await fetch("http://localhost:8080/admin/realms/master/users", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch users: ${error}`);
  }

  return await res.json();
}


export async function deleteUser(userId: string) {
  const token = await getAccessToken();
console.log(`Deleting user with ID: ${userId}`); // Debugging line

  const res = await fetch(`http://localhost:8080/admin/realms/master/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to delete user: ${error}`);
  }

  return true;
}

export async function createUser(userData: any) {
  const token = await getAccessToken();

  const res = await fetch("http://localhost:8080/admin/realms/master/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to add user: ${error}`);
  }

  return true;
}

export async function updateUserById(userId: string, userData: any) {
  const token = await getAccessToken();

  const res = await fetch(`http://localhost:8080/admin/realms/master/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update user: ${error}`);
  }

  return true;
}
