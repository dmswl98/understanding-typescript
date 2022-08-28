// 함수 반환 값 타입 정의
// 타입을 명시적으로 설정할 이유가 없다면 굳이 타입을 설정하지 않고 타입스크립트의 타입 추론을 이용하는 것이 좋다.
function add(n1: number, n2: number): number {
  return n1 + n2;
}

// 반환 값이 없는 함수의 반환 타입은 void이다.
function printResult(num: number): void {
  console.log("result :", num);
}

// 함수 타입 : 함수의 매개변수와 반환값의 타입을 정의하는 함수
let resultValue1: Function;
resultValue1 = add;
console.log(resultValue1(3, 4)); // 7

// 에러 발생 : resultValue 변수에 할당해야 하는 값의 타입은 Function이기 때문이다.
// resultValue = 5;

// 함수의 매개변수의 개수가 다르지만 타입스크립트는 이를 에러로 감지하지 못한다.
resultValue1 = printResult;
console.log(resultValue1(3, 4)); // undefined

// 함수의 매개변수와 반환값의 타입을 정의하는 함수를 작성하면 위 예외의 경우를 피할 수 있다.
let resultValue2: (a: number, b: number) => number;
resultValue2 = add;
console.log(resultValue2(3, 4)); // 7
// 에러 발생 : 위 정의된 함수의 매개변수의 개수와 다른 함수를 할당했으므로 에러가 발생한다.
// resultValue2 = printResult;

// 콜백 함수의 타입 정의
function addHandler(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  cb(result);
}

addHandler(10, 20, (result) => {
  console.log(result);
  // 콜백 함수는 반환 값의 타입을 void로 설정했더라도 값을 반환할 수 있다.
  // return "string";
});
