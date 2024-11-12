import chalk from "chalk";
import readlineSync from "readline-sync";

export class Classmate {
  constructor(stage) {
    this.name = ["김지우", "박유빈", "송가을", "이세원", "이규민"];
    this.stage = stage;
    /* 친밀도 */
    this.closeness = 60 - stage * 10;
    /* 연인 여부 */
    this.isDate = false;
  }
  /* 상호작용 반응 */
  isTalk() {
    console.log(chalk.green(`대화 주제를 선택하세요!`));
    console.log(chalk.green(`1. 나 2. ${this.name[this.stage - 1]} 3. 게임`));
    const topics = readlineSync.question("입력 : ");
    switch (topics) {
      case "1":
        this.closeness += 5;
        break;
      case "2":
        this.closeness += 10;
        break;
      case "3":
        this.closeness -= 5;
        break;
      default:
        console.log(chalk.red("1,2,3만 입력 가능합니다"));
        this.isTalk();
        break;
    }
  }
  isJoke() {}
  isConfess() {}
  isEscape() {}
  /* 점심시간 이벤트 */
  encounter() {}
}
