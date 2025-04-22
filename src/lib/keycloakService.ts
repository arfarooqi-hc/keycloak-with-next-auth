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


// Get all users and attach their roles (realm + client)
export async function getUsers() {
  const token = await getAccessToken();

  const res = await fetch("http://localhost:8080/admin/realms/master/users", 
    {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch users: ${error}`);
  }

  const users = await res.json();

  // Map through users and add roles
  const usersWithRoles = await Promise.all(
    users.map(async (user: any) => {
      const roles = await getUserRoles(user.id);
      return { ...user, roles };
    })
  );

  return usersWithRoles;
}

// Fetch user's assigned realm and client roles
async function getUserRoles(userId: string) {
  // Fetch realm roles
  const token = await getAccessToken();

  const realmRolesRes = await fetch(`http://localhost:8080/admin/realms/master/users/${userId}/role-mappings/realm`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const realmRoles = realmRolesRes.ok ? await realmRolesRes.json() : [];

  // Fetch client ID of your known client by name
  const clientRes = await fetch("http://localhost:8080/admin/realms/master/clients", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  
  const clients = clientRes.ok ? await clientRes.json() : [];
  const client = clients.find((c: any) => c.clientId === "test-client");

  let clientRoles = [];
  if (client) {
    const clientRolesRes = await fetch(
      `http://localhost:8080/admin/realms/master/users/${userId}/role-mappings/clients/${client.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    clientRoles = clientRolesRes.ok ? await clientRolesRes.json() : [];
  }

  return {
    realmRoles,
    clientRoles,
  };
}


export async function deleteUser(userId: string) {
  const token = await getAccessToken();

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

// ROLES

export async function createRealmRole(roleName: string) {
  const token = await getAccessToken();

  const rolePayload = {
    name: roleName,
    description: `Auto-created role for ${roleName}`,
  };

  const res = await fetch("http://localhost:8080/admin/realms/master/roles", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rolePayload),
  });

  if (!res.ok) {
    // ✅ Use await res.text() only once and store it
    const errorText = await res.text();
    throw new Error(`Failed to create role: ${errorText}`);
  }

  return true;
}

// AUTH
export async function loginWithCredentials(username: string, password: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", "test-client");
  params.append("client_secret", "9iGU6iinozIGZriPitHuJ8UzEUbEfDSI"); // for confidential clients
  params.append("username", username);
  params.append("password", password);

  const res = await fetch("http://localhost:8080/realms/master/protocol/openid-connect/token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  
  const data = await res.json();
  console.log("data", data);

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} - ${JSON.stringify(data)}`);
  }

  return data; // includes access_token, refresh_token, etc.
}

// lib/keycloakService.ts

export async function updateUserPassword(userId: string, newPassword: string) {
  const token = await getAccessToken(); // Get access token

  const res = await fetch(`http://localhost:8080/admin/realms/master/users/${userId}/reset-password`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "password",
      value: newPassword,
      temporary: false, // false to indicate that the password doesn't need to be reset again
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Failed to update password: ${errorData.message || 'Unknown error'}`);
  }

  return true; // Password updated successfully
}

