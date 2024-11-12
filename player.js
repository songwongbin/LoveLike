export class Player {
  /* 플레이어 스테이터스 */
  constructor() {
    this.confidence = 100;
    this.mood = 5;
    this.talkSkills = 10;
    this.charms = 10;
    this.gameSkills = 10;
  }
  /* 플레이어 훈련 */
  isReadBooks() {
    this.mood -= 1;
    this.talkSkills += 10;
    this.charms += 5;
    this.gameSkills -= 7;
  }
  isWorkOut() {
    this.mood -= 1;
    this.talkSkills += 5;
    this.charms += 10;
    this.gameSkills -= 7;
  }
  isPlayGames() {
    this.mood += 2;
    this.talkSkills -= 7;
    this.charms -= 7;
    this.gameSkills += 20;
  }
}
