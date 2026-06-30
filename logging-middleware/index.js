export async function Log(stack, level, package_name, message) {
    let token = "";

    if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem("token") || "";
    } else if (typeof process !== 'undefined' && process.env) {
        token = process.env.AUTH_TOKEN || "";
    }

    let requestBody = {
        "stack": stack,
        "level": level,
        "package": package_name,
        "message": message
    };

    let fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(requestBody)
    };

    // Use proxy in browser to avoid CORS, direct URL in Node.js
    const isBrowser = typeof window !== 'undefined';
    const logUrl = isBrowser ? "/api/logs" : "http://4.224.186.213/evaluation-service/logs";

    try {
        let response = await fetch(logUrl, fetchOptions);
        let data = await response.json();
    } catch (error) {
    }
}
