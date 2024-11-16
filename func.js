import chalk from "chalk";
import readlineSync from "readline-sync";
import { isOver, isLobby } from "./game.js";

/* 이벤트씬 그냥 패스하기 위한 깡통 함수 */
export const funcEnd = () => {
  return;
};

/* 로비로 기능 도와주는 깡통 함수 */
export const goLobby = () => {
  isOver[0] = true;
  isLobby[0] = true;
  return;
};

/* 게임 종료 함수 */
export const shutDown = () => {
  process.exit(0);
};

/* 장면전환 확인 */
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

/* 반복 간 시간차를 두기 위한 함수 */
const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/* 입력 대기 함수 */
export const inputWaiting = (funcA, funcB, argA, argB) => {
  while (true) {
    const inputValue = readlineSync.question(`\n입력 : `);
    if (inputValue === "1") {
      funcA(argA);
      break;
    } else if (inputValue === "2") {
      funcB(argB);
      break;
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
  console.log(chalk.green(`\n============${eventText[0]}============`));
  // 분기 선택
  inputWaiting(funcA, funcB, argA, argB);
};
