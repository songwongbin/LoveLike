import chalk from "chalk";
import figlet from "figlet";
import readlineSync from "readline-sync";
import { Player } from "./player.js";
import { startGame, isOver } from "./game.js";

export let me = {};
export let stage = {};
export let dates = { 0: [] }; // 연인된 사람 모아둘 배열 (인덱스 값으로)

// 로비 화면을 출력하는 함수
function displayLobby() {
  console.clear();

  // 타이틀 텍스트
  console.log(
    chalk.rgb(
      255,
      105,
      180,
    )(
      figlet.textSync("Love Like", {
        font: "Slant",
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
    ),
  );

  // 상단 경계선
  const line = chalk.magentaBright("=".repeat(50));
  console.log(line);

  // 게임 이름
  console.log(chalk.whiteBright.bold("\n취미라곤 게임 뿐인 내가 도내 최강 인기인?!\n"));

  // 옵션들
  console.log(chalk.cyanBright("1.") + chalk.white(" 새 게임 "));
  console.log(chalk.cyanBright("2.") + chalk.white(" 계속하기 "));
  console.log(chalk.cyanBright("3.") + chalk.white(" 나가기 \n"));

  // 하단 경계선
  console.log(line);

  // 하단 설명
  console.log(chalk.gray("1,2,3 중 하나를 입력하고 엔터를 누르세요."));
}

// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
  const choice = readlineSync.question("입력: ");
  switch (choice) {
    case "1":
      me[0] = new Player(); // 플레이어 초기화
      stage[0] = 1; // 스테이지 초기화
      isOver[0] = false; // 게임 중단 조건 초기화
      dates[0] = []; // 연인 명수 초기화
      startGame();
      break;
    case "2":
      if (isOver[0] || me[0] === undefined || stage[0] === undefined) {
        console.log(chalk.red("진행 중인 게임이 없습니다"));
        handleUserInput();
      } else {
        startGame();
      }
      break;
    case "3":
      process.exit(0); // 게임 종료
    default:
      console.log(chalk.red("올바른 선택을 하세요."));
      handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
  }
}

// 게임 시작 함수
export function start() {
  displayLobby();
  handleUserInput();
}

// 게임 실행
start();
