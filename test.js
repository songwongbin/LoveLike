/* 함수 기능 테스트 해보는 곳 */
//#region Json 파일관리
//#region 파일 정보 가져오기
import fsp from "fs/promises"; // fs/promises에서 fs를 가져옵니다.
import fs from "fs"; // fs 모듈을 가져옵니다.
// JSON 파일을 로드하는 함수
async function loadJson(filePath) {
  try {
    const data = await fsp.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    // 데이터 사용
    //console.log(jsonData);
    //console.log(`ShopText: ${jsonData.ShopText[0]}`);
    return jsonData;
  } catch (err) {
    console.error("파일 읽기 오류:", err);
  }
}
// JSON 파일을 저장하는 함수
function saveJson(filePath, jsonData) {
  // JSON 객체를 문자열로 변환
  const jsonString = JSON.stringify(jsonData, null, 2); // 가독성을 위해 들여쓰기 추가
  try {
    // 파일에 쓰기
    fs.writeFileSync(filePath, jsonString);
    console.log(`${filePath} 파일이 저장되었습니다.`);
  } catch (err) {
    console.error("파일 쓰기 오류:", err);
  }
}
/* 사용 예시
const jsonFilePath = 'TextTable.json'; // 로드할 JSON 파일 경로
const saveFilePath = 'data.json'; // 저장할 JSON 파일 경로
// JSON 로드
loadJson(jsonFilePath);
// JSON 데이터 예시 (저장할 데이터)
const jsonDataToSave = {
  name: "홍길동",
  age: 30,
  city: "서울",
};
// JSON 저장
saveJson(saveFilePath, jsonDataToSave);
*/
//#endregion
//#endregion