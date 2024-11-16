import chalk from "chalk";
import readlineSync from "readline-sync";
import * as images from "./ASCII.js";
import { weekdays, sceneLines, isOver } from "./game.js";
import { cutaway } from "./func.js";

/* classmate 이미지 배열 */
export let mateImages = { ...images }; // 객체 복사본 만들고
delete mateImages["printMyRoom"]; // 내 방 이미지는 제거
mateImages = Object.values(mateImages); // 함수들만 담은 배열화

/* 교실 씬 UI */
export const displaySchool = function (stage, player, classmate, period) {
  let isNoon = "오전";
  period = period < 6 ? period : 6;
  period >= 4 ? (isNoon = "오후") : isNoon;
  console.clear();
  console.log(chalk.magentaBright(`\n=============== 현재 상태 ===============`));
  console.log(
    chalk.cyanBright(`| ${weekdays[stage]} ${isNoon} ${period}교시 쉬는 시간 |\n`) +
      chalk.blueBright(`| 나의 자신감: ${player.confidence} |\n`) +
      chalk.blueBright(`| 말솜씨: ${player.talkSkills} | 매력: ${player.charms} | 게임실력: ${player.gameSkills} |\n`) +
      chalk.redBright(`| ${classmate.name[stage - 1]}의 현재 친밀도 : ${classmate.closeness} |\n`),
  );
  // 친구 이미지
  mateImages[stage - 1]();
  console.log(chalk.magentaBright(`=========================================`));
};

/* 히든엔딩 씬 UI */
export const displayForEnding = async function (arr, textsArr, color) {
  for (const el of arr) {
    console.clear();
    console.log(chalk.magentaBright(`=========================================\n`));
    mateImages[el]();
    console.log(chalk.magentaBright(`\n=========================================\n`));
    if (color === 0) {
      console.log(chalk.cyanBright(textsArr[el] + "\n"));
    } else if (color === 1) {
      console.log(chalk.redBright(textsArr[el] + "\n"));
    }
    await cutaway();
  }
};

/* 교실 씬 분기 구분 함수 */
export const whichBranch_school = async function (stage, player, classmate, countBreakTime, bool, textsArr) {
  // 장면 이미지 보여주고
  displaySchool(stage, player, classmate, countBreakTime);
  // 상호작용에 긍정적 반응이면 파랑 글씨, 부정적 반응이면 빨강 글씨
  if (classmate.isIncrease) {
    console.log(chalk.cyanBright(`\n${sceneLines[0]}`));
  } else {
    console.log(chalk.redBright(`\n${sceneLines[0]}`));
  }
  // 분기 변경을 위해 isOver 값을 조정
  isOver[0] = bool;
  for (let txt of textsArr) {
    console.log(chalk.green(`${txt}`)); // 대사 출력
  }
  await cutaway(); // 입력 대기
};

/* 상호작용 함수 */
export const interactClassmate = (stage, classmate, textsArr) => {
  return new Promise((resolve) => {
    const input_interaction = readlineSync.question("입력 : ");
    switch (input_interaction) {
      case "1":
        classmate.talk();
        classmate.isIncrease ? (sceneLines[0] = textsArr.talkGoodReation[stage - 1]) : (sceneLines[0] = textsArr.talkBadReation[stage - 1]);
        resolve();
        break;
      case "2":
        classmate.joke();
        classmate.isIncrease ? (sceneLines[0] = textsArr.jokeGoodReation[stage - 1]) : (sceneLines[0] = textsArr.jokeBadReation[stage - 1]);
        resolve();
        break;
      case "3":
        classmate.confess();
        classmate.isDate ? (sceneLines[0] = textsArr.confessGoodReation[stage - 1]) : (sceneLines[0] = textsArr.confessBadReation[stage - 1]);
        resolve();
        break;
      case "4":
        classmate.escape();
        classmate.isIncrease ? (sceneLines[0] = textsArr.escapeGoodReation[stage - 1]) : (sceneLines[0] = textsArr.escapeBadReation[stage - 1]);
        resolve();
        break;
      default:
        console.log(chalk.red("1,2,3,4만 입력 가능합니다"));
        interactClassmate(stage, classmate, textsArr);
        break;
    }
  });
};
