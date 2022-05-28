# Dolphin Server
## local test
```bash
npm i -g serverless

serverless offline start
```
## response 명세
### 메인화면
1. `/`
### 학사일정
1. `/calendar`

학사일정을 모두 가져온다.
```json
[{"term":{"startedAt":"2022-2-28","endedAt":"2022-2-28"},"mainPlan":true,"content":"2022학년도 입학식"},
{"term":{"startedAt":"2022-2-28","endedAt":"2022-2-28"},"mainPlan":false,"content":"신입생 오리엔테이션(해양과학기술융합대학, 해양인문사회과학대학)"}]
```
2. `/calendar/latest`

```json
[{"term":{"startedAt":"2022-6-8","endedAt":"2022-6-15"},"mainPlan":false,"content":"제1학기 휴업일 보강","dDay":11},{"term":{"startedAt":"2022-6-15","endedAt":"2022-6-22"},"mainPlan":true,"content":"제1학기 기말시험","dDay":18}]
```
### 공지사항
1.  `/notices`
```json
[{"title":"2022학년도 제1학기 정기 강의평가 실시 안내","link":"https://www.kmou.ac.kr/kmou/na/ntt/selectNttInfo.do?nttSn=10315355&mi=2033","date":"2022-05-27"}]
```
### 식단
1. `/diet/v2/society/today`

학생식당
```json
{"student":[{"type":"백반","menus":["2022년 05월 28일"]},{"type":"국밥","menus":[]}],"snack":[{"type":"양식코너","menus":["2022년 05월 28일"]},{"type":"조식","menus":[]},{"type":"라면코너","menus":[]},{"type":"분식코너","menus":[]},{"type":"덮밥코너","menus":[]}],"staff":[{"type":"중식","menus":["2022년 05월 28일"]},{"type":"일품식","menus":[]}]}
```
2. `/dorm/today`

기숙사
```json
{"morning":["밥/잡곡밥","깍두기","소고기두부국","떡갈비","계란말이","무말랭이지","우유"],"lunch":["짜장밥","장국","양배추샐러드","꿔바로우탕수육","김치","농후발효유"],"dinner":["밥/잡곡밥","깍두기","콩나물국","훈제오리불고기","부추생채","메밀묵무침"]}
```
