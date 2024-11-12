import chalk from "chalk";
import readlineSync from "readline-sync";
/* 플레이어, 몬스터, 함수 모듈 분리 */
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
  // 방 이미지
  images.printMyRoom();
  console.log(chalk.magentaBright(`=========================================\n`));
}
// 교실 씬
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

/* 게임 시작 함수 */
export async function startGame() {
  console.clear();
  const me = new Player();
  let stage = 1;

  while (stage <= 5) {
    const classmate = new Classmate(stage);
    await myRoomScene(stage, me, classmate);
    await SchoolScene(stage, me, classmate);
    // 스테이지 클리어 및 게임 종료 조건
    stage++;
  }
}

/* 이벤트 씬 함수 */
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
  //console.log(chalk.green(`1. 계속 2. 게임종료 `));
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

/* 내 방 씬 (수정중) */
const myRoomScene = async (stage, player, classmate) => {
  let trainingCount = 4; // 훈련 최대 횟수는 네 번
  let cmdMessage = ""; // 능력치 변동 알려줄 문자열
  while (trainingCount > 0) {
    displayMyRoom(stage, player);

    console.log(chalk.green(`\n뭘 하며 시간을 보낼까? 남은 행동 포인트 : ${trainingCount}`));
    console.log(chalk.green(`1. 책 읽기 2. 운동하기 3. 게임하기`));
    console.log(chalk.redBright(`\n${cmdMessage}`));
    // 플레이어의 선택에 따라 다음 행동 처리
    const doTraining = async function () {
      const choice = readlineSync.question("입력 : ");
      switch (choice) {
        case "1":
          player.isReadBooks();
          cmdMessage = `\n말솜씨가 10 오르고, 매력이 5 올랐다!\n`;
          break;
        case "2":
          player.isWorkOut();
          cmdMessage = `\n말솜씨가 5 오르고, 매력이 10 올랐다!\n`;
          break;
        case "3":
          player.isPlayGames();
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
    // 도중에 기분이 0이 될 경우 씬 강제 전환
    if (player.mood === 0) {
      console.log(chalk.redBright(`\n기분이 안 좋아졌다... 잠이나 자버리자...`)); // 작동 안 하네...
      break;
    }
  }
  eventScene(texts.openingTexts);
};

/* 교실 씬 (수정중) */
const SchoolScene = async (stage, player, classmate) => {
  let countBreakTime = 1; // 쉬는 시간은 여섯 번
  let cmdMessage = ""; // 능력치 변동 알려줄 문자열
  while (countBreakTime < 7) {
    /* 점심시간 이벤트 */
    if (countBreakTime === 4) eventScene(texts.openingTexts); // 왜 작동 안 하지?
    displaySchool(stage, player, classmate, countBreakTime);

    console.log(
      chalk.green(
        `\n${classmate.name[stage - 1]}와(과) 마주쳤다! 어쩌면 좋지? 남은 교시 : ${7 - countBreakTime}`,
      ),
    );
    console.log(chalk.green(`1. 대화한다 2. 장난친다 3. 고백한다 4. 도망친다`));
    console.log(chalk.redBright(`\n${cmdMessage}`));
    // 플레이어의 선택에 따라 다음 행동 처리
    const playWithClassmate = async function () {
      const choice = readlineSync.question("입력 : ");
      switch (choice) {
        case "1":
          classmate.isTalk();
          player.confidence -= 5;
          cmdMessage = `\n상대방의 반응\n`;
          break;
        case "2":
          classmate.isJoke();
          player.confidence -= 5;
          cmdMessage = `\n상대방의 반응\n`;
          break;
        case "3":
          classmate.isConfess();
          player.confidence -= 20;
          cmdMessage = `\n상대방의 반응\n`;
          break;
        case "4":
          classmate.isEscape();
          cmdMessage = `\n상대방의 반응\n`;
          break;
        default:
          console.log(chalk.red("1,2,3,4만 입력 가능합니다"));
          playWithClassmate();
          break;
      }
    };
    await playWithClassmate();
    countBreakTime++;
    // 도중에 자신감이 0이 될 경우 게임 오버
    if (player.confidence === 0) {
      console.log(chalk.redBright(`\n자신감이 바닥을 쳤다!!`));
      console.log(chalk.redBright(`\n난 안 될 거야......`));
      break;
    }
  }
};
