import chalk from "chalk";
import readlineSync from "readline-sync";
import { weekdays, sceneLines, isOver } from "./game.js";
import { cutaway } from "./func.js";
import * as images from "./ASCII.js";

/* 내방 씬 스테이터스 */
const showMyStatus = (player) => {
  console.log(chalk.blueBright(`| 나의 기분: ${player.mood} |`));
  console.log(chalk.blueBright(`| 말솜씨: ${player.talkSkills} | 매력: ${player.charms} | 게임실력: ${player.gameSkills} |`));
};
/* 내방 씬 UI */
export const displayMyRoom = function (stage, player, isEnd) {
  console.clear();
  console.log(chalk.magentaBright(`\n=============== < 현재 상태 > ===============`));
  console.log(chalk.cyanBright(`| ${weekdays[stage - 1]} 밤 |`));
  if (isEnd === false) {
    showMyStatus(player);
  }
  console.log(chalk.magentaBright(`=============== < 현재 상태 > ===============\n`));
  images.printMyRoom(); // 방 이미지
  console.log(chalk.magentaBright(`=============================================`));
};

/* 내방 분기 구분 함수 */
export const whichBranch_myRoom = async function (stage, player, bool, textsArr) {
  // 장면 이미지 보여주고
  displayMyRoom(stage, player, bool);
  // 인자로 받은 값이 false면 cmd메세지보여주고, true면 isOver 값을 바꿔 분기 변경
  !bool ? console.log(chalk.redBright(`\n${sceneLines[0]}`)) : (isOver[0] = true);
  for (let txt of textsArr) {
    console.log(chalk.green(`${txt}`)); // 대사 출력
  }
  await cutaway(); // 입력 대기
};

/* 훈련하기 함수 */
export const doTraining = (player) => {
  return new Promise((resolve) => {
    const input_training = readlineSync.question("입력 : ");
    switch (input_training) {
      case "1":
        player.readBooks();
        sceneLines[0] = `말솜씨가 10 오르고, 매력이 5 올랐다!`;
        resolve();
        break;
      case "2":
        player.workOut();
        sceneLines[0] = `말솜씨가 5 오르고, 매력이 10 올랐다!`;
        resolve();
        break;
      case "3":
        player.playGames();
        sceneLines[0] = `게임실력이 20 올랐지만 나머지가 7 감소했다...`;
        resolve();
        break;
      default:
        console.log(chalk.red(`1,2,3만 입력 가능합니다`));
        doTraining(player);
        break;
    }
  });
};
