#! /usr/bin/env node

const { execSync } = require("child_process");
const inquirer = require("inquirer");

// 보일러플레이트 타입별 Git 저장소 URL 정의
const BOILERPLATE_TYPES = {
  next: "https://github.com/go-lani/test.git",
  react: "https://github.com/go-lani/test.git",
};

async function promptForProjectType() {
  const questions = [
    {
      type: "list",
      name: "projectType",
      message: "어떤 유형의 프로젝트를 생성하시겠습니까?",
      choices: [
        { name: "Next App", value: "next" },
        { name: "React App", value: "react" },
      ],
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.projectType;
}

async function main() {
  try {
    const projectType = await promptForProjectType();
    const GIT_REPO = BOILERPLATE_TYPES[projectType];

    console.log(`${projectType} 보일러플레이트를 다운로드합니다...`);
    execSync(`git clone --depth 1 ${GIT_REPO} .`);

    console.log("git 관련 파일을 제거합니다...");
    execSync("npx rimraf ./.git");

    console.log("설치가 완료되었습니다!");
  } catch (error) {
    console.log(error);
  }
}

main();
