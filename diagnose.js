const API_KEY = "AIzaSyC0Vii04IKCyU7OexPT0xEa2SGfq2jyqEs"; // 아까 그 키 (테스트 후 꼭 폐기!)

async function getAvailableModels() {
    console.log("--- 구글 서버에 모델 리스트 요청 중 ---");

    // SDK가 아닌 순수 웹 요청(fetch)으로 목록을 가져옵니다. (가장 정확함)
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ 에러 발생:", data.error.message);
            return;
        }

        console.log("\n✅ 사용 가능한 모델 목록:");
        console.log("------------------------------------------------");

        // 'generateContent' 기능을 지원하는 모델만 필터링해서 보여줍니다.
        const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));

        chatModels.forEach(model => {
            // models/gemini-1.5-flash-001 같은 형식으로 출력됨
            console.log(`- ${model.name.replace("models/", "")}`);
        });

        console.log("------------------------------------------------");
        console.log("👉 위 리스트에 있는 이름 중 하나를 골라 코드에 넣어야 합니다.");

    } catch (error) {
        console.error("통신 오류:", error);
    }
}

getAvailableModels();