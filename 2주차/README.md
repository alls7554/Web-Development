# Structure Web Server using Node.js

Essential after clone
```
npm install
```

## Structure of directory
``` bash    
├─ 장기현장실습  
│     │
│     ├── 1주차/
│     │     └── ...                      - 1주차 README 파일 참조
│     │   
│     └── 2주차/
│           ├── README.md                - 2주차 리드미 파일
│           ├── server.js                - 서버 js
│           ├── package.json             - init 파일
│           │
│           ├── views/                   - 템플릿 폴더
│           │     ├── index.html         - 메인 템플릿
│           │     └── game.html          - 인게임 템플릿
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
│           │         └── chat.js        - 채팅 관련 기능 js
│           │
│           └── router/
│                └── main.js      - index와 game 라우팅하는 js
│
└───── README.md                    - root 리드미 파일
```

## Install Node.js and npm
```nginx
# apt update
sudo apt-get update          # Update installed package

# install nodejs and npm
sudo apt-get install -y nodejs
node -v                      # Check node version

sudo apt-get install npm
npm -v                       # Check npm version

# update nodejs and npm(optional)
sudo npm cache clean -f      # Force Remove cache
sudo npm install -g n        # Install n module
sudo n stable                # Install nodejs using n module
```

## Install Express and ejs
```nginx
# Make Project Directory
mkdir {Directory name}
cd {Directory name}

# Initialization via npm
npm init

# Install Express
npm install express --save

# Install ejs
npm install ejs
```

## Execute
```bash
{installed path} $ npm start
```