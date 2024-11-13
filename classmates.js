import chalk from "chalk";
import readlineSync from "readline-sync";

export class Classmate {
  constructor(stage, player) {
    this.name = ["김지우", "박유빈", "송가을", "이세원", "이규민"];
    this.stage = stage; // 현재 스테이지 정보
    this.closeness = 60 - stage * 10; // 기본 친밀도 (스테이지 오를수록 낮아짐)
    this.isDate = false; // 연인 여부
    this.isIncrease = true; // 상호작용에 따른 친밀도 증감 여부
    this.isFailConfess = false; // 고백 실패시 일정확률로 게임오버 만들기 위한 체크
    this.player = player; // 플레이어 인스턴스를 그대로 가져옴!!
  }
  talk() {
    this.isIncrease = true; // 친밀도 증감 여부 초기화
    let num = 0; // 친밀도 증감 변수 초기화
    console.log(chalk.green(`대화 주제를 선택하세요!`));
    console.log(chalk.green(`1. 나 2. ${this.name[this.stage - 1]} 3. 게임`));
    const topics = readlineSync.question("입력 : ");
    switch (topics) {
      case "1":
        // 화제로 나 선택
        if (this.stage === 1 || this.stage === 3) {
          num = 7; // 지우, 가을은 나한테 관심 있어서 크게 증가
        } else if (this.stage === 4 || this.stage === 5) {
          num = -5; // 세원, 규민은 나한테 관심 없어서 감소
          this.isIncrease = false;
        } else {
          num = 5; // 유빈은 아무 생각 없어서 기본 증가
        }
        // 캐릭별 특징과 플레이어의 스텟을 반영한 친밀도 증감
        this.closeness += Math.round(num * (1 + this.player.talkSkills / 100));
        break;
      case "2":
        // 화제로 상대방 선택
        if (this.stage === 5) {
          num = 7; // 규민은 관심 가져주는 게 고마워서 크게 증가
        } else if (this.stage === 3 || this.stage === 4) {
          num = -5; // 가을은 츤데레라 관심 가지면 우쭐해져서, 세원은 귀찮아해서 감소
          this.isIncrease = false;
        } else {
          num = 5; // 지유는 뭔들 좋아서, 유빈은 아무 생각 없어서 기본 증가
        }
        // 캐릭별 특징과 플레이어의 스텟을 반영한 친밀도 증감
        this.closeness += Math.round(num * (1 + this.player.talkSkills / 100));
        break;
      case "3":
        // 화제로 게임 선택
        if (this.stage === 4) {
          num = 7; // 세원은 은밀하게 게임을 좋아해서 크게 증가
        } else {
          num = -5; // 나머지는 게임에 별 관심 없어서 감소
          this.isIncrease = false;
        }
        // 캐릭별 특징과 플레이어의 스텟을 반영한 친밀도 증감
        this.closeness += Math.round(num * (1 - this.player.talkSkills / 100));
        break;
      default:
        console.log(chalk.red("1,2,3만 입력 가능합니다"));
        this.talk();
        break;
    }
  }
  joke() {
    this.isIncrease = true; // 친밀도 증감 여부 초기화
    let probJoke = Math.trunc(Math.random() * 10 + 1);
    // 50% 장난 성공, 50% 장난 실패
    if (probJoke <= 5) {
      this.closeness += 15;
    } else {
      this.closeness -= 15;
      this.isIncrease = false;
    }
  }
  confess() {
    let probConfess = Math.trunc(Math.random() * 100 + 1);
    // 5% 고백 성공, 95% 고백 실패 (친밀도 95 이상이면 고백 무조건 성공)
    if (probConfess <= 5 || this.closeness >= 95) {
      this.closeness = 100; // 자신감 최대로 회복하고
      this.isDate = true; // 연인 속성 true
    } else {
      let probConfessFail = Math.trunc(Math.random() * 10 + 1);
      // (추가할 것) 20%에 게임오버 함수 실행
      if (probConfessFail <= 8) {
        this.closeness -= 50; // 고백실패시 80% 친밀도 -50
      } else {
        this.isFailConfess = true;
      } // 고백실패시 20% 게임오버
    }
  }
  escape() {
    this.isIncrease = true; // 친밀도 증감 여부 초기화
    // 친밀도 85 이상일 때 도망치면 친밀도 -30
    if (this.closeness >= 85) {
      this.closeness -= 30;
      this.isIncrease = false;
    }
  }
}
