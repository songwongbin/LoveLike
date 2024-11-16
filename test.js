/* 함수 기능 테스트 해보는 곳 */
async function longRunningTask(signal) {
  try {
    for (let i = 0; i < 10; i++) {
      // 1. signal.aborted가 true면 작업을 중단
      if (signal.aborted) {
        console.log("작업이 취소되었습니다.");
        return; // 함수 종료
      }

      console.log(`작업 ${i + 1} 진행 중...`);
      // 2. 1초마다 대기
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초마다 대기
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("작업 중단");
    }
  }
}

async function startTask() {
  const controller = new AbortController(); // AbortController 생성
  const signal = controller.signal; // signal은 중단 신호를 의미

  // 비동기 작업 실행
  const task = longRunningTask(signal);

  // 3. 5초 후에 작업을 취소 (abort 호출)
  setTimeout(() => controller.abort(), 5000);

  // 작업이 끝날 때까지 기다리기
  await task;
}

startTask();

const checkIsOVer = () => {
  if (isOver[0]) return;
};

const abortGame = () => {
  return new Promise((resolve) => {
    resolve();
  });
};

abortGame.then(checkIsOVer);
