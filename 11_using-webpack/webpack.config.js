const path = require("path");

module.exports = {
  mode: "development",
  // 입력 지점
  entry: "./src/app.ts", // 루트 파일 설정
  output: {
    // 출력 지점
    filename: "bundle.js", // 생성할 컴파일 파일명
    path: path.resolve(__dirname, "dist"),
    // 절대 경로가 필요하다.
    // path.resolve는 절대 경로를 빌드하게 한다.
    // path의 값은 dist 폴더로의 절대 경로 값이다.
    publicPath: "dist",
  },
  devtool: "inline-source-map", // 생성된 소스 맵이 이미 존재하다는 것을 웹팩에게 전달
  module: {
    // 모든 파일에 적용될 법칙들을 설정
    rules: [
      {
        test: /\.ts$/, // 파일 확장자를 점검하는 정규 표현식
        use: "ts-loader", // 웹팩이 사용하는 로더를 명시
        exclude: /node_modules/, // 노드모듈 내부는 검사하지 않도록 함
      },
    ],
  },
  resolve: {
    // 웹팩에게 스스로 import에 작성한 파일의 확장자를 추가하도록 함
    extensions: [".ts", ".js"],
  },
};
