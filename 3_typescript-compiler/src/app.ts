// 뒤에 느낌표를 붙여 해당 dom 요소가 존재함을 알려야 에러가 발생하지 않는다.
// 또는 "strictNullChecks"를 false로 설정하면 null 타입을 잠재적으로 가질 수 있는 값을 에러로 취급하지 않아 에러가 발생하지 않는다.
const button = document.querySelector("button")!;

button.addEventListener("click", () => {
  console.log("Clicked");
});
