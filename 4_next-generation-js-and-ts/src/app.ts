// 1. 스코프
// var : 함수 스코프
// let : 블록 스코프
let age = 30;

if (age > 20) {
  var isOldWithVar = true;
}

// console.log(isOldWithVar); // 정상 출력

if (age > 20) {
  let isOldWithLet = true;
}

// let 변수는 블록 스코프를 갖기 때문에 if문에 존재하는 isOldWithLet 값을 출력할 수 없다.
// console.log(isOldWithLet);

// 2. 화살표 함수
const add = (a: number, b: number) => a + b;
const printOutput: (a: number | string) => void = (output) =>
  console.log(output);

printOutput(add(3, 2)); // 5

const button = document.querySelector("button")!;

// 이벤트 리스너의 콜백 함수는 타입(매개변수, 반환값에 대한 타입)을 지정할 필요가 없다.
// 이벤트 리스너는 작성된 이벤트 기반으로 이벤트 객체(콜백 함수의 매개변수)를 추론하기 때문이다.
// 작성된 이벤트 기반으로 콜백 함수가 어떤 객체를 리턴하는지 알기 때문에 반환값 또한 타입을 작성하지 않아도 된다.
button.addEventListener("click", (event) => console.log(event));

// 3. 함수 매개변수의 기본값
const sub = (a: number, b: number = 2) => a - b;

// 타입스크립트는 기본값 매개변수를 인식하기 때문에 매개변수를 1개만 작성했더라도 에러는 발생하지 않는다.
// 다만, 순서를 따르므로 오른쪽에 기본값을 설정해야 한다.
printOutput(sub(3)); // 1

// 만약 함수의 첫 번째 인수에 기본값을 설정한다면 다음 코드는 에러를 발생시킨다.
const mul = (a: number = 3, b: number) => a * b;
// printOutput(mul(3)); // 에러 발생 : 두 번째 인수의 값이 전달되지 않았기 때문이다.

// 4. 스프레드 연산자
const hobbies = ["sports", "cooking", "hiking"];
const activeHobbies = ["hiking", ...hobbies];

activeHobbies.push(...hobbies);
console.log(activeHobbies);

const person = {
  name: "max",
  age: 30,
};

const copiedPerson = { ...person };

// 5. 나머지 매개변수
const addNums1 = (...numbers: number[]) => {
  return numbers.reduce((res, cur) => res + cur, 0);
};

console.log(addNums1(4, 2, 3, 10)); // 19

// 튜플 타입 적용
const addNums2 = (...numbers: [number, number, number]) => {
  return numbers.reduce((res, cur) => res + cur, 0);
};

console.log(addNums2(3, 2, 4)); // 3개의 인수만 넘길 수 있다.

// 6. 구조분해 할당
// 배열 구조분해 할당 : 배열 요소 순서대로 추출
const [hobby1, ...hobby2] = hobbies;
console.log(hobby1, hobby2);

// 객체 구조분해 할당 : 키 이름으로 추출
const store = {
  carrot: 1000,
  cookie: 800,
};
// 별칭 설정
const { carrot: vegetable, cookie } = store;
console.log(vegetable, cookie); // 1000 800
