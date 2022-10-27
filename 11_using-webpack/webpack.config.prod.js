const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
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
  // production 모드에서는 소스맵 생성이 불필요하므로 'none'으로 설정한다.
  devtool: "source-map",
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
  // 새로운 출력이 쓰여지기 전에 이전 코드를 자동적으로 삭제하는 플러그인(CleanPlugin) 추가 => dist 폴더 내에 항상 최신 버전의 출력이 존재하게 된다.
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
