# 웹/PWA 전환 메모

## 전환 방식

- 기존 Electron 설치형 앱의 renderer인 `src/App.jsx`와 `src/App.css`를 그대로 웹 진입점으로 사용한다.
- `npm run dev`와 `npm run build`는 크롬북 브라우저에서 실행 가능한 Vite 웹앱을 대상으로 한다.
- Electron 실행은 `npm run dev:electron`, Electron 포함 빌드는 `npm run build:desktop`으로 분리했다.

## 웹에서 재사용한 부분

- 분자식 주문 데이터
- 큐브 뽑기, 멈추기, 드래곤 큐브 위험 규칙
- 주문 시전 가능 여부 판정
- 분자식 분석과 승패 계산
- 이미지, 배경음악, 효과음, CSS 애니메이션

## 웹에서 대체한 부분

- Windows EXE 실행 대신 Vite 정적 산출물 `dist/`를 URL로 배포한다.
- 설치형 앱 shell 대신 `manifest.webmanifest`와 `sw.js`를 사용해 PWA 설치와 오프라인 재접속을 지원한다.
- 로컬 파일 시스템 저장은 이번 웹 버전의 핵심 플레이 흐름에 필요하지 않아 추가하지 않았다.

## 실행

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 제한 사항

- 학교 크롬북의 관리 정책에 따라 PWA 설치 버튼 노출은 제한될 수 있다. URL 접속 플레이는 정적 호스팅 환경에서 동작한다.
- 서비스 워커는 프로덕션 빌드에서만 등록된다.
- 첫 접속 뒤 로드된 자산을 캐시하므로, 완전한 오프라인 실행은 한 번 이상 접속 후 가능하다.
