# Section 11: Using Webpack

## 1. Webpack 사용 이유

1. 항상 tsc -w를 사용해 수동으로 컴파일해야 한다.
2. 타입스크립트 파일들이 컴파일된 모든 자바스크립트 파일이 http 요청이 이루어진다.

   - http 요청의 양에 따라 대기 시간이 발생하고 프로젝트가 느려지기 때문에 좋지 못하다.

</br>

## 2. Webpack이란

> 웹팩은 파일을 묶는(bundle)것을 도와주는 도구이다.

1. bundling(묶고)
2. building(빌드)
3. orchestration(종합)하는 도구이다.

코드를 묶어 http 요청의 양을 줄일 수 있어 애플리케이션의 속도를 향상시킬 수 있다. 웹팩은 코드를 최적화하고 빌드 절차를 추가할 수 있으며 추가 빌드 툴 또한 제공한다.

- 만약 웹팩을 사용하지 않았을 경우

  - 여러 ts 파일을 컴파일한 여러 개의 js 파일이 생겨나고
  - module의 사용으로 import문을 작성한 경우 여러 개의 http 요청을 받게된다.
  - 최적화되지 않은 코드이므로 이를 웹팩으로 코드를 최대한 줄여 사용자들이 더 빠르게 다운로드받을 수 있다.

위 모든 것을 웹팩을 통해 자동으로 작업할 수 있다.

- 웹팩을 사용하면

  - 코드를 묶어 import 작업을 덜 할 수 있고
  - 코드를 최적화(작게)하여 사용자들이 더 적은 코드를 다운로드 받게 할 수 있다.
  - 쉽게 개발 서버를 추가할 수 있다.

</br>

## 3. Webpack 사용 방법

### 0. 설치

```
npm i --save-dev ts-loader typescript webpack webpack-cli webpack-dev-server
```

</br>

### 1. tsconfig.json 설정

```json
{
  // "rootDir": "./src"
  "sourceMap": true
}
```

rootDir 주석 처리 : webpack을 사용하면 더 이상 루트 경로가 필요하지 않으므로 주석 설정한다.

sourceMap 주석 해제 : 코드의 디버그를 지원한다. 크롬의 개발자 도구에서 source 탭에서 모든 코드를 확인할 수 있으며 디버깅도 가능하다.

</br>

### 2. webpack.config.js 파일 추가

```js
const path = require("path");

module.exports = {
  mode: "development", // 생략 가능
  entry: "./src/app.ts", // 루트 파일 설정
  output: {
    filename: "bundle.js", // 생성할 컴파일 파일명
    path: path.resolve(__dirname, "dist"), // path.resolve는 절대 경로를 빌드하게 하며 위 값은 dist 폴더로의 절대 경로 값이다.
    publicPath: "dist",
  },
  devtool: "inline-source-map", // 생성된 소스 맵이 이미 존재하다는 것을 웹팩에게 전달
  module: {
    // 모든 파일에 적용될 법칙들을 설정
    rules: [
      {
        test: /\.ts$/, // 파일 확장자를 점검하는 정규 표현식
        use: "ts-loader", // 웹팩이 사용하는 로더를 명시
        exclude: /node_modules/, // node_modules 폴더 내부는 검사하지 않도록 함
      },
    ],
  },
  resolve: {
    // 웹팩에게 import에 작성한 파일의 확장자를 추가하도록 함
    // 웹팩을 통해 js 확장자를 직접 작성하지 않고 자동적으로 확장자 파일을 찾도록 설정할 수 있다.
    extensions: [".ts", ".js"],
  },
};
```

</br>

### 3. package.json에 build script 작성

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

`npm run build`를 통해 dist 폴더 내부에 `bundle.js` 파일이 생성된다.

</br>

### [참고] production mode 사용하기

1. `webpack.config.prod.js` 파일 추가

```js
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "dist",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  // 새로운 출력이 쓰여지기 전에 이전 코드를 자동적으로 삭제하는 플러그인인 CleanPlugin 추가
  // dist 폴더 내에 항상 최신 버전의 출력이 존재하게 된다.
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
```

2. clean 플러그인 추가 : `npm i --save-dev clean-webpack-plugin`
3. `package.json` script 변경

```json
{
  "scripts": {
    "build": "webpack --config webpack.config.prod.js"
  }
}
```

config 파일 수동 설정하는 방법은 --config 뒤에 config 파일명(파일 확장자 포함)을 작성한다.
