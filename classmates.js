export class Classmate {
  constructor(closeness) {
    /* 친밀도 */
    this.closeness = 60 - closeness * 10;
    /* 연인 여부 */
    this.isDate = false;
  }
  /* 점심시간 이벤트 */
  encounter() {}
}
