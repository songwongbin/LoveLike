/* 함수 기능 테스트 해보는 곳 */
/* endScene 프로미스 버전 혹시 몰라서 보관 */
export const endScene = (title) => {
  return new Promise((resolve) => {
    console.clear();
    console.log(chalk.magentaBright("=".repeat(50)));
    console.log(title);
    console.log(chalk.magentaBright("=".repeat(50)));
    console.log("\n[1. 재시작] [2. 게임 종료]");
    inputWaiting(start, shutDown);
    resolve();
  });
};
