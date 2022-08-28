function combine1(n1: number, n2: number) {
  return n1 + n2;
}

const combinedAges1 = combine1(30, 10);
console.log(combinedAges1); // 40

// 함수에 string 타입인 인자를 넘겼으므로 에러가 발생한다.
// const combinedNames1 = combine1("Max", "i");

// union 타입
// 서로 다른 두 종류의 값을 허용할 수 있다.
// 즉, combinedAges, combinedNames를 하나의 combine 함수로 해결할 수 있다.
function combine2(n1: number | string, n2: number | string) {
  if (typeof n1 === "number" && typeof n2 === "number") return n1 + n2;
  else {
    return n1.toString() + n2.toString();
  }
}

const combinedAges2 = combine2(30, 10);
const combinedNames2 = combine2("Max", "i");

// 타입 별칭 + union 타입
// 변수 m1은 객체 또는 문자열의 타입을 가질 수 있다.
type Manager = { name: string } | string;
let m1: Manager = { name: "Max" };
m1 = "Michael";

// 리터럴 : 할당한 값을 타입으로 사용
// hey 변수에 문자열 리터럴 값 'hello'를 할당해 타입으로 사용
let hey: "hello";

function combine3(
  n1: number | string,
  n2: number | string,
  resultType: "as-number" | "as-text" // 리터럴 타입 선언
) {
  let result;
  if (
    (typeof n1 === "number" && typeof n2 === "number") ||
    resultType === "as-number"
  )
    result = +n1 + +n2;
  else {
    result = n1.toString() + n2.toString();
  }
  return result;
}

const combinedAges3 = combine3(30, 10, "as-number");
const combinedNames3 = combine3("Max", "i", "as-text");
console.log(combinedAges3); // 40
console.log(combinedNames3); // Maxi

// 타입 별칭(사용자 정의 타입) : 타입을 직접 생성할 수 있다.
// 타입 별칭을 사용하면 불필요한 반복을 피하고 타입을 편리하게 관리할 수 있다.
type Combinable = number | string; // union 타입을 이용해 새로운 타입 생성
type ConversionDescriptor = "as-number" | "as-text"; // 리터럴 타입을 이용해 새로운 타입 생성

function combine4(
  n1: Combinable,
  n2: Combinable,
  resultType: ConversionDescriptor // 리터럴 타입 선언
) {
  let result;
  if (
    (typeof n1 === "number" && typeof n2 === "number") ||
    resultType === "as-number"
  )
    result = +n1 + +n2;
  else {
    result = n1.toString() + n2.toString();
  }
  return result;
}

// 객체 타입 별칭
type User = { name: string; age: number };
const u1: User = { name: "Max", age: 30 };

// 타입 별칭 작성 전
function greet(user: { name: string; age: number }) {
  console.log("Hi, I am " + user.name);
}

function isOlder(user: { name: string; age: number }, checkAge: number) {
  return checkAge > user.age;
}

// 타입 별칭 작성 후
// type User = { name: string; age: number };

// function greet(user: User) {
//   console.log("Hi, I am " + user.name);
// }

// function isOlder(user: User, checkAge: number) {
//   return checkAge > user.age;
// }
