import chalk from "chalk";
import figlet from "figlet";
import readlineSync from "readline-sync";
import { start } from "./server.js";
import { Player } from "./player.js";
import { Classmate } from "./classmates.js";
import * as images from "./ASCII.js";
import * as texts from "./texts.js";

/* 스테이터스 창 */
const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
// 내 방 씬
function displayMyRoom(stage, player) {
  console.clear();
  console.log(chalk.magentaBright(`\n=============== 현재 상태 ===============`));
  console.log(
    chalk.cyanBright(`| ${weekdays[stage - 1]} 밤 |\n`) +
      chalk.blueBright(`| 나의 기분: ${player.mood} |\n`) +
      chalk.blueBright(
        `| 말솜씨: ${player.talkSkills} | 매력: ${player.charms} | 게임실력: ${player.gameSkills} |`,
      ),
  );
  images.printMyRoom(); // 방 이미지
  console.log(chalk.magentaBright(`=========================================\n`));
}
// 학교 씬
function displaySchool(stage, player, classmate, countBreakTime) {
  let isNoon = "오전";
  countBreakTime >= 4 ? (isNoon = "오후") : isNoon;
  console.clear();
  console.log(chalk.magentaBright(`\n=============== 현재 상태 ===============`));
  console.log(
    chalk.cyanBright(`| ${weekdays[stage]} ${isNoon} ${countBreakTime}교시 쉬는 시간 |\n`) +
      chalk.blueBright(`| 나의 자신감: ${player.confidence} |\n`) +
      chalk.blueBright(
        `| 말솜씨: ${player.talkSkills} | 매력: ${player.charms} | 게임실력: ${player.gameSkills} |\n`,
      ) +
      chalk.redBright(`| ${classmate.name[stage - 1]}의 현재 친밀도 : ${classmate.closeness} |\n`),
  );
  // 친구 이미지
  switch (stage) {
    case 1:
      images.printJW();
      break;
    case 2:
      images.printYB();
      break;
    case 3:
      images.printGE();
      break;
    case 4:
      images.printSW();
      break;
    case 5:
      images.printGM();
      break;
  }
  console.log(chalk.magentaBright(`=========================================\n`));
}

// 이벤트씬 그냥 패스하기 위한 깡통 함수
export const funcEnd = () => {
  return;
};

/* 게임 시작 */
export async function startGame() {
  console.clear();
  const me = new Player();
  let stage = 1;
  await eventScene(texts.openingTexts, 500, funcEnd, start);
  while (stage <= 5) {
    const classmate = new Classmate(stage);
    await myRoomScene(stage, me, classmate);
    await eventScene(texts.goSchoolTexts, 500, funcEnd, funcEnd); // (추가할 것) 장면 전환 이벤트 텍스트
    await schoolScene(stage, me, classmate);
    await eventScene(texts.goHomeTexts, 500, funcEnd, start); // (추가할 것) 장면 전환 이벤트 텍스트
    stage++;
  }
}

/* 게임 오버 */
export const gameOver = async function () {
  console.clear();
  console.log(chalk.magentaBright("=".repeat(50)));
  console.log(
    chalk.redBright(
      figlet.textSync("Game Over", {
        font: "Slant",
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
    ),
  );
  console.log(chalk.magentaBright("=".repeat(50)));
  console.log("\n[1. 재시작] [2. 게임 종료]");
  // 재시작 또는 게임 종료 선택
  const RestartOrQuit = () => {
    while (true) {
      const restart_or_quit = readlineSync.question(`\n입력 : `);
      if (restart_or_quit === "1") {
        start();
        break;
      } else if (restart_or_quit === "2") {
        process.exit(0);
      }
      console.log(chalk.red("1,2만 입력 가능합니다"));
    }
  };
  RestartOrQuit();
};

/* 반복 간 시간차를 두기 위한 함수 */
const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/* 이벤트 씬 */
export const eventScene = async function (texts, printDelay, next, end) {
  const eventText = [...texts];
  console.clear();
  let textIdx = 1;
  console.log(chalk.green(`============${eventText[0]}============\n`));
  // for문으로 텍스트를 하나씩 출력
  for (; textIdx < eventText.length; textIdx++) {
    console.log(eventText[textIdx]);
    // 마지막 텍스트 나오면 구분선도 같이 출력
    if (textIdx === eventText.length - 1) {
      console.log(chalk.green(`\n============${eventText[0]}============`));
    }
    await wait(printDelay); // 강제로 시간차를 주는 함수
  }
  // 분기 선택 함수
  const NextOrEnd = (next, end) => {
    while (true) {
      const next_or_end = readlineSync.question(`\n입력 : `);
      if (next_or_end === "1") {
        next();
        break;
      } else if (next_or_end === "2") {
        end();
        break;
      }
      console.log(chalk.red("1,2만 입력 가능합니다"));
    }
  };
  NextOrEnd(next, end);
};

/* 내 방 장면 */
const myRoomScene = async (stage, player, classmate) => {
  let trainingCount = 4; // 훈련 최대 횟수는 네 번
  let cmdMessage = ""; // 능력치 변동 알려줄 문자열
  while (trainingCount > 0) {
    displayMyRoom(stage, player);
    console.log(chalk.green(`\n뭘 하며 시간을 보낼까? 남은 행동 포인트 : ${trainingCount}`));
    console.log(chalk.green(`1. 책 읽기 2. 운동하기 3. 게임하기`));
    console.log(chalk.redBright(`\n${cmdMessage}`));
    // 플레이어의 선택에 따른 훈련 실행 및 결과 처리
    const doTraining = async function () {
      const choice = readlineSync.question("입력 : ");
      switch (choice) {
        case "1":
          player.readBooks();
          cmdMessage = `\n말솜씨가 10 오르고, 매력이 5 올랐다!\n`;
          break;
        case "2":
          player.workOut();
          cmdMessage = `\n말솜씨가 5 오르고, 매력이 10 올랐다!\n`;
          break;
        case "3":
          player.playGames();
          cmdMessage = `\n게임실력이 20 올랐다! 기분이 2 회복됐다!\n`;
          break;
        default:
          console.log(chalk.red("1,2,3만 입력 가능합니다"));
          doTraining();
          break;
      }
    };
    await doTraining();
    trainingCount--;
    // 도중에 기분이 0 이하가 될 경우 씬 강제 전환
    if (player.mood <= 0) {
      await eventScene(texts.moodZeroTexts, 500, funcEnd, funcEnd); // 기분 스텟이 0이 되어 자버린다는 텍스트
      player.mood = 1; // 기분을 1로 회복시켜줌
      break;
    }
  }
};

/* 교실 장면 */
const schoolScene = async (stage, player, classmate) => {
  let countBreakTime = 1; // 쉬는 시간은 여섯 번
  let cmdMessage = ""; // 내 행동에 따른 친구의 반응 출력할 문자열
  const confiUp = () => {
    player.confidence += 10; // 점심 이벤트를 위한 자신감 회복 함수
  };
  const confiDown = () => {
    player.confidence -= 10; // 점심 이벤트를 위한 자신감 감소 함수
  };
  while (countBreakTime < 7) {
    // (추가할 것) 점심시간 이벤트
    if (countBreakTime === 4) {
      await eventScene(texts.lunchEventTexts, 500, confiUp, confiDown);
      // 점심시간 이벤트로 자신감이 0보다 작아지면 게임오버
      if (player.confidence <= 0) {
        await eventScene(texts.gameOverTexts, 500, gameOver, gameOver);
      }
    }
    displaySchool(stage, player, classmate, countBreakTime);
    console.log(
      chalk.green(
        `\n${classmate.name[stage - 1]}와(과) 마주쳤다! 어쩌면 좋지? 남은 교시 : ${7 - countBreakTime}`,
      ),
    );
    console.log(chalk.green(`1. 대화한다 2. 장난친다 3. 고백한다 4. 도망친다`));
    console.log(chalk.redBright(`\n${cmdMessage}`));
    // 플레이어의 선택에 따른 상호작용 결과 처리
    const playWithClassmate = async function () {
      const choice = readlineSync.question("입력 : ");
      switch (choice) {
        case "1":
          player.confidence -= 5;
          classmate.talk();
          classmate.isIncrease
            ? (cmdMessage = `\n대화에 우호적인 반응\n`)
            : (cmdMessage = `\n대화에 부정적인 반응\n`);
          break;
        case "2":
          player.confidence -= 5;
          classmate.joke();
          classmate.isIncrease
            ? (cmdMessage = `\n장난에 우호적인 반응\n`)
            : (cmdMessage = `\n장난에 부정적인 반응\n`);
          break;
        case "3":
          player.confidence -= 20;
          classmate.confess();
          if (classmate.isDate) {
            player.confidence = 100;
            cmdMessage = `\n고백에 긍정적인 반응\n`;
          } else {
            cmdMessage = `\n고백에 부정적인 반응\n`;
            if (classmate.isFailConfess) {
              await eventScene(texts.gameOverTexts, 500, gameOver, gameOver); // 고백 실패시 20% 확률로 게임 오버
            }
          }
          break;
        case "4":
          classmate.escape();
          classmate.isIncrease
            ? (cmdMessage = `\n도망에 어이없어하는 반응\n`)
            : (cmdMessage = `\n도망에 서운해하는 반응\n`);
          break;
        default:
          console.log(chalk.red("1,2,3,4만 입력 가능합니다"));
          playWithClassmate();
          break;
      }
    };
    await playWithClassmate();
    countBreakTime++;
    // (추가할 것) 고백 성공 시 연인 됐다는 이벤트 호출 후 스테이지 스킵
    if (classmate.isDate) {
      await eventScene(texts.dateTexts, 500, funcEnd, start);
      break;
    }
    // (추가할 것) 도중에 자신감 또는 친밀도가 0 이하가 될 경우 게임 오버
    if (player.confidence <= 0 || classmate.closeness <= 0) {
      await eventScene(texts.gameOverTexts, 500, gameOver, gameOver);
    }
  }
  // 교실 씬이 끝났는데 친밀도가 80 미만이면 게임 오버
  if (classmate.closeness < 80) {
    await eventScene(texts.gameOverTexts, 500, gameOver, gameOver);
  } else {
    // 스테이지 클리어시 자신감 20, 기분 2 회복
    player.confidence += 20;
    player.mood += 2;
  }
};
