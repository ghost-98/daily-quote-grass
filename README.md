# Daily Quote Garden

ZenQuotes API에서 오늘의 명언을 가져와 기록하고, 정적 UI로 누적 기록을 확인하는 자동 커밋 저장소입니다.

## 기술 스택

- Runtime: Node.js 20
- API: ZenQuotes Quote of the Day API
- UI: HTML, CSS, Vanilla JavaScript
- Scheduler: GitHub Actions cron
- Test: Node.js assert 기반 테스트

## 명령어

```bash
npm run plant
npm run serve
npm test
```

## GitHub 설정

커밋이 내 GitHub 잔디에 반영되려면 Actions author 이메일이 내 GitHub 계정에 연결되어 있어야 합니다.

저장소의 `Settings > Secrets and variables > Actions > Variables`에 아래 값을 추가하세요.

```text
GIT_AUTHOR_NAME=<GitHub 사용자명>
GIT_AUTHOR_EMAIL=<GitHub noreply 이메일 또는 계정에 연결된 이메일>
```

## 자동 기록 현황

<!-- AUTO:QUOTE_STATUS:START -->
- 마지막 기록일: 2026-05-09
- 총 기록 수: 1
- 최근 명언: People often say that motivation doesn't last. Well, neither does bathing - that's why we recommend it daily.
<!-- AUTO:QUOTE_STATUS:END -->

## 출처

Inspirational quotes provided by [ZenQuotes API](https://zenquotes.io/).
