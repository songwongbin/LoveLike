export class Player {
  constructor() {
    this.confidence = 100; // 자신감 (= 체력), 0이 되면 게임오버
    this.mood = 5; // 기분 (= 행동 포인트), 0이 되면 훈련 강제 종료
    this.talkSkills = 10; // 말솜씨, 대화하기 강화
    this.charms = 10; // 매력, 장난치기 강화
    this.gameSkills = 10; // 게임실력
    this.encounterResult = true; // 점심 인카운터 선택지 증감 결과
  }
  /* 책읽기 */
  readBooks() {
    // 기분 1 소모, 말솜씨 UP, 매력 up, 게임스킬 down
    this.mood -= 1;
    this.talkSkills += 10;
    this.charms += 5;
    this.gameSkills -= 7;
  }
  /* 운동하기 */
  workOut() {
    // 기분 1 소모, 말솜씨 up, 매력 UP, 게임스킬 down
    this.mood -= 1;
    this.talkSkills += 5;
    this.charms += 10;
    this.gameSkills -= 7;
  }
  /* 게임하기 */
  playGames() {
    // 기분 2 회복, 말솜씨 down, 매력 down, 게임스킬 UP
    this.mood += 2;
    this.talkSkills -= 7;
    this.charms -= 7;
    this.gameSkills += 20;
  }
  /* 점심 인카운터 */
  lunchEvent(isplus) {
    // 선택지에 따라 자신감 20 증감
    let num = isplus ? 1 : -1;
    this.confidence += 20 * num;
    this.encounterResult = num === 1 ? true : false;
  }
}
