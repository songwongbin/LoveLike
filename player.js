export class Player {
  /* 플레이어 스테이터스 */
  constructor() {
    this.confidence = 100;
    this.mood = 5;
    this.talkSkills = 10;
    this.charms = 10;
    this.gameSkills = 10;
  }
  /* 플레이어 행동 패턴 */
  isTalk() {
    const topics = ["me", "you", "game"];
  }
  isJoke() {}
  isConfess() {}
  isEscape() {}
  /* 플레이어 훈련 */
  isReadBooks() {}
  isWorkOut() {}
  isPlayGames() {}
}
