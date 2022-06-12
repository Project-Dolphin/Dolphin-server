# Dolphin Server
## local test
```bash
npm run dev
```
## response 명세
### 메인화면
1. `/`
```json
{
  "schedules":[
    {
      "term":{
        "startedAt":"2022-6-15",
        "endedAt":"2022-6-22"
      },
      "mainPlan":true,
      "content":"제1학기 기말시험",
      "dDay":4
    },
    {
      "term":{
        "startedAt":"2022-6-15",
        "endedAt":"2022-6-28"
      },
      "mainPlan":true,
      "content":"제1학기 성적처리 및 입력",
      "dDay":4
    }
  ],
  "weather":{
    "status":"맑음",
    "temparature":"20°",
    "windSpeed":"2.06m/s",
    "humidity":"64%"
  },
  "notices":[
    {
      "title":"2022학년도 여름계절학기 수강료 추가 납부 안내",
      "link":"https://www.kmou.ac.kr/kmou/na/ntt/selectNttInfo.do?nttSn=10316052&mi=2033",
      "date":"2022-06-10"
    },
    {
      "title":"(원격)수업 개선 학생 모니터링단 결과(5월)",
      "link":"https://www.kmou.ac.kr/kmou/na/ntt/selectNttInfo.do?nttSn=10315396&mi=2033",
      "date":"2022-05-27"
    },
    {
      "title":"2022학년도 제1학기 정기 강의평가 실시 안내",
      "link":"https://www.kmou.ac.kr/kmou/na/ntt/selectNttInfo.do?nttSn=10315355&mi=2033",
      "date":"2022-05-27"
    },
    {
      "title":"2022학년도 제1학기 핵심역량 및 전공능력 성취도 평가 실시 안내",
      "link":"https://www.kmou.ac.kr/kmou/na/ntt/selectNttInfo.do?nttSn=10315354&mi=2033",
      "date":"2022-05-27"
    },
    {
      "title":"2022학년도 여름계절학기 수업 운영 방식 안내",
      "link":"https://www.kmou.ac.kr/kmou/na/ntt/selectNttInfo.do?nttSn=10315303&mi=2033",
      "date":"2022-05-25"
    },
    {
      "title":"2022학년도 여름계절학기 1차 폐강대상 교과목 및 수강정정 기간 안내",
      "link":"https://www.kmou.ac.kr/kmou/na/ntt/selectNttInfo.do?nttSn=10315074&mi=2033",
      "date":"2022-05-20"
    }
  ],
  "diets":{
    "student":[
      {
        "type":"백반",
        "menus":[
          "2022년 06월 11일"
        ]
      },
      {
        "type":"국밥",
        "menus":[
          
        ]
      }
    ],
    "snack":[
      {
        "type":"양식코너",
        "menus":[
          "2022년 06월 11일"
        ]
      },
      {
        "type":"조식",
        "menus":[
          
        ]
      },
      {
        "type":"라면코너",
        "menus":[
          
        ]
      },
      {
        "type":"분식코너",
        "menus":[
          
        ]
      },
      {
        "type":"덮밥코너",
        "menus":[
          
        ]
      }
    ],
    "staff":[
      {
        "type":"중식",
        "menus":[
          "2022년 06월 11일"
        ]
      },
      {
        "type":"일품식",
        "menus":[
          
        ]
      }
    ]
  }
}
```

### 학사일정
1. `/calendar`

학사일정을 모두 가져온다.
```json
[
  {
    "term":{
      "startedAt":"2022-2-28",
      "endedAt":"2022-2-28"
    },
    "mainPlan":true,
    "content":"2022학년도 입학식"
  },
  {
    "term":{
      "startedAt":"2022-2-28",
      "endedAt":"2022-2-28"
    },
    "mainPlan":false,
    "content":"신입생 오리엔테이션(해양과학기술융합대학, 해양인문사회과학대학)"
  }
]
```
2. `/calendar/latest`

```json
[
  {
    "term":{
      "startedAt":"2022-6-8",
      "endedAt":"2022-6-15"
    },
    "mainPlan":false,
    "content":"제1학기 휴업일 보강",
    "dDay":11
  },
  {
    "term":{
      "startedAt":"2022-6-15",
      "endedAt":"2022-6-22"
    },
    "mainPlan":true,
    "content":"제1학기 기말시험",
    "dDay":18
  }
]
```
### 공지사항
1.  `/notices`
```json
[
  {
    "title":"2022학년도 제1학기 정기 강의평가 실시 안내",
    "link":"https://www.kmou.ac.kr/kmou/na/ntt/selectNttInfo.do?nttSn=10315355&mi=2033",
    "date":"2022-05-27"
  }
]
```
### 식단
1. `/diet/v2/society/today` 학생식당

```json
{
  "student":[
    {
      "type":"백반",
      "menus":[
        "2022년 05월 28일"
      ]
    },
    {
      "type":"국밥",
      "menus":[
        
      ]
    }
  ],
  "snack":[
    {
      "type":"양식코너",
      "menus":[
        "2022년 05월 28일"
      ]
    },
    {
      "type":"조식",
      "menus":[
        
      ]
    },
    {
      "type":"라면코너",
      "menus":[
        
      ]
    },
    {
      "type":"분식코너",
      "menus":[
        
      ]
    },
    {
      "type":"덮밥코너",
      "menus":[
        
      ]
    }
  ],
  "staff":[
    {
      "type":"중식",
      "menus":[
        "2022년 05월 28일"
      ]
    },
    {
      "type":"일품식",
      "menus":[
        
      ]
    }
  ]
}
```
2. `/dorm/today` 기숙사
```json
{
  "morning":[
    "밥/잡곡밥",
    "깍두기",
    "소고기두부국",
    "떡갈비",
    "계란말이",
    "무말랭이지",
    "우유"
  ],
  "lunch":[
    "짜장밥",
    "장국",
    "양배추샐러드",
    "꿔바로우탕수육",
    "김치",
    "농후발효유"
  ],
  "dinner":[
    "밥/잡곡밥",
    "깍두기",
    "콩나물국",
    "훈제오리불고기",
    "부추생채",
    "메밀묵무침"
  ]
}
```
### 날씨
1. `/weather/now`
```json
{
  "status":"구름조금",
  "temparature":"19°",
  "windSpeed":"7.2m/s",
  "humidity":"63%"
}
```
### 버스
1. `/bus/time?busStopName={버스 정류장}&busNumber={버스번호}`

```json
{
  "busStopName":"busan_station",
  "lineno":190,
  "min1":16,
  "min2":32
}
```
- busStopName

| name           | value          | description      |
|----------------|----------------|------------------|
| BUSAN_STATION  | busan_station  | 부산역           |
| YEONGDO_BRIDGE | yeongdo_bridge | 영도대교         |
| KMOU_ENTRANCE  | kmou_entrance  | 한국 해양대 입구 | 
- busNumber

| number |
|--------|
| 190    |
| 101    |
| 66     |
| 88     |
| 30     |
| 8      |
| 186    |

2. `/bus/info?busNumber={busNumber}`
전체 정류장이랑 현재 버스 위치
```json
{"busNumber":"190","busStopInfo":[{"bstopnm":"해양대구본관","rpoint":0,"carno":"70자3724","lowplate":0},...]}
```
3. `/bus/departbus`
```json
{
  "nextDepartBus":[
    {
      "bus":"19:19",
      "remainMinutes":0
    },
    {
      "bus":"19:40",
      "remainMinutes":21
    }
  ]
}
```
4. `/bus/nextshuttle`
```json
{
  "nextShuttle":[
    {
      "destination":"하리",
      "time":"18:10",
      "remainMinutes":11
    },
    {
      "destination":"하리",
      "time":"18:30",
      "remainMinutes":31
    },
    {
      "destination":"하리",
      "time":"18:50",
      "remainMinutes":51
    },
    {
      "destination":"하리",
      "time":"19:00",
      "remainMinutes":61
    },
    {
      "destination":"하리",
      "time":"19:20",
      "remainMinutes":81
    },
    {
      "destination":"하리",
      "time":"19:40",
      "remainMinutes":101
    },
    {
      "destination":"하리",
      "time":"20:00",
      "remainMinutes":121
    },
    {
      "destination":"하리",
      "time":"20:20",
      "remainMinutes":141
    },
    {
      "destination":"하리",
      "time":"20:40",
      "remainMinutes":161
    },
    {
      "destination":"하리",
      "time":"21:20",
      "remainMinutes":201
    },
    {
      "destination":"하리",
      "time":"21:40",
      "remainMinutes":221
    },
    {
      "destination":"하리",
      "time":"22:00",
      "remainMinutes":241
    },
    {
      "destination":"하리",
      "time":"22:20",
      "remainMinutes":261
    },
    {
      "destination":"하리",
      "time":"22:40",
      "remainMinutes":281
    }
  ]
}
```
