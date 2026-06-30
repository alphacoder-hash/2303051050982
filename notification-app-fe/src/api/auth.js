import { Log } from 'logging-middleware';

const AUTH_CREDENTIALS = {
    email: "2303051050982@paruluniversity.ac.in",
    name: "vaibhav pandey",
    rollNo: "2303051050982",
    accessCode: "cJqaEB",
    clientID: "eca5dc58-c3fe-4f34-8d0e-b40e6e9c4ee8",
    clientSecret: "SPgzpCxYBrKtRGCV"
};

export async function refreshToken() {
    try {
        const response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(AUTH_CREDENTIALS)
        });

        if (!response.ok) {
            throw new Error(`Auth failed: ${response.status}`);
        }

        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem("token", token);
        localStorage.setItem("token_expires", data.expires_in);
        await Log("frontend", "info", "auth", "Successfully refreshed authorization token");
        return token;
    } catch (error) {
        await Log("frontend", "error", "auth", `Failed to refresh token: ${error.message}`);
        throw error;
    }
}

export function isTokenExpired() {
    const expiresIn = localStorage.getItem("token_expires");
    if (!expiresIn) return true;
    // Add 30 second buffer before expiry
    return Date.now() / 1000 >= Number(expiresIn) - 30;
}

export async function getValidToken() {
    if (isTokenExpired()) {
        return await refreshToken();
    }
    return localStorage.getItem("token");
}
