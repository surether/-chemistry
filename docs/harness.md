# Harness

## 실행 하네스

1. `npm install` 성공
2. `npm run dev` 성공
3. Electron 창 실행
4. 대시보드 카드가 표시됨
5. `local-data` JSON 파일들이 로드됨
6. 오늘 시간표가 표시됨
7. 급식 메뉴가 표시됨
8. 일정과 D-day가 표시됨
9. 반별 진도가 표시됨
10. 할 일 체크 상태가 저장됨
11. 일반 메모가 저장됨
12. 링크 버튼이 동작함
13. 개인정보 샘플 데이터가 없음
14. 외부 서버 전송 코드가 없음
15. renderer에서 직접 `fs`, `path`, `shell`을 사용하지 않음

## Widget Mode 하네스

1. `npm run dev` 성공
2. 앱이 프레임 없는 위젯형 창으로 실행됨
3. 작업표시줄에 일반 창처럼 표시되지 않음
4. 트레이 아이콘이 표시됨
5. 트레이에서 위젯 숨기기 가능
6. 트레이에서 위젯 보이기 가능
7. 트레이에서 종료 가능
8. 창을 드래그해서 이동 가능
9. 창 위치/크기 저장 가능
10. 재실행 시 위치/크기 복원 가능

## Inline Edit 하네스

1. 상단 Edit 버튼 없이도 시간표 카드 클릭으로 편집 가능
2. 시간표 수정 후 저장하면 화면 즉시 갱신
3. 앱 재실행 후 수정된 시간표 유지
4. 메모 카드 클릭으로 수정 가능
5. 할 일 텍스트 클릭으로 제목 수정 가능
6. 할 일 체크 상태 저장 가능
7. 링크 카드 클릭으로 링크 수정 가능
8. D-day 카드 클릭으로 일정 수정 가능
9. 잘못된 링크 주소 입력 시 저장 방지 또는 경고
10. 저장 실패 시 오류 메시지 표시
11. 학생 개인정보 입력을 유도하는 문구 없음
12. renderer에서 `fs/path/shell` 직접 사용 없음

## 현재 환경 주의

현재 Codex 실행 환경에서는 `node`는 사용할 수 있지만 `npm`, `pnpm`, `git`은 PATH에서 발견되지 않았다.
패키지 설치와 Electron 실행 검증은 패키지 매니저가 사용 가능한 환경에서 수행해야 한다.

## 권장 검증 명령

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

## 보조 정적 검증

패키지 설치 전에도 다음 명령으로 파일 구조와 JSON, 보안 금지 조건 일부를 점검할 수 있다.

```bash
node scripts/smoke-check.mjs
node scripts/static-check.mjs
```

## 현재 Codex 실행 결과

| 항목 | 결과 | 비고 |
| --- | --- | --- |
| `node scripts/smoke-check.mjs` | 성공 | 필수 파일과 `local-data` JSON 파싱 확인 |
| `node scripts/static-check.mjs` | 성공 | renderer 직접 `fs/path/electron` import 없음, 추적 구현 패턴 없음 |
| 상대 import 확인 | 성공 | `src`와 `electron`의 상대 import 대상 존재 확인 |
| `npm install` | 실패 | 현재 Codex PATH에서 `npm` 명령을 찾을 수 없음 |
| `npm run typecheck` | 실패 | 현재 Codex PATH에서 `npm` 명령을 찾을 수 없음 |
| `npm run build` | 실패 | 현재 Codex PATH에서 `npm` 명령을 찾을 수 없음 |

## Widget Mode 패치 후 Codex 실행 결과

| 항목 | 결과 | 비고 |
| --- | --- | --- |
| `npm.cmd run typecheck` | 성공 | React와 Electron TypeScript 검사 통과 |
| `npm.cmd run lint` | 성공 | renderer 직접 `fs/path/electron` import 없음 |
| `node scripts/smoke-check.mjs` | 성공 | 필수 파일과 JSON 파싱 확인 |

패키지 매니저가 있는 일반 개발 터미널에서는 `npm install`부터 다시 실행한다.
