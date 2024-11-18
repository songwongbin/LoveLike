import chalk from "chalk";
import readlineSync from "readline-sync";
import { isLobby } from "./game.js";

/* 이벤트씬 패스 위한 깡통 함수 */
export const funcEnd = () => {
  return;
};

/* 로비로 가기 위한 깡통 함수 */
export const goLobby = () => {
  isLobby[0] = true;
  return;
};

/* 게임 종료 */
export const shutDown = () => {
  process.exit(0);
};

/* 장면전환 시 단순 입력대기 */
export const cutaway = () => {
  return new Promise(function (resolve) {
    while (true) {
      const pressAnyKey = readlineSync.question("1을 입력해 계속 : ");
      if (pressAnyKey === "1") {
        resolve();
        break;
      }
      console.log(chalk.red("1만 입력 가능합니다"));
    }
  });
};

/* 반복 간 시간차 */
const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/* 분기 선택을 위한 입력 대기 */
export const inputWaiting = (funcA, funcB, argA, argB) => {
  while (true) {
    const inputValue = readlineSync.question(`입력 : `);
    if (inputValue === "1") {
      funcA(argA);
      return;
    } else if (inputValue === "2") {
      funcB(argB);
      return;
    }
    console.log(chalk.red("1,2만 입력 가능합니다"));
  }
};

/* 이벤트 씬 */
export const eventScene = async function (textsArr, printDelay, funcA, funcB, argA, argB) {
  const eventText = [...textsArr];
  console.clear();
  console.log(chalk.green(`============${eventText[0]}============\n`));
  // for문으로 텍스트를 하나씩 출력하는데, 0번째 인덱스는 빼고
  for (let txt of eventText.slice(1)) {
    console.log(txt);
    await wait(printDelay); // 시간차 부여
  }
  console.log(chalk.green(`\n============${eventText[0]}============\n`));
  // 분기 선택
  inputWaiting(funcA, funcB, argA, argB);
};
