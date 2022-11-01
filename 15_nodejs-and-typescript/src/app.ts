// node app.ts로 실행하면 타입스크립트 파일을 자바스크립트로 변환해 실행하는 것이 아니라 단지 자바스크립트로 처리해 실행한다.
// 그러므로 만약 타입스크립트에 타입을 작성하지 않았다면 정상적으로 동작하겠지만 타입을 작성한다면 에러가 발생한다.
// 타입스크립트 파일을 실행하고 싶다면 tsc [파일 이름].ts로 컴파일 한 후 node [파일 이름].js를 작성해 컴파일된 자바스크립트 파일을 실행시킨다.

// ts-node 패키지를 설치하면 타입스크립트를 실행할 수 있다.

import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import todoRouters from "./routes/todos";

const app = express();

app.use(json());

app.use("/todos", todoRouters);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000);
