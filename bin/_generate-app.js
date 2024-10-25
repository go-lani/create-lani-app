#! /usr/bin/env node

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const inquirer = require("inquirer");

if (process.argv.length < 3) {
  console.log("앱 이름을 입력해주세요.");
  console.log("예시 :");
  console.log("    npx create-my-boilerplate my-app");
  process.exit(1);
}
// 보일러플레이트 타입별 Git 저장소 URL 정의
const BOILERPLATE_TYPES = {
  next: "{{CLONE할 저장소 URL}}",
  react: "{{CLONE할 저장소 URL}}",
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
    const projectName = process.argv[2];
    const currentPath = process.cwd();
    const projectPath = path.join(currentPath, projectName);

    if (projectName !== ".") {
      try {
        fs.mkdirSync(projectPath);
      } catch (err) {
        if (err.code === "EEXIST") {
          console.log(projectName);
          console.log(
            `해당 ${projectName} 프로젝트가 이미 존재합니다. 다른 이름을 사용해주세요.`
          );
        } else {
          console.log(error);
        }
        process.exit(1);
      }
    }

    const projectType = await promptForProjectType();
    const GIT_REPO = BOILERPLATE_TYPES[projectType];

    console.log(`${projectType} 보일러플레이트를 다운로드합니다...`);
    execSync(`git clone --depth 1 ${GIT_REPO} ${projectPath}`);

    console.log("git 관련 파일을 제거합니다...");
    execSync("npx rimraf ./.git");

    console.log("설치가 완료되었습니다!");
  } catch (error) {
    console.log(error);
  }
}

main();
