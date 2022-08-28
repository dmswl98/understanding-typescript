# Section 2: Typescript Basics & Basic Types

## javascript type vs. typescript type

- 자바스크립트의 typeof를 이용해 변수의 타입을 확인하는 방법과 타입스크립트를 사용하는 방법의 비교 : **타입스크립트의 타입은 <U>컴파일</U> 중에 확인**되는 반면, **자바스크립트 타입은 <U>런타임</U>에 확인**된다.

### 자바스크립트 코드

```javascript
const max = "Max";
let name;
if (typeof max === "string") {
  name = max;
}
```

### 타입스크립트 코드

```typescript
let name: string;
name = "Max";
```

## 함수의 매개변수 타입 설정

```typescript
// n1과 n2는 number 타입을 가져야 한다.
function add(n1: number, n2: number) {
  return n1 + n2;
}
```

## 타입 추론

- **변수가 이미 초기화되었다면**, 타입스크립트는 그 값을 통해 타입을 추론하며, 별도로 타입을 정의하지 않아도 된다.

  ```typescript
  const num = 5;
  const num: number = 5; // 불필요한 타입 정의

  let comment = "good";
  // comment의 타입은 string로 추론되므로
  // number 타입의 값을 할당하면 에러가 발생한다.
  comment = 5; // 에러 발생
  ```

- **변수가 아직 초기화되지 않았다면**, 변수에 저장될 값의 타입을 정의해야 한다.

  ```typescript
  let num: number;
  num = 5;
  num = "5"; // 에러 발생
  ```

- const 변수 타입은 값을 재할당할 수 없기 때문에 타입으로 추론되지 않고 **할당된 값의 리터럴 타입으로 추론**된다.

  ```typescript
  // number 타입으로 추론되지 않고 5 타입으로 추론된다.
  const num = 5;
  ```

## 객체 타입

- 아래 코드의 경우, 이미 객체 키 값에 대해 값이 할당되어 있어 **타입 추론이 가능하므로 따로 타입 정의를 하지 않아도 된다.**

```typescript
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
```

## 배열 타입

- string[] : 문자열로 이루어진 배열
- any[] : 여러 타입으로 이루어진 배열

```typescript
let hobbies: string[];
hobbies = ["sports", "game", "cooking"];
for (const hobby of hobbies) {
  // hobbies는 문자열로 이루어진 배열이므로
  // hobby는 자동으로 string 타입으로 추론된다.
  console.log(hobby);
}

// *** any는 여러 타입을 허용하므로 유연해 타입스크립트의 목적에 어긋난다. 되도록 사용하지 않는 것이 좋다.
let box: any[];
box = ["ball", 3, true];
```

## 튜플 타입

- 길이와 타입이 고정된 배열을 말한다.
- 배열의 길이는 정의된 타입 개수만 가져야 한다.
- 배열의 특정 요소의 타입을 지정할 수 있다.
- 자바스크립트에는 존재하지 않으며 타입스크립트에 추가된 타입이다.

```typescript
// fruits : 첫 번째 요소는 number 타입, 두 번째 요소는 string이어야 한다.
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

// 배열의 길이는 2여야 하지만 에러가 발생하지 않는다. 타입스크립트는 이 예외를 감지하지 못하기 때문이다.
// 튜플의 목적은 배열의 특정 요소의 타입을 지정한다는 것에 있다.
market.fruits.push("banana");
console.log(market.fruits); // [2000, 'apple', 'banana']

// 에러 발생 : 첫 번째 요소는 number 타입이여야 한다.
// market.fruits[0] = "banana";
```

## enum 타입

- 열거형 타입
- 타입스크립트에만 존재하며 관련 값들을 정의한 상수들의 집합을 말한다.
- enum의 값은 대체로 대문자로 작성하는 것이 좋다.

```typescript
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
```

## union 타입

- 사용 이유

  - 함수를 재사용하기 위해 함수의 매개변수로 여러 타입을 허용해야 한다.
  - 이를 union 타입으로 해결할 수 있다.

  ```typescript
  function combine1(v1: number, v2: number) {
    return v1 + v2;
  }

  const combinedAges1 = combine1(30, 10);
  console.log(combinedAges1); // 40

  // 함수에 string 타입인 인자를 넘겼으므로 에러가 발생한다.
  // const combinedNames1 = combine1("Max", "i");
  ```

- 적용 예시

  - 서로 다른 두 종류의 타입을 허용할 수 있다.

  ```typescript
  // 즉, combinedAges, combinedNames를 하나의 combine2 함수로 해결할 수 있다.
  function combine2(v1: number | string, v2: number | string) {
    if (typeof v1 === "number" && typeof v2 === "number") return v1 + v2;
    else {
      return v1.toString() + v2.toString();
    }
  }

  const combinedAges2 = combine2(30, 10); // 40
  const combinedNames2 = combine2("Max", "i"); // Maxi
  ```

## 타입 별칭(사용자 정의 타입)

- 타입을 직접 생성할 수 있다.
- 타입 별칭을 사용해 불필요한 반복을 피하고 타입을 편리하게 관리할 수 있다.

### 예시 코드 1

```typescript
// 변수 m1은 객체 또는 문자열의 타입을 가질 수 있다.
type Manager = { name: string } | string;
let m1: Manager = { name: "Max" };
m1 = "Michael";
```

### 예시 코드 2 - 함수

```typescript
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
```

### 예시 코드 3 - 객체

```typescript
// 객체 타입 별칭
type User = { name: string; age: number };
const u1: User = { name: "Max", age: 30 };

// 타입 별칭 작성 전 --------------------------
function greet(user: { name: string; age: number }) {
  console.log("Hi, I am " + user.name);
}

function isOlder(user: { name: string; age: number }, checkAge: number) {
  return checkAge > user.age;
}

// 타입 별칭 작성 후 --------------------------
type User = { name: string; age: number };

function greet(user: User) {
  console.log("Hi, I am " + user.name);
}

function isOlder(user: User, checkAge: number) {
  return checkAge > user.age;
}
```

## 리터럴 타입

- 할당한 값을 타입으로 사용할 수 있다.

```typescript
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
```

## 함수 타입

### 함수 반환 값 타입 정의

- 타입을 명시적으로 설정할 이유가 없다면 굳이 타입을 설정하지 않고 타입스크립트의 타입 추론을 이용하는 것이 좋다.
- 반환 값이 없는 함수의 반환 타입은 void이다.

```typescript
function add(n1: number, n2: number): number {
  return n1 + n2;
}

// 반환 값이 없는 함수의 반환 타입은 void이다.
function printResult(num: number): void {
  console.log("result :", num);
}
```

### Function 타입

```typescript
function add(n1: number, n2: number): number {
  return n1 + n2;
}

function printResult(num: number): void {
  console.log("result :", num);
}

let resultValue1: Function;
resultValue1 = add; // 함수 할당
console.log(resultValue1(3, 4)); // 7

// 에러 발생 : resultValue 변수에 할당해야 하는 값의 타입은 Function이기 때문이다.
// resultValue = 5;

// 함수의 매개변수의 개수가 다르지만 타입스크립트는 이를 에러로 감지하지 못한다.
resultValue1 = printResult;
console.log(resultValue1(3, 4)); // undefined
```

### 함수 타입 정의

- 함수의 **매개변수와 반환값의 타입을 정의**하는 함수를 작성한다.
- 이를 통해 Function 타입의 예외를 해결할 수 있다.

```typescript
function add(n1: number, n2: number): number {
  return n1 + n2;
}

function printResult(num: number): void {
  console.log("result :", num);
}

let resultValue2: (a: number, b: number) => number;
resultValue2 = add;
console.log(resultValue2(3, 4)); // 7
// 에러 발생 : 해당 변수에 정의된 함수의 매개변수의 개수와 다른 함수를 할당했으므로 에러가 발생한다.
// resultValue2 = printResult;
```

### 콜백 함수의 타입 정의

```typescript
function addHandler(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  cb(result);
}

addHandler(10, 20, (result) => {
  console.log(result);
  // 콜백 함수는 반환 값의 타입을 void로 설정했더라도 값을 반환할 수 있다.
  // return "string";
});
```

## unknown 타입

- 어떤 타입의 값이 저장될지 모를 때 사용한다.
- 만약 어떤 타입이 저장될지 아는 경우에는 unknown 타입 대신 union 타입을 사용하는 것이 좋다. → 예시 : `let value: string | number;`
- unknown 타입으로 선언된 변수는 프로퍼티에 접근할 수 없으며, 메소드를 호출할 수 없고 인스턴스를 생성할 수 없다.
- any 타입과 동일하게 모든 타입을 허용하지만, unknown 타입으로 선언된 변수는 any를 제외한 다른 타입으로 선언된 변수에 할당될 수 없다.
  - 아래 예시와 같이 string 타입으로 선언된 변수에 unknown 타입의 변수를 할당할 수 없다.
  - unknown 타입의 변수를 typeof으로 타입 검사를 통해 에러를 피할 수 있다.

```typescript
let value: unknown;
value = 5;
value = "max";

let nameValue: string;
// 에러 발생 : string 타입으로 선언된 nameValue 변수에 unknown 타입을 가진 변수를 할당할 수 없다.
// 만약 변수 value가 any 타입인 경우, 아래의 코드는 에러가 발생하지 않는다.
// nameValue = value;

// 다음과 같이 작성하면 에러를 피할 수 있다.
if (typeof value === "string") {
  nameValue = value;
}
```

## never 타입

- never 타입이 발생하는 경우
  1. 리턴하지 않는 함수 (e.g. 함수 내용에 while(true){}가 들어 있는 경우)
  2. 항상 예외를 던지는 함수 (e.g. function foo(){throw new Error('Not Implemented')} 에서 foo의 리턴 타입이 never)
- **never 타입**은 **절대 리턴하지 않는 경우**를 말한다.
- **void 타입**은 **아무것도 리턴하지 않는 경우**를 말한다.

```tsx
function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code };
}

generateError("An error occurred!", 500);
```
