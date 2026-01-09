const fs = require('fs');
const path = require('path');

async function checkModels() {
    const logPath = path.join(__dirname, 'model_list_result.txt');

    // Helper to log to both console and file
    const log = (msg) => {
        console.log(msg);
        try {
            fs.appendFileSync(logPath, (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg) + '\n');
        } catch (e) {
            console.error("File write error:", e);
        }
    };

    // Initialize file
    fs.writeFileSync(logPath, 'Starting Model Check...\n');

    try {
        const envPath = path.join(__dirname, '.env.local');
        if (!fs.existsSync(envPath)) {
            log(".env.local file not found!");
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.+)/);

        if (!match) {
            log("Could not find GEMINI_API_KEY in .env.local");
            return;
        }

        const apiKey = match[1].trim().replace(/["']/g, '');
        log(`Checking models with API Key: ${apiKey.substring(0, 8)}...`);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            log("API Error Response:");
            log(data.error);
        } else if (data.models) {
            log("\n[Available Models for generateContent]");
            const chatModels = data.models.filter(m =>
                m.supportedGenerationMethods.includes('generateContent')
            );

            if (chatModels.length === 0) {
                log("No models found supporting 'generateContent'.");
            }

            chatModels.forEach(m => {
                log(`- ${m.name}`);
            });
        } else {
            log("Unexpected response format:");
            log(data);
        }
    } catch (error) {
        log("Script Error: " + error);
    }
}

checkModels();
