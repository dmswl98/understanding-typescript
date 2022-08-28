// 함수의 매개변수 타입 설정
// n1과 n2는 number 타입을 가져야 한다.
function add(n1: number, n2: number) {
  return n1 + n2;
}

const number1 = 5;
// const number1 = '5'; // 에러 발생
const number2 = 2.8;

const result = add(number1, number2);
console.log(result);

// 타입 추론
const num = 5;
// const num: number = 5; // 불필요한 타입 정의
// num은 const 변수이므로 타입이 추론되지 않는다.
// 'const num: 5'와 같이 number로 추론되지 않는다.

// comment의 타입은 string로 추론되므로 number 타입의 값을 할당하면 에러가 발생한다.
let comment = "good";
// comment = 5; // 에러 발생

// 객체 내 프로퍼티 타입 정의
// 이미 객체 키 값에 대해 값이 할당되어 있어 타입 추론이 가능하므로 타입 정의를 하지 않아도 된다.
const person: {
  name: string;
  age: number;
} = {
  name: "Tom",
  age: 30,
};

console.log(person.name);

// 중첩 객체 타입 정의
const product: {
  id: string;
  price: number;
  tags: string[];
  details: {
    title: string;
    description: string;
  };
} = {
  id: "abc1",
  price: 12.99,
  tags: ["great-offer", "hot-and-new"],
  details: {
    title: "Red Carpet",
    description: "A great carpet - almost brand-new!",
  },
};

console.log(product.tags);

// 배열
// string[] : 문자열로 이루어진 배열
let hobbies: string[];
hobbies = ["sports", "game", "cooking"];
for (const hobby of hobbies) {
  // hobbies는 문자열로 이루어진 배열이므로
  // hobby는 자동으로 string 타입으로 추론된다.
  console.log(hobby);
}

// any[] : 여러 타입으로 이루어진 배열
// *** any는 여러 타입을 허용하므로 유연해 타입스크립트의 목적에 어긋난다.
let box: any[];
box = ["ball", 3, true];

// 튜플 : 길이와 타입이 고정된 배열
// 타입스크립트에 추가된 타입(자바스크립트에서는 존재하지 않음)
// 1) 배열의 길이는 정의된 타입 개수만큼만 가져야 한다. => 배열의 길이는 2개여야 한다.
// 2) 첫 번째 요소는 number 타입, 두 번째 요소는 string이어야 한다.
const market: {
  name: string;
  fruits: [number, string]; // 튜플 타입
} = {
  name: "t-mart",
  fruits: [2000, "apple"],
};

// 항상 2개의 요소를 가진(미리 정의된 구조에 맞는) 배열을 할당해야 한다.
market.fruits = [1000, "banana"];
// market.fruits = [1000]; // 에러 발생
// market.fruits = [1000, 'banana', 'apple']; // 에러 발생

// 배열의 길이는 2여야 하지만 에러가 발생하지 않는다.
// 타입스크립트는 이 예외를 감지하지 못한다.
// 튜플의 목적은 배열의 특정 요소의 타입을 지정한다는 것에 있다.
market.fruits.push("banana");
console.log(market.fruits); // [2000, 'apple', 'banana']

// 에러 발생 : 첫 번째 요소는 number 타입이여야 한다.
// market.fruits[0] = "banana";

// enum(열거형)
// 타입스크립트에만 존재하며 관련 값들을 정의한 상수들의 집합을 말한다.
// enum의 값은 대문자로 작성하는 것이 좋다.
enum Role {
  ADMIN,
  READ_ONLY,
  AUTHOR,
}

/*
// 컴파일 결과(JS)
// 값이 할당되지 않았으므로 0부터 1씩 증가하는 숫자가 저장된다.
// ADMIN = 0, READ_ONLY = 1, AUTHOR = 2
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["READ_ONLY"] = 1] = "READ_ONLY";
    Role[Role["AUTHOR"] = 2] = "AUTHOR";
})(Role || (Role = {}));
*/

const documents = {
  role: Role.READ_ONLY,
};

if (documents.role === Role.READ_ONLY) {
  console.log("correct");
}

// (1) 아무것도 할당하지 않은 경우
// enum Role {
//   ADMIN, // 0
//   READ_ONLY, // 1
//   AUTHOR, // 2
// }

// (2)
// enum Role {
//   ADMIN = 6, // 6
//   READ_ONLY, // 7
//   AUTHOR, // 8
// }

// (3) 서로 다른 값을 할당한 경우
// enum Role {
//   ADMIN = 10, // 10
//   READ_ONLY = 100, // 100
//   AUTHOR = 999, // 999
// }

// (4) 다양한 타입의 값을 할당한 경우
// enum Role {
//   ADMIN = 'ADMIN',
//   READ_ONLY = 100,
//   AUTHOR = 'EXTRA',
// }

// any
// 모든 타입을 허용하므로 가능한 지양해야 한다.
