# 케미술사: 드래곤의 반응식

중학교 과학 학습자를 위한 브라우저 기반 화학 반응식 판타지 게임입니다. 학생은 원소 큐브를 모아 균형 잡힌 화학 반응식 주문을 시전하고, 드래곤의 체력을 줄이면서 원자 보존 개념을 익힙니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://127.0.0.1:5173/`으로 접속합니다.

## 빌드

```bash
npm run build
npm run preview
```

프로덕션 빌드 결과는 `dist/` 폴더에 생성됩니다.
GitHub Pages 배포 주소와 같은 경로로 로컬 미리보기를 확인하려면 `http://127.0.0.1:4173/-chemistry/`로 접속합니다.

## GitHub Pages 배포

이 저장소에는 GitHub Pages 자동 배포 워크플로가 포함되어 있습니다.

1. 전체 프로젝트를 GitHub 저장소에 push합니다.
2. GitHub 저장소의 `Settings` → `Pages`에서 `Build and deployment`의 Source를 `GitHub Actions`로 설정합니다.
3. `Actions` 탭에서 `GitHub Pages 배포` 워크플로가 성공하는지 확인합니다.
4. 배포 주소는 보통 다음 형식입니다.

```text
https://surether.github.io/-chemistry/
```

## 주요 명령

```bash
npm run lint
npm run smoke
npm run build
npm run check:browser
```

## 웹/PWA 구성

- `public/manifest.webmanifest`: PWA 설치 정보
- `public/sw.js`: 기본 오프라인 캐시용 서비스 워커
- `src/App.jsx`: 게임 규칙, 주문 데이터, 정답 판정, 점수/승패 로직
- `src/App.css`: 판타지 보드게임 UI와 애니메이션
- `.github/workflows/deploy.yml`: GitHub Pages 자동 배포

## 제한 사항

- PWA 설치 버튼 노출 여부는 학교 크롬북의 관리 정책에 따라 달라질 수 있습니다.
- 배경음악은 브라우저 정책상 사용자의 첫 클릭 이후 재생됩니다.
- GitHub Pages에서 처음 배포할 때는 저장소 Pages 설정에서 Source를 `GitHub Actions`로 한 번 선택해야 할 수 있습니다.
