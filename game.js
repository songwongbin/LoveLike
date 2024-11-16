import chalk from "chalk";
import figlet from "figlet";
import readlineSync from "readline-sync";
import { start } from "./server.js";
import { Player } from "./player.js";
import { Classmate } from "./classmates.js";
import { funcEnd, shutDown, cutaway, inputWaiting, eventScene } from "./func.js";
import { displayMyRoom, whichBranch_myRoom, doTraining } from "./myRoom.js";
import { displaySchool, displayForEnding, whichBranch_school, interactClassmate } from "./classroom.js";
import * as texts from "./texts.js";

/* 변수 모음 */
export const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]; // 요일 표현
export let isOver = { 0: false }; // 게임 오버나 게임광 엔딩 발생 체크 위함
export let sceneLines = { 0: "" }; // 능력치 변동 또는 classmate 반응 알려줄 대사창
export let isFailConfess = { 0: false }; // 고백 실패 엔딩 체크
let isKingka = false; // 인기쟁 엔딩 여부 구분
let dates = []; // 연인된 사람 모아둘 배열 (인덱스 값으로)
let dateMate = 0; // 최종선택 친구 인덱스값 담을 변수

/* 게임 끝 타이틀 화면 */
const gameOverTitle = chalk.redBright(
  // 게임오버일때 띄울 타이틀
  figlet.textSync("Game Over", {
    font: "Slant",
    horizontalLayout: "default",
    verticalLayout: "default",
  }),
);
const endCardTitle = chalk.blueBright(
  // 무사히 엔딩 봤을 때 띄울 타이틀
  figlet.textSync("The End", {
    font: "Slant",
    horizontalLayout: "default",
    verticalLayout: "default",
  }),
);
export const endScene = (title) => {
  console.clear();
  console.log(chalk.magentaBright("=".repeat(50)));
  console.log(title);
  console.log(chalk.magentaBright("=".repeat(50)));
  console.log("\n[1. 재시작] [2. 게임 종료]");
  inputWaiting(start, shutDown);
};

/* 게임광 엔딩 */
const gameEnding = async function () {
  await eventScene(texts.goSchoolTexts, 300, funcEnd, funcEnd);
  await displayForEnding([0, 1, 2, 3, 4], texts.gameEndingTexts);
  await eventScene(texts.gameEventTexts, 300, endScene, endScene, endCardTitle, endCardTitle);
};

/* 최종선택 함수 */
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
/* 인기쟁이 엔딩 */
const kingkaEnding = async function () {
  let select_texts = [...texts.selectTexts];
  await eventScene(texts.dateEventTexts, 300, funcEnd, funcEnd); // 주말에 데이트하기로 했다는 이벤트씬
  await displayForEnding(dates, texts.dateEndingTexts); // 연인 상태인 친구 둘이 각각 나와 의문을 표함
  await eventScene(texts.dateEventTexts, 300, funcEnd, funcEnd); // 곤란해졌으며 최종 선택해야한다는 이벤트씬
  console.clear();
  console.log(chalk.green(`============${select_texts[0]}============\n`));
  for (let txt of select_texts.slice(1)) {
    console.log(txt);
  }
  console.log(chalk.green(`\n============${select_texts[0]}============`));
  await select(); // 최종 선택
  await displayForEnding([dateMate], texts.selectReactTexts); // 선택한 인물 최종 대사
  await eventScene(texts.selectEndingTexts, 300, endScene, endScene, endCardTitle, endCardTitle);
};

/* 게임 시작 */
export async function startGame() {
  console.clear();
  const me = new Player();
  isKingka = false; // 인기쟁 엔딩 여부 초기화
  isOver[0] = false; // 게임 중단 조건 초기화
  dates = []; // 연인 명수 초기화
  isFailConfess[0] = false; // 고백 실패 엔딩 여부 초기화
  let stage = 1;
  await eventScene(texts.openingTexts, 300, funcEnd, start);

  while (stage <= 5) {
    if (isOver[0]) break;
    const classmate = new Classmate(stage, me);
    await myRoomScene(stage, me);
    if (isOver[0]) break; // 게임오버 또는 게임광엔딩 발동 시 스테이지 반복 탈출
    await eventScene(texts.goSchoolTexts, 300, funcEnd, funcEnd);
    if (isOver[0]) break;
    await schoolScene(stage, me, classmate);
    if (isOver[0]) break;
    await eventScene(texts.goHomeTexts, 300, funcEnd, start);
    if (isOver[0]) break;
    stage++;
  }

  if (isOver[0]) {
    if (me.gameSkills >= 100) {
      gameEnding(); // 게임광 엔딩이면 게임광 엔딩 실행
      return;
    } else {
      if (isFailConfess[0]) {
        await eventScene(texts.failTexts, 300, endScene, endScene, gameOverTitle, gameOverTitle); // 고백 실패면 고백실패 오버
        return;
      } else {
        await eventScene(texts.gameOverTexts, 300, endScene, endScene, gameOverTitle, gameOverTitle); // 그냥 게임오버
        return;
      }
    }
  } else {
    // 모든 스테이지 클리어 후 귀가 (금요일밤)
    displayMyRoom(6, me, true);
    console.log(chalk.green(`\n정신 없었지만 나름 즐거웠던 개학 첫 주였다!`));
    console.log(chalk.green(`앞으로의 학교 생활이 너무 기대돼!\n`));
    await cutaway();
    // 노말 엔딩인지 인기쟁이 엔딩인지 확인
    isKingka = dates.length >= 2 ? true : false;
    if (isKingka) {
      kingkaEnding(); // 연인이 둘 이상이고, 게임광 조건 달성 안 됐으면 인기쟁이 엔딩
      return;
    } else {
      await eventScene(texts.normalEventTexts, 300, endScene, endScene, endCardTitle, endCardTitle); // 노말 엔딩
      return;
    }
  }
}

/* 내 방 장면 */
const myRoomScene = async (stage, player) => {
  let trainingCount = 4; // 훈련 최대 횟수는 네 번
  let isMoodZero = false; // 기분 저하 이벤트 발동 여부
  sceneLines = { 0: "" }; // 대사창 초기화
  while (trainingCount > 0) {
    displayMyRoom(stage, player, false);
    console.log(chalk.redBright(`\n${sceneLines[0]}`));
    console.log(chalk.green(`뭘 하며 시간을 보낼까? 남은 행동 포인트 : ${trainingCount}`));
    console.log(chalk.green(`1. 책 읽기 2. 운동하기 3. 게임하기\n`));
    // 플레이어의 선택에 따른 훈련 실행 및 결과 처리
    await doTraining(player);
    trainingCount--;
    // 도중에 기분이 0 이하가 되거나 게임실력이 200 이상이 된 경우 씬 강제 전환
    if (player.mood <= 0) {
      isMoodZero = true;
      break;
    } else if (player.gameSkills >= 100) {
      break;
    }
  }
  /* 내방 씬 종료 이후 */
  if (isMoodZero) {
    whichBranch_myRoom(stage, player, false, texts.moodZeroLine); // 기분저하 이벤트
    await eventScene(texts.moodZeroTexts, 300, funcEnd, funcEnd);
    player.mood = 1; // 다음 내 방 씬 스킵될 수 있으니 기분을 1로 회복시켜줌
  } else if (player.gameSkills >= 100) {
    whichBranch_myRoom(stage, player, true, texts.gameEndingLine); // 게임광 히든엔딩
  } else {
    whichBranch_myRoom(stage, player, false, texts.endMyRoomLine); // 정상 진행
  }
};

/* 교실 장면 */
const schoolScene = async (stage, player, classmate) => {
  let countBreakTime = 1; // 쉬는 시간은 여섯 번
  sceneLines = { 0: "" }; // 내 행동에 따른 친구의 반응 출력할 문자열
  while (countBreakTime < 7) {
    // 점심시간 이벤트, 선택에 따라 자신감이 20 증가하거나 감소함
    if (countBreakTime === 4) {
      whichBranch_school(stage, player, classmate, countBreakTime, false, texts.lunchEventLine);
      await eventScene(texts.lunchEventTexts, 300, player.lunchEvent.bind(player), player.lunchEvent.bind(player), true, false);
      // 점심시간 이벤트로 자신감이 0보다 작아지면 강제 화면 전환
      if (player.confidence <= 0) break;
    }
    displaySchool(stage, player, classmate, countBreakTime);
    console.log(chalk.redBright(`\n${sceneLines[0]}`));
    console.log(chalk.green(`${classmate.name[stage - 1]}와(과) 마주쳤다! 어쩌면 좋지? 남은 교시 : ${7 - countBreakTime}`));
    console.log(chalk.green(`1. 대화한다 2. 장난친다 3. 고백한다 4. 도망친다\n`));
    // 플레이어의 선택에 따른 상호작용 결과 처리
    await interactClassmate(stage, classmate, texts);
    countBreakTime++;
    // 고백 성공, 고백 대실패, 자신감 0, 친밀도 0인 경우 강제 화면 전환
    if (classmate.isDate || isFailConfess[0] || player.confidence <= 0 || classmate.closeness <= 0) {
      break;
    }
  }
  /* 교실 씬 종료 */
  if (classmate.isDate) {
    // 고백 성공 시 연인 이벤트 후 교실 씬 스킵
    dates.push(stage - 1); // dates 배열에 연인 된 사람 인덱스 값 넣음
    await eventScene(texts.successTexts, 300, funcEnd, start);
  } else if (isFailConfess[0]) {
    // 고백 실패시 20% 확률로 게임 오버
    isOver[0] = true; // 스테이지 반복문 탈출 알려주기 위함
  } else if (player.confidence <= 0 || classmate.closeness <= 0) {
    // 자신감 또는 친밀도가 0 이하면 게임 오버
    whichBranch_school(stage, player, classmate, countBreakTime, true, texts.confiZeroLine);
  } else if (classmate.closeness < 80) {
    // 교실 씬이 끝났는데 친밀도가 80 미만이면 게임 오버
    whichBranch_school(stage, player, classmate, countBreakTime, true, texts.lowClosenessLine);
  } else {
    // 스테이지 클리어시 자신감 20, 기분 2 회복
    player.confidence += 20;
    player.mood += 2;
    whichBranch_school(stage, player, classmate, countBreakTime, false, texts.endClassroomLine);
  }
};
