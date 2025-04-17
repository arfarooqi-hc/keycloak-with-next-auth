export async function POST() {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", "test-client");
      params.append("client_secret", "9iGU6iinozIGZriPitHuJ8UzEUbEfDSI");
  
      const response = await fetch("http://127.0.0.1:8080/realms/master/protocol/openid-connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(), 
      });
  
      const data = await response.json();
  
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("Token fetch error:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  