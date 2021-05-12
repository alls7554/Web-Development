# Essential after clone
```
npm install
```

## Structure of directory
``` bash    
├─ 장기현장실습  
│     │
│     ├── 1주차/
│     │     └── ...                      - 1주차 README 파일 참조
│     ├── 2주차/
│     │     └── ...                      - 2주차 README 파일 참조
│     ├── 3주차/
│     │     └── ...                      - 3주차 README 파일 참조
│     ├── 4주차/
│     │     └── ...                      - 4주차 README 파일 참조
│     └── 5주차/
│           ├── README.md                - 5주차 리드미 파일
│           ├── server.js                - 서버 js
│           ├── package.json             - init 파일
│           │
│           ├── views/                   - 템플릿 폴더
│           │     ├── index.html         - 메인 템플릿
│           │     ├── game.html          - 인게임 템플릿
│           │     └── 404.html           - 404 Error 템플릿(3/22기준 임시)
│           │   
│           ├── public/                
│           │    ├── css/                - css 폴더
│           │    │    ├── default.css    - 초기값 설정 css파일
│           │    │    ├── main.css       - index.html의 Style Sheet
│           │    │    ├── game.css       - game.html의 Style Sheet
│           │    │    └── chat.css       - game.html내 chatting part Style Sheet
│           │    │
│           │    └── js/                 - js 폴더
│           │         ├── cookie.js      - 쿠키 CRD 기능 js
│           │         ├── bingo.js       - 빙고게임 관련 기능 js
│           │         ├── chat.js        - 채팅 관련 기능 js --> socket.io()로 bingo.js에 결합 중 (21.03.23) 
│           │         └── korDate.js     - moment 라이브러리를 이용한 한국 시간대 구하는 js(p.s 해당 라이브러리의 개발은 중단된 상태)
│           │
│           └── router/
│                └── main.js      - index와 game 라우팅하는 js
│
└───── README.md                    - root 리드미 파일
```