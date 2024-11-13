export class Player {
  constructor() {
    this.confidence = 100; // 자신감, 0이 되면 게임오버
    this.mood = 5; // 기분, 훈련에 소모되는 자원, 0이 되면 훈련 강제 종료
    this.talkSkills = 10; // 말솜씨, 스텟에 비례해 대화 효과 강화
    this.charms = 10; // 매력, 스텟에 비례해 장난 효과 강화
    this.gameSkills = 10; // 게임실력
  }
  // 책읽기 : 기분 소모 / 말솜씨 UP, 매력 up, 게임스킬 down
  readBooks() {
    this.mood -= 1;
    this.talkSkills += 10;
    this.charms += 5;
    this.gameSkills -= 7;
  }
  // 운동하기 : 기분 소모 / 말솜씨 up, 매력 UP, 게임스킬 down
  workOut() {
    this.mood -= 1;
    this.talkSkills += 5;
    this.charms += 10;
    this.gameSkills -= 7;
  }
  // 게임하기 : 기분 회복 / 말솜씨 down, 매력 down, 게임스킬 UP
  playGames() {
    this.mood += 2;
    this.talkSkills -= 7;
    this.charms -= 7;
    this.gameSkills += 20;
  }
}
