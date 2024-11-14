import chalk from "chalk";
import figlet from "figlet";
import readlineSync from "readline-sync";
import { start } from "./server.js";
import { Player } from "./player.js";
import { Classmate } from "./classmates.js";
import * as images from "./ASCII.js";
import * as texts from "./texts.js";

/* classmate 이미지 배열 */
let mateImages = { ...images }; // 객체 복사본 만들고
delete mateImages["printMyRoom"]; // 내 방 이미지는 제거
mateImages = Object.values(mateImages); // 함수들만 담은 배열화

// 이벤트씬 그냥 패스하기 위한 깡통 함수
export const funcEnd = () => {
  return;
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

/* 장면전환 확인 */
const cutaway = () => {
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
  mateImages[stage - 1]();
  console.log(chalk.magentaBright(`=========================================\n`));
}

/* 대화창 (히든엔딩용) */
let isHidden = false; // 히든 엔딩 여부 구분
let dates = []; // 연인된 사람 모아둘 배열(아마 인덱스 값으로...?)
// 내 방 씬
async function simpleDisplayRoom(stage) {
  let whichDay = stage - 1;
  stage === undefined ? (whichDay = 5) : whichDay; // 게임 클리어 후 하교 씬 위해서 요일 기본 값 설정
  console.clear();
  console.log(chalk.magentaBright(`\n=============== 현재 상태 ===============`));
  console.log(chalk.cyanBright(`| ${weekdays[whichDay]} 밤 |`));
  console.log(chalk.magentaBright(`=========================================\n`));
  images.printMyRoom(); // 방 이미지
  console.log(chalk.magentaBright(`\n=========================================\n`));
}
// 학교 씬
async function simpleDisplaySchool(arr, texts) {
  for (const el of arr) {
    console.clear();
    console.log(chalk.magentaBright(`\n=============== 현재 상태 ===============`));
    console.log(chalk.cyanBright(`| 다음 날 |`));
    console.log(chalk.magentaBright(`=========================================\n`));
    mateImages[el]();
    console.log(chalk.magentaBright(`\n=========================================\n`));
    console.log(texts[el]);
    await cutaway();
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

/* 엔딩 */
export const EndCard = async function () {
  console.clear();
  console.log(chalk.magentaBright("=".repeat(50)));
  console.log(
    chalk.blueBright(
      figlet.textSync("The End", {
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
// 히든 엔딩 함수 - 게임광
let isGameEnd = false; // 게임 오버나 히든 엔딩 발생 체크 위함
const gameEnding = async function () {
  await simpleDisplaySchool([0, 1, 2, 3, 4], texts.gameEndingTexts);
  await eventScene(texts.gameEventTexts, 300, EndCard, EndCard);
};

/* 게임 시작 */
export async function startGame() {
  console.clear();
  const me = new Player();
  isHidden = false; // 히든 엔딩 여부 초기화
  isGameEnd = false; // 게임 중단 조건 초기화
  dates = []; // 연인 명수 초기화
  let stage = 1;
  await eventScene(texts.openingTexts, 300, funcEnd, start);
  while (stage <= 5) {
    const classmate = new Classmate(stage, me); // 플레이어의 스텟을 속성에 보관
    await myRoomScene(stage, me, classmate);
    if (isGameEnd) break; // 게임오버 또는 게임광엔딩 발동 시 스테이지 반복 탈출
    await eventScene(texts.goSchoolTexts, 300, funcEnd, funcEnd); // (추가할 것) 장면 전환 이벤트 텍스트
    if (isGameEnd) break;
    await schoolScene(stage, me, classmate);
    if (isGameEnd) break;
    await eventScene(texts.goHomeTexts, 300, funcEnd, start); // (추가할 것) 장면 전환 이벤트 텍스트
    if (isGameEnd) break;
    stage++;
  }
  if (isGameEnd === false) {
    simpleDisplayRoom();
    console.log(chalk.green(`\n정신 없었지만 나름 즐거웠던 개학 첫 주였다!`));
    console.log(chalk.green(`앞으로의 학교 생활이 너무 기대돼!`));
    await cutaway();
    dates.length >= 2 ? (isHidden = true) : isHidden;
    if (isHidden) {
      // 연인이 둘 이상이고, 게임광 조건 달성 안 됐으면 인기쟁이 엔딩
      await eventScene(texts.dateEventTexts, 300, funcEnd, funcEnd); // 주말에 데이트하기로 했다는 이벤트씬
      await simpleDisplaySchool(dates, texts.dateEndingTexts); // 연인 상태인 친구 둘이 각각 나와 의문을 표함
      await eventScene(texts.dateEventTexts, 300, funcEnd, funcEnd); // 곤란해졌으며 최종 선택해야한다는 이벤트씬
      let dateMate = 0;
      const select = () => {
        return new Promise((resolve) => {
          while (true) {
            const dateWho = readlineSync.question(`\n입력 : `);
            if (dates.includes(+dateWho - 1)) {
              dateMate = +dateWho - 1;
              resolve();
              break;
            }
            console.log(chalk.red("고백에 성공한 친구만 선택 가능합니다"));
          }
        });
      };
      const finalText = [...texts.selectTexts];
      console.clear();
      let textIdx = 1;
      console.log(chalk.green(`============${finalText[0]}============\n`));
      // for문으로 텍스트를 하나씩 출력
      for (; textIdx < finalText.length; textIdx++) {
        console.log(finalText[textIdx]);
        // 마지막 텍스트 나오면 구분선도 같이 출력
        if (textIdx === finalText.length - 1) {
          console.log(chalk.green(`\n============${finalText[0]}============`));
        }
      }
      await select();
      await simpleDisplaySchool([dateMate], texts.selectReactTexts);
      await eventScene(texts.selectEndingTexts, 300, EndCard, EndCard);
    } else {
      // 히든 엔딩 조건이 달성 안 된 경우 노말 엔딩
      await eventScene(texts.normalEventTexts, 300, EndCard, EndCard);
    }
  }
}

/* 내 방 장면 */
const myRoomScene = async (stage, player) => {
  let trainingCount = 4; // 훈련 최대 횟수는 네 번
  let cmdMessage = ""; // 능력치 변동 알려줄 문자열
  let isMoodZero = false; // 기분 저하 이벤트 발동 여부
  while (trainingCount > 0) {
    displayMyRoom(stage, player);
    console.log(chalk.redBright(`\n${cmdMessage}`));
    console.log(chalk.green(`\n뭘 하며 시간을 보낼까? 남은 행동 포인트 : ${trainingCount}`));
    console.log(chalk.green(`1. 책 읽기 2. 운동하기 3. 게임하기`));
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
    // 도중에 기분이 0 이하가 되거나 게임실력이 200 이상이 된 경우 씬 강제 전환
    if (player.mood <= 0) {
      isMoodZero = true;
      break;
    } else if (player.gameSkills >= 120) {
      break;
    }
  }
  /* 내방 씬 종료 */
  if (isMoodZero) {
    // 기분 저하 이벤트 발생 시
    displayMyRoom(stage, player);
    console.log(chalk.redBright(`\n${cmdMessage}`));
    console.log(chalk.green(`\n하루 종일 게임도 못 하고 이게 뭐람...`));
    console.log(chalk.green(`잠이나 자야겠다...`));
    await cutaway();
    await eventScene(texts.moodZeroTexts, 300, funcEnd, funcEnd); // 기분 스텟이 0이 되어 자버린다는 텍스트
    player.mood = 1; // 기분을 1로 회복시켜줌
  } else if (player.gameSkills >= 120) {
    // 게임 실력 스텟 120 달성 시 히든 엔딩 오픈
    isGameEnd = true; // 스테이지 반복문 탈출 알려주기 위함
    simpleDisplayRoom(stage);
    console.log(chalk.green(`\n이렇게 게임만 해도 괜찮은 걸까?`));
    console.log(chalk.green(`그래도 요 며칠 실력이 엄청 는 것 같다!`));
    await cutaway();
    await eventScene(texts.goSchoolTexts, 300, gameEnding, gameEnding); // 히든 엔딩으로 이동
  } else {
    // 정상적으로 훈련 포인트 소모 시
    displayMyRoom(stage, player);
    console.log(chalk.redBright(`\n${cmdMessage}`));
    console.log(chalk.green(`\n오늘은 이만하면 됐다! 이제 내일을 위해 자볼까?`));
    await cutaway();
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
      displaySchool(stage, player, classmate, countBreakTime);
      console.log(chalk.redBright(`\n${cmdMessage}`));
      console.log(
        chalk.green(`\n점심을 먹고 교실로 돌아오는데 ${classmate.name[stage - 1]}를(을) 만났다!`),
      );
      console.log(chalk.green(`어... 어쩌지?!`));
      await cutaway();
      await eventScene(texts.lunchEventTexts, 300, confiUp, confiDown);
      // 점심시간 이벤트로 자신감이 0보다 작아지면 게임오버
      if (player.confidence <= 0) {
        isGameEnd = true; // 스테이지 반복문 탈출 알려주기 위함
        await eventScene(texts.gameOverTexts, 300, gameOver, gameOver);
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
    // 고백 성공, 고백 대실패, 자신감 0, 친밀도 0인 경우 강제 화면 전환
    if (
      classmate.isDate ||
      classmate.isFailConfess ||
      player.confidence <= 0 ||
      classmate.closeness <= 0
    ) {
      break;
    }
  }
  /* 교실 씬 종료 */
  if (classmate.isDate) {
    // 고백 성공 시 연인 이벤트 후 교실 씬 스킵
    dates.push(stage - 1); // dates 배열에 연인 된 사람 인덱스 값 넣음
    await eventScene(texts.successTexts, 300, funcEnd, start);
  } else if (classmate.isFailConfess) {
    // 고백 실패시 20% 확률로 게임 오버
    isGameEnd = true; // 스테이지 반복문 탈출 알려주기 위함
    await eventScene(texts.failTexts, 300, gameOver, gameOver);
  } else if (player.confidence <= 0 || classmate.closeness <= 0) {
    // 자신감 또는 친밀도가 0 이하면 게임 오버
    isGameEnd = true; // 스테이지 반복문 탈출 알려주기 위함
    displaySchool(stage, player, classmate, countBreakTime);
    console.log(chalk.redBright(`\n${cmdMessage}`));
    console.log(
      chalk.green(`\n역시 ${classmate.name[stage - 1]} 같은 아이가 나를 좋아해줄리 없어...`),
    );
    console.log(chalk.green(`학교 더 이상 다니고 싶지 않아...`));
    await cutaway();
    await eventScene(texts.gameOverTexts, 300, gameOver, gameOver);
  } else if (classmate.closeness < 80) {
    // 교실 씬이 끝났는데 친밀도가 80 미만이면 게임 오버
    isGameEnd = true; // 스테이지 반복문 탈출 알려주기 위함
    displaySchool(stage, player, classmate, countBreakTime);
    console.log(chalk.redBright(`\n${cmdMessage}`));
    console.log(chalk.green(`\n${classmate.name[stage - 1]}와(과) 친해지는 데 실패했다...`));
    console.log(chalk.green(`학교 더 이상 다니고 싶지 않아...`));
    await cutaway();
    await eventScene(texts.gameOverTexts, 300, gameOver, gameOver);
  } else {
    // 스테이지 클리어시 자신감 20, 기분 2 회복
    player.confidence += 20;
    player.mood += 2;
    displaySchool(stage, player, classmate, countBreakTime);
    console.log(chalk.redBright(`\n${cmdMessage}`));
    console.log(chalk.green(`\n${classmate.name[stage - 1]}와(과) 친구가 됐다!!`));
    console.log(chalk.green(`집에 가볼까~`));
    await cutaway();
  }
};
