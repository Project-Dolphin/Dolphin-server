# Dolphin Server
## local test
```bash
npm i -g serverless

serverless offline start
```
## response 명세
1. GET  `/dev/calendar`
```json
{
    term: { startedAt: '2021-8-2', endedAt: '2021-8-6' },
    mainPlan: true,
    content: '제2학기 수강신청',
}
```