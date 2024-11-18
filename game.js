import chalk from "chalk";
import figlet from "figlet";
import readlineSync from "readline-sync";
import { me, stage, start, dates } from "./lobby.js";
import { Classmate } from "./classmates.js";
import { funcEnd, shutDown, cutaway, inputWaiting, eventScene, goLobby } from "./func.js";
import { displayMyRoom, whichBranch_myRoom, doTraining } from "./myRoom.js";
import { displaySchool, displayForEnding, whichBranch_school, interactClassmate, mateImages } from "./classroom.js";
import * as texts from "./texts.js";

/* 변수 모음 */
export const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]; // 요일 표현
export let isOver = { 0: false }; // startGame 중단 여부
export let sceneLines = { 0: "" }; // 능력치 변동 또는 classmate 반응 알려줄 대사창
export let isFailConfess = { 0: false }; // 고백 실패 엔딩 여부
export let isLobby = { 0: false }; // 로비로 여부
let isKingka = false; // 인기쟁 엔딩 여부
let dateMate = 0; // 최종선택 친구 인덱스값 담을 변수

/* 게임 종료 타이틀 */
// 게임오버일때
const gameOverTitle = chalk.redBright(
  figlet.textSync("Game Over", {
    font: "Slant",
    horizontalLayout: "default",
    verticalLayout: "default",
  }),
);
// 무사히 엔딩 봤을 때
const endCardTitle = chalk.blueBright(
  figlet.textSync("The End", {
    font: "Slant",
    horizontalLayout: "default",
    verticalLayout: "default",
  }),
);
// 재시작 또는 게임종료 선택
export const endScene = (title) => {
  console.clear();
  console.log(chalk.magentaBright("=".repeat(50)));
  console.log("\n" + title);
  console.log("\n[ 1. 재시작 ] [ 2. 게임 종료 ]");
  console.log(chalk.magentaBright("=".repeat(50)));
  console.log(chalk.gray("\n1 또는 2를 입력하고 엔터를 누르세요."));
  isOver[0] = true;
  inputWaiting(start, shutDown);
  return;
};

/* 게임광 엔딩 */
const gameEnding = async function () {
  await eventScene(texts.goSchoolTexts, 300, funcEnd, funcEnd);
  await displayForEnding([0, 1, 2, 3, 4], texts.gameEndingLines, 0);
  await eventScene(texts.gameEndingTexts, 300, endScene, endScene, endCardTitle, endCardTitle);
};
/* 최종선택 화면 */
const selectScene = () => {
  return new Promise((resolve) => {
    while (true) {
      const dateWho = readlineSync.question(`\n입력 : `);
      if (dates[0].includes(+dateWho - 1)) {
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
  await displayForEnding(dates[0], texts.dateEndingTexts, 1); // 연인 상태인 친구들이 각각 나와 의문을 표함
  await eventScene(texts.needSelectTexts, 300, funcEnd, funcEnd); // 곤란해졌으며 최종 선택해야한다는 이벤트씬
  console.clear();
  console.log(chalk.green(`============${select_texts[0]}============\n`));
  for (let txt of select_texts.slice(1)) {
    console.log(txt);
  }
  console.log(chalk.green(`\n============${select_texts[0]}============`));
  await selectScene(); // 최종 선택
  await displayForEnding([dateMate], texts.selectReactTexts, 0); // 선택한 인물 최종 대사
  await eventScene(texts.selectEndingTexts, 300, endScene, endScene, endCardTitle, endCardTitle);
};

/* 게임 시작 */
export async function startGame() {
  console.clear();
  // 변수 초기화
  isLobby[0] = false;
  isKingka = false;
  isFailConfess[0] = false;
  // 새 게임일 때마다 오프닝
  if (stage[0] === 1) {
    await eventScene(texts.openingTexts, 300, funcEnd, goLobby);
  }
  // 스테이지 진입 (게임오버, 엔딩조건 달성, 로비로 시 반복문 탈출)
  while (stage[0] <= 5) {
    if (isOver[0] || isLobby[0]) break;
    const classmate = new Classmate(stage[0], me[0]);
    await myRoomScene(stage[0], me[0]);
    if (isOver[0]) break;
    await eventScene(texts.goSchoolTexts, 300, funcEnd, funcEnd);
    if (isOver[0]) break;
    await classroomScene(stage[0], me[0], classmate);
    if (isOver[0]) break;
    stage[0] += 1; // 계속하기 시 스테이지 유지 위한 위치
    await eventScene(texts.goHomeTexts, 300, funcEnd, goLobby);
    if (isOver[0] || isLobby[0]) break;
  }
  // 로비로 이동
  if (isLobby[0]) {
    start();
    return;
  } else if (isOver[0]) {
    // 게임광 엔딩
    if (me[0].gameSkills >= 100) {
      gameEnding();
      return;
    } else {
      // 고백 실패 엔딩
      if (isFailConfess[0]) {
        await eventScene(texts.failTexts, 300, endScene, endScene, gameOverTitle, gameOverTitle);
        return;
      } else {
        // 게임 오버
        await eventScene(texts.gameOverTexts, 300, endScene, endScene, gameOverTitle, gameOverTitle);
        return;
      }
    }
  } else {
    // 노말엔딩 및 인기쟁 엔딩 공통 화면
    displayMyRoom(6, me[0], true);
    console.log(chalk.green(`\n정신 없었지만 나름 즐거웠던 개학 첫 주였다!`));
    console.log(chalk.green(`앞으로의 학교 생활이 너무 기대돼!\n`));
    await cutaway();
    // 엔딩 분기 확인
    isKingka = dates[0].length >= 2 ? true : false;
    if (isKingka) {
      // 인기쟁 엔딩
      kingkaEnding();
      return;
    } else {
      // 노말 엔딩
      await eventScene(texts.normalEndingTexts, 300, endScene, endScene, endCardTitle, endCardTitle); // 노말 엔딩
      return;
    }
  }
}

/* 내 방 장면 */
const myRoomScene = async (stage, player) => {
  // 변수 초기화
  let trainingCount = 4;
  let isMoodZero = false;
  sceneLines = { 0: "" };
  // 훈련 진입
  while (trainingCount > 0) {
    displayMyRoom(stage, player, false);
    console.log(chalk.redBright(`\n${sceneLines[0]}`));
    console.log(chalk.green(`뭘 하며 시간을 보낼까? `) + chalk.blueBright(`[남은 행동 포인트 : ${trainingCount}]`));
    console.log(chalk.green(`1. 책 읽기 2. 운동하기 3. 게임하기\n`));
    // 플레이어의 선택에 따른 훈련 실행 및 결과 처리
    await doTraining(player);
    trainingCount--;
    // 기분 전부 소모하거나 게임광 엔딩 조건 달성시 반복문 탈출
    if (player.mood <= 0) {
      isMoodZero = true;
      break;
    } else if (player.gameSkills >= 100) {
      break;
    }
  }
  /* 내방 장면 결과 분기 */
  if (isMoodZero) {
    // 기분 저하 이벤트
    whichBranch_myRoom(stage, player, false, texts.moodZeroLine);
    await eventScene(texts.moodZeroTexts, 300, funcEnd, funcEnd);
    player.mood += 1; // 다음 내 방 씬 스킵 방지 위해 기분을 1 회복시켜줌
  } else if (player.gameSkills >= 100) {
    // 게임광 엔딩 진입
    whichBranch_myRoom(stage, player, true, texts.gameEndingLine);
  } else {
    // 정상 진행
    whichBranch_myRoom(stage, player, false, texts.endMyRoomLine);
  }
};

/* 교실 장면 */
const classroomScene = async (stage, player, classmate) => {
  // 변수 초기화
  let countBreakTime = 1;
  sceneLines = { 0: texts.greetTexts[stage - 1] }; // 캐릭별 기본 대사
  // 상호작용 진입
  while (countBreakTime < 7) {
    // 고백 성공 또는 게임오버 조건 달성 시 반복문 탈출
    if (classmate.isDate) {
      classmate.isIncrease = true;
      break;
    } else if (isFailConfess[0] || player.confidence <= 0 || classmate.closeness <= 0) {
      classmate.isIncrease = false;
      break;
    }
    // 점심시간 인카운터, 선택에 따라 자신감이 20 증감
    if (countBreakTime === 4) {
      whichBranch_school(stage, player, classmate, countBreakTime, false, texts.lunchEventLine);
      await eventScene(texts.lunchTexts[stage - 1], 300, player.lunchEvent.bind(player), player.lunchEvent.bind(player), true, false);
      if (player.encounterResult) {
        await displayForEnding([stage - 1], texts.confiUpLines, 0);
      } else {
        await displayForEnding([stage - 1], texts.confiDownLines, 1);
      }
      // 인카운터 결과로 게임오버 조건 달성 시 반복문 탈출
      if (player.confidence <= 0) break;
    }
    displaySchool(stage, player, classmate, countBreakTime);
    // 상호작용에 긍정적 반응이면 파랑 글씨, 부정적 반응이면 빨강 글씨
    if (classmate.isIncrease) {
      console.log(chalk.cyanBright(`\n${sceneLines[0]}`));
    } else {
      console.log(chalk.redBright(`\n${sceneLines[0]}`));
    }
    console.log(chalk.green(`${classmate.name[stage - 1]}와(과) 마주쳤다! 어쩌면 좋지? `) + chalk.blue(`[남은 교시 : ${7 - countBreakTime}]`));
    console.log(chalk.green(`1. 대화한다 2. 장난친다 3. 고백한다 4. 도망친다\n`));
    // 플레이어의 선택에 따른 상호작용 결과 처리
    await interactClassmate(stage, classmate, texts);
    countBreakTime++;
  }
  /* 교실 장면 결과 분기 */
  if (classmate.isDate) {
    // 고백 성공 시
    player.mood += 2;
    whichBranch_school(stage, player, classmate, countBreakTime, false, texts.successLine);
    dates[0].push(stage - 1); // dates 배열에 연인 된 사람 인덱스 값 넣음
    await eventScene(texts.successTexts, 300, funcEnd, start);
  } else if (isFailConfess[0]) {
    // 고백 실패 시 20% 확률로 게임 오버
    whichBranch_school(stage, player, classmate, countBreakTime, true, texts.failLine);
  } else if (player.confidence <= 0 || classmate.closeness <= 0) {
    // 자신감 또는 친밀도가 0 이하면 게임 오버
    whichBranch_school(stage, player, classmate, countBreakTime, true, texts.confiZeroLine);
  } else if (classmate.closeness < 80) {
    // 교실 씬이 끝났는데 친밀도가 80 미만이면 게임 오버
    whichBranch_school(stage, player, classmate, countBreakTime, true, texts.lowClosenessLine);
  } else {
    // 스테이지 클리어시 자신감 30, 기분 2 회복
    player.confidence += 30;
    player.mood += 2;
    whichBranch_school(stage, player, classmate, countBreakTime, false, texts.endClassroomLine);
  }
};
