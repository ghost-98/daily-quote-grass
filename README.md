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

## Fallback 문구 출처

`data/fallback-quotes.json`의 문구는 API 장애나 응답 오류가 발생해도 자동 기록이 멈추지 않도록 프로젝트 안에서 직접 작성한 대체 문구입니다. 외부 명언을 복사한 데이터가 아니라, 이 저장소의 자동화 안정성을 위한 로컬 예비 데이터입니다.

평소에는 ZenQuotes API의 오늘의 명언을 저장하고, API 호출에 실패한 경우에만 fallback 문구를 날짜 기반으로 하나 선택합니다.

## 자동 커밋 메시지

매일 생성되는 커밋 메시지는 최신 명언 일부를 포함합니다.

```text
chore(quote): "Great things are done by a series of small things…" 명언을 기록한다
```

## 자동 기록 현황

<!-- AUTO:QUOTE_STATUS:START -->
- 마지막 기록일: 2026-08-01
- 총 기록 수: 85
- 최근 명언: New beginnings are disguised as painful endings.
<!-- AUTO:QUOTE_STATUS:END -->

## 출처

Inspirational quotes provided by [ZenQuotes API](https://zenquotes.io/).
