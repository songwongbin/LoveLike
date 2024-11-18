import chalk from "chalk";
import readlineSync from "readline-sync";
import { isFailConfess } from "./game.js";

export class Classmate {
  constructor(stage, player) {
    this.name = ["김지우", "박유빈", "송가을", "이세원", "이규민"];
    this.stage = stage; // 현재 스테이지 정보
    this.closeness = 60 - stage * 10; // 기본 친밀도 (= 몬스터 체력) (스테이지 오를수록 낮아짐)
    this.isDate = false; // 연인 여부 체크
    this.isIncrease = true; // 상호작용에 따른 친밀도 증감 체크
    this.isFailConfess = false; // 고백 실패 중 게임오버 조건 발동 체크
    this.player = player; // 플레이어 스테이터스 참고
  }
  /* 대화하기 */
  talk() {
    // 변수 초기화
    this.isIncrease = true;
    let num = 0;
    // 대화 소재 선택 대기
    console.log(chalk.green(`대화 주제를 선택하세요!`));
    console.log(chalk.green(`1. 나 2. ${this.name[this.stage - 1]} 3. 게임`));
    const topics = readlineSync.question("입력 : ");
    // 선택에 따른 결과 처리
    switch (topics) {
      case "1": // 화제 = "나"
        if (this.stage === 1 || this.stage === 3) {
          num = 7; // 지우, 가을은 나한테 관심 있어서 크게 증가
        } else if (this.stage === 4 || this.stage === 5) {
          num = -5; // 세원, 규민은 나한테 관심 없어서 감소
          this.isIncrease = false;
        } else {
          num = 5; // 유빈은 아무 생각 없어서 기본 증가
        }
        // 캐릭별 특징과 플레이어의 스텟을 반영한 친밀도 증감
        this.closeness += Math.trunc(num * (1 + this.player.talkSkills / 100));
        break;
      case "2": // 화제 : "상대방"
        if (this.stage === 5) {
          num = 7; // 규민은 관심 가져주는 게 고마워서 크게 증가
        } else if (this.stage === 3 || this.stage === 4) {
          num = -5; // 가을은 츤데레라 관심 가지면 우쭐해져서, 세원은 귀찮아해서 감소
          this.isIncrease = false;
        } else {
          num = 5; // 지유는 뭔들 좋아서, 유빈은 아무 생각 없어서 기본 증가
        }
        this.closeness += Math.trunc(num * (1 + this.player.talkSkills / 100));
        break;
      case "3": // 화제 = "게임"
        if (this.stage === 4) {
          num = 7; // 세원은 게임을 좋아해서 크게 증가
          this.closeness += Math.trunc(num * (1 + this.player.talkSkills / 100));
        } else {
          num = -5; // 나머지는 게임에 별 관심 없어서 감소
          this.closeness += Math.trunc(num * (1 - this.player.talkSkills / 100));
          this.isIncrease = false;
        }
        break;
      default: // 재입력 요구
        console.log(chalk.red("1,2,3만 입력 가능합니다"));
        this.talk();
        break;
    }
    // 플레이어 자신감 소모
    this.player.confidence -= 10;
  }
  /* 장난치기 */
  joke() {
    // 변수 초기화
    this.isIncrease = true;
    // 확률 설정
    let probJoke = Math.trunc(Math.random() * 10 + 1);
    // 50% 장난 성공, 50% 장난 실패
    switch (this.stage) {
      case 3: // 가을은 장난 좋아해서 친밀도 더 오르고 덜 내려감
        if (probJoke <= 5) {
          this.closeness += Math.trunc(20 * (1 + this.player.charms / 100));
        } else {
          this.closeness += Math.trunc(-10 * (1 - this.player.charms / 100));
          this.isIncrease = false;
        }
        break;
      case 4: // 세원은 장난 싫어해서 무조건 내려감
        this.closeness += Math.trunc(-15 * (1 - this.player.charms / 100));
        this.isIncrease = false;
        break;
      default: // 나머지는 기본 변동
        if (probJoke <= 5) {
          this.closeness += Math.trunc(15 * (1 + this.player.charms / 100));
        } else {
          this.closeness += Math.trunc(-15 * (1 - this.player.charms / 100));
          this.isIncrease = false;
        }
        break;
    }
    // 플레이어 자신감 소모
    this.player.confidence -= 15;
  }
  /* 고백하기 */
  confess() {
    // 확률 설정
    let probConfess = Math.trunc(Math.random() * 100 + 1);
    // 5% 고백 성공, 95% 고백 실패 (친밀도 95 이상이면 무조건 성공)
    if (probConfess <= 5 || this.closeness >= 95) {
      // 고백 성공 시, 친밀도 및 자신감 최대 회복
      this.closeness = 100; 
      this.player.confidence = 100; 
      this.isDate = true; 
    } else {
      // 고백 실패 시, 80% 친밀도 50 감소, 20% 게임오버
      let probConfessFail = Math.trunc(Math.random() * 10 + 1);
      if (probConfessFail <= 8) {
        this.closeness -= 50;
        this.player.confidence -= 30;
      } else {
        isFailConfess[0] = true;
      }
    }
  }
  /* 도망가기 */
  escape() {
    // 변수 초기화
    this.isIncrease = true;
    // 친밀도 85 이상일 때 도망치면 친밀도 30 감소
    if (this.closeness >= 85) {
      this.closeness -= 30;
      this.isIncrease = false;
    }
  }
}
