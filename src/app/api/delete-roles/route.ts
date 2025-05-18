export async function POST() {
  const KEYCLOAK_URL = "http://127.0.0.1:8080";
  const REALM = "master";
  const CLIENT_ID = "test-client";
  const CLIENT_SECRET = "9iGU6iinozIGZriPitHuJ8UzEUbEfDSI";

  const rolesToDelete = [
    "test-access-ids-visual-assets",
    "test-device",
    "test-device-2",
    "test-locatio",
    "test-locatio-check-in-check-out-report",
    "test-locatio-daily-activity-logs-report",
    "test-locatio-event-anomalou-report",
    "test-locatio-manage-devices",
    "test-locatio-ppe-alerts-report",
    "test-locatio-visual-assets",
    "test-location",
    "test-location-1",
    "test-location-1-check-in-check-out-report",
    "test-location-1-daily-activity-logs-report",
    "test-location-1-event-anomalou-report",
    "test-location-1-manage-devices",
    "test-location-1-ppe-alerts-report",
    "test-location-1-visual-assets",
    "test-location-2",
    "test-location-2-check-in-check-out-report",
    "test-location-2-daily-activity-logs-report",
    "test-location-2-event-anomalou-report",
    "test-location-2-manage-devices",
    "test-location-2-ppe-alerts-report",
    "test-location-2-view-all-devices",
    "test-location-2-view-all-reports",
    "test-location-2-visual-assets",
    "test-location-check-in-check-out",
    "test-location-daily-activity-logs",
    "test-location-event-nomalou",
    "test-location-ppe-alerts",
    "test-location-reports",
    "test-location-visual-assets",
    "testing-loc",
    "testing-loc-check-in-check-out-report",
    "testing-loc-daily-activity-logs-report",
    "testing-loc-event-anomalou-report",
    "testing-loc-manage-devices",
    "testing-loc-ppe-alerts-report",
    "testing-loc-visual-assets",
    "testing-location",
    "testing-location-check-in-check-out-report",
    "testing-location-daily-activity-logs-report",
    "testing-location-event-anomalou-report",
    "testing-location-manage-devices",
    "testing-location-ppe-alerts-report",
    "testing-location-view-all-devices",
    "testing-location-view-all-reports",
    "testing-location-visual-assets",
  ];

  try {
    // Step 1: Get access token
    const tokenRes = await fetch(
      `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }).toString(),
      }
    );

    if (!tokenRes.ok) {
      const errData = await tokenRes.text();
      return new Response(`Failed to get token: ${errData}`, {
        status: tokenRes.status,
      });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Delete each role
    const deleted = [];
    const failed = [];

    for (const role of rolesToDelete) {
      const deleteRes = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${encodeURIComponent(
          role
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (deleteRes.ok) {
        deleted.push(role);
      } else {
        const errorText = await deleteRes.text();
        failed.push({ role, error: errorText });
      }
    }

    return new Response(JSON.stringify({ deleted, failed }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error during role deletion:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
