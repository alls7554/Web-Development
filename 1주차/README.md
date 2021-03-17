# html, css, javascript를 통해 WEB BINGO GAME 제작  
1주차에는 html(BootStrap V3.4.1), css, javascript를 이용해 빙고 게임의 기본 틀 제작  

<br>

## Install WSL2(Windows Subsystem for Linux2)
1. Install Windows Terminal at Microsoft Store
2. Run Windows Terminal on administrator privileges
3. Run this command sequentially
``` bash
> dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
> dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```
4. Restart
5. Install Ubuntu at Microsoft Store
6. Register username and password of UNIX
7. Check applied current Linux version
``` bash
> wsl -l -v
    Name        State       Version
 *  Ubuntu      Running     1    
```
8. Run this command
``` bash
> wsl --set-version Ubuntu 2
```
9. Change the default so that WSL2 is applied to all newly installed distributions.
``` bash
> wsl --set-default-version 2
```
10. Check Linux version after force restart
``` bash
> wsl -t Ubuntu

> wsl -l -v
    Name        State       Version
 *  Ubuntu      Running     2
```
11. Finally run Ubuntu at Windows Terminal

## Structure of Directory
``` bash    
├─ 장기현장실습  
│     │
│     └── 1주차/
│           ├── README.md           - 1주차 리드미 파일
│           │
│           ├── pages/              - html 폴더
│           │     ├── index.html    - 메인 템플릿
│           │     └── game.html     - 인게임 템플릿
│           │
│           ├── css/                - css 폴더
│           │    ├── default.css    - 초기값 설정 css파일
│           │    ├── main.css       - index.html의 Style Sheet
│           │    ├── game.css       - game.html의 Style Sheet
│           │    └── chat.css       - game.html의 Style Sheet
│           │
│           └─── js/                - js 폴더
│                ├── cookie.js      - 쿠키 CRD 기능 js
│                ├── bingo.js       - 빙고게임 관련 기능 js
│                └── chat.js        - 채팅 관련 기능 js
│
└───── README.md                    - root 리드미 파일
```

