/* 함수 기능 테스트 해보는 곳 */
/* (수정 필요) 이벤트 씬 */
export const eventScene = function (texts) {
  const eventText = [...texts];
  console.clear();
  let textIdx = 0;
  // setInterval로 텍스트를 하나씩 출력
  const textTimer = setInterval(function () {
    console.clear();
    console.log(chalk.green(`=====================\n`));
    console.log(eventText[textIdx]);
    console.log(chalk.green(`\n=====================`));
    textIdx++;
    // 모든 텍스트가 출력된 후 인터벌 종료 및 NextOrEnd 호출
    if (textIdx === eventText.length) {
      clearInterval(textTimer);
      console.log(chalk.green(`1. 계속 2. 게임종료 `));
      NextOrEnd(); // 모든 텍스트가 출력된 후에 호출
    }
  }, 700);
  const NextOrEnd = function () {
    const next_or_end = readlineSync.question("입력 : ");
    switch (next_or_end) {
      case "1":
        startGame();
        break;
      case "2":
        process.exit(0); // 게임 종료
      default:
        console.log(chalk.red("1,2만 입력 가능합니다"));
        NextOrEnd();
    }
  };
};

import * as images from "./ASCII.js";

let myImages = { ...images };
delete myImages["printMyRoom"];
console.log(myImages);
myImages = Object.values(myImages);
console.log(myImages);
console.log(myImages[0]());
