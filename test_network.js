// Native fetch is available in Node.js 18+

async function testConnection() {
    console.log("Testing connection to google.com...");
    try {
        const res = await fetch('https://www.google.com');
        console.log("Google Status:", res.status);
    } catch (e) {
        console.error("Google Connection Failed:", e.message);
    }

    console.log("Testing connection to generativelanguage.googleapis.com...");
    try {
        const res = await fetch('https://generativelanguage.googleapis.com');
        console.log("API Status:", res.status); // 404 is expected for root, but connection success
    } catch (e) {
        console.error("API Connection Failed:", e.message);
    }
}

testConnection();
