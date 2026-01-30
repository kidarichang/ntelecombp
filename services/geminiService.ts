
import { GoogleGenAI, Type } from "@google/genai";
import { BPCenter } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchExternalBP = async (location: string, centers: BPCenter[]) => {
  try {
    const centerContext = centers.map(c => ({ 
      id: c.id, 
      name: c.name, 
      address: c.address 
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `사용자가 한국의 지역명 "${location}"을 검색했습니다. 
      
      [분석 지침]
      1. 지역명 분석: "${location}"이 한국 내 여러 곳에 존재하는지 확인하세요. 
         (예: "봉래동"은 서울 중구와 부산 영도구에 모두 존재합니다. "둔산동"은 대전에 존재합니다.)
      2. 검색어가 중의적일 경우(여러 도시에 존재할 경우), 각 도시별로 가장 가까운 BP센터를 골고루 선정하세요.
      3. 선정 기준:
         - 입력된 지역(시/구/동)과 행정구역이 일치하거나 지리적으로 인접한 센터 우선.
         - 최대 6개까지 선정.
      
      [데이터 리스트]
      ${JSON.stringify(centerContext)}
      
      [출력 규칙]
      - 추천 사유(reason)에는 해당 지역이 어디어디(예: 서울, 부산 등)에 위치하는지 명시하고, 왜 이 센터들을 추천했는지 설명하세요.
      - 절대 관련 없는 먼 지역의 센터를 섞지 마세요.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: "분석된 지역들과 가장 인접한 BP센터 ID 리스트"
            },
            reason: {
              type: Type.STRING,
              description: "지역 분석 결과 및 추천 근거 (예: '봉래동은 서울과 부산에 모두 위치하며, 두 지역 인근의 센터를 추천합니다')"
            }
          },
          required: ["recommendedIds", "reason"]
        }
      },
    });

    const result = JSON.parse(response.text);
    return {
      ids: result.recommendedIds as number[],
      reason: result.reason as string
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      ids: [],
      reason: "지리 정보를 분석하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    };
  }
};
