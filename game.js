import chalk from "chalk";
import readlineSync from "readline-sync";
/* 플레이어, 몬스터, 함수 모듈 분리 */
import { Player } from "./player.js";
import { Classmate } from "./classmates.js";
import * as funcs from "./func_for_stages.js";

function displayStatus(stage, player, classmate) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| 플레이어 정보`) +
      chalk.redBright(`| 몬스터 정보 |`),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, classmate) => {
  let logs = [];

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, classmate);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다.`));
    const choice = readlineSync.question("당신의 선택은? ");

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
  }
};

export async function startGame() {
  console.clear();
  const me = new Player();
  let stage = 1;

  while (stage <= 5) {
    const classmate = new Classmate(stage);
    await battle(stage, me, classmate);

    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }
}
