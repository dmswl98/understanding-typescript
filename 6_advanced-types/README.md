# Section 6: Advanced Types

## 1. Intersection Types

- 인터섹션 타입을 사용해 다른 타입을 결합할 수 있다.
- & 연산자를 이용해 서로 다른 타입을 결합한다.

```typescript
type Admin = {
  name: string;
  privilages: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// 두 타입(Admin, Employee)이 결합된 새로운 타입 생성
type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Max",
  privilages: ["create-server"],
  startDate: new Date(),
};

// 주로 type을 이용해 작성되는 것이 권장되지만 interface를 이용해서도 서로 다른 타입들을 결합할 수 있다.
// interface Admin {
//   name: string;
//   privilages: string[];
// };

// interface Employee {
//   name: string;
//   startDate: Date;
// };

// interface ElevatedEmployee extends Admin, Employee {};

// 유니언 타입
type Combinable = string | number;
type Numeric = number | boolean;

// Combinable 타입과 Numeric 타입의 교집합 타입은 number이므로 type Universal = number로 간주된다.
type Universal = Combinable & Numeric;
```

## 2. Type Guards

- 런타임 시 특정 타입으로 작업을 수행하기 전에 해당 타입을 검사하는 코드 패턴이다.
- 3가지 방법으로 타입 가드를 작성할 수 있다.
  1. typeof 키워드
  2. in 키워드
  3. instanceof 키워드

```typescript
// 1) typeof를 사용하는 타입 가드 : add 함수의 if문 코드을 타입 가드라 하며 유니온 타입이 지닌 유연성을 활용하는 타입 가드이다.
function add(a: Combinable, b: Combinable) {
  // 타입 가드
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

// 유니언 타입
type UnknownEmployee = Employee | Admin;

// 2) in 키워드를 이용한 타입 가드
function printEmployeeInfo(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  // 타입 가드
  // if문은 런타임 시 실행되므로 if문 내부에 타입을 작성할 수 없다.
  // 직접 타입을 비교할 수 없다. 즉, if (typeof emp === "Employee")라고 작성할 수 없다.
  if ("privilages" in emp) {
    console.log("Privilages: " + emp.privilages);
  }

  if ("startDate" in emp) {
    console.log("StartDate: " + emp.startDate);
  }

  // *** 타입 가드 코드가 필요한 이유
  // emp는 Employee 타입 또는 Admin 타입을 가질 수 있지만 아래 코드에서 에러가 발생한다.
  // 그 이유는 emp가 항상 Admin 타입을 보장할 수 없기 때문이다.
  // console.log("Privilages: " + emp.privilages);

  // 또한 emp가 항상 Employee 타입을 보장할 수 없기 때문에 다음 코드에서도 에러가 발생한다.
  // console.log("StartDate: " + emp.startDate);
}

printEmployeeInfo(e1);
// Name: Max
// Privilages: create-server
// StartDate: Sat Oct 01 2022 17:50:22 GMT+0900 (한국 표준시)

printEmployeeInfo({ name: "Tom", startDate: new Date() });
// Name: Tom
// StartDate: Sat Oct 01 2022 17:51:42 GMT+0900

// 3) instanceof를 이용한 타입 가드
class Car {
  drive() {
    console.log("Driving...");
  }
}

class Truck {
  drive() {
    console.log("Driving a truck...");
  }

  loadCargo(amount: number) {
    console.log("Loading cargo..." + amount);
  }
}

type Vehicle = Car | Truck;
const v1 = new Car();
const v3 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  // instanceof를 이용한 타입 가드
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
  // in 연산자를 이용한 타입 가드도 가능하다.
  if ("loadCargo" in vehicle) {
    vehicle.loadCargo(1000);
  }
  // 에러 발생 : vehicle이 항상 Truck의 인스턴스를 보장할 수 없기 때문이다.
  // vehicle.loadCargo(1000);
}
```

## 3. Discriminated Unions

- 구별된 유니언
- 타입 가드를 쉽게 구현할 수 있게 하는 유니언 타입
- 'type'이나 'kind' 프로퍼티에 타입 명을 작성하여 유니언을 구성하는 모든 타입 객체에는 공통 속성을 갖도록한다.
- 인터페이스 내부에 작성된 속성은 사실상 타입 속성값이기 보다 리터럴 타입이다.
- 주어진 속성의 존재 여부(in 연산자)를 확인하거나 instance 연산자를 사용하는 것이 아닌 실제 속성(공통 속성)을 확인해 어떤 타입인지 파악할 수 있다.
- ide 자동 완성 기능이 존재해 오타의 위험을 줄여준다.

```typescript
interface Bird {
  type: "bird";
  flyingSpeed: number;
}

interface Horse {
  type: "horse";
  runningSpeed: number;
}

type Animal = Bird | Horse;

// 이전의 방식
// function moveAnimal(animal: Animal) {
//    if ("flyingSpeed" in animal) {
//      console.log("Moving with Speed: " + animal.flyingSpeed);
//    }
//    if ("runningSpeed" in animal) {
//      console.log("Moving with Speed: " + animal.runningSpeed);
//    }
// }

// 구별된 유니언 타입을 이용한 방식
// switch문에 각 객체의 공통 속성인 타입을 설명하는 속성을 이용해 타입 안전성을 갖출 수 있다.
function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
      break;
  }
  console.log("Moving with Speed: " + speed);
}

moveAnimal({ type: "bird", flyingSpeed: 10 }); // Moving with Speed: 10

// 에러 발생
// moveAnimal({type : 'bird', runningSpeed: 10});
```

## 4. Type Casting

- 형 변환(타입 캐스팅)
- 타입스크립트가 직접 감지하지 못하는 특정 타입의 값을 타입스크립트에게 알리는 것을 말한다.
- 화살표 괄호 내부에 타입을 명시하거나 as 구문을 사용해 타입을 명시할 수 있다.
- 타입 캐스팅은 **타입을 변환한다는 뜻이 아니라 타입스크립트에 특정 값이 특정 타입임을 알리기 위해 사용**된다.
- 타입 캐스팅의 방법은 두 가지가 존재한다.
  1. 화살표 괄호 내부에 타입을 선언하는 방법
  2. as 구문을 이용해 타입을 선언하는 방법

```typescript
// 1) querySelector
// 타입스크립트가 변수 paragraph1를 HTML의 paragraph 요소임을 추론하였다.
// const paragraph1: HTMLParagraphElement | null
const paragraph = document.querySelector("p");

// 2) getElementById
// 위와 다르게 타입스크립트는 변수 inputEle를 HTML의 어떤 요소인지를 추론하지 못한다.
// 느낌표를 작성해 해당 요소가 null이 아님을 명시하였으므로 더 이상 null로 추론되지 않는다.
// const inputEle: HTMLElement

// [형 변환 방법 1] 화살표 괄호 내부에 타입을 명시하여 해당 요소는 항상 해당 타입을 갖음을 보장할 수 있다.
const userInput1 = <HTMLInputElement>document.getElementById("user-input")!;

// [형 변환 방법 2] as 구문을 사용해 타입을 명시한다.
const userInput2 = document.getElementById("user-input")! as HTMLInputElement;

// 'userInput1.value'에서 에러가 발생하는 이유는 객체가 null일 수 있기 때문이다.
// 이는 선택된 객체 끝에 느낌표를 작성해 해당 요소가 null이 아님을 명시해야 한다.
// 또한, 'value'에서 에러가 발생하는 이유는 userInput1 요소가 단순히 HTML 요소가 아닌 HTMLInputElement 요소임을 타입스크립트에게 명시하지 않았기 때문이다.
userInput1.value = "hi!";
```

## 5. Index Properties

- 인덱스 속성
- 객체 프로퍼티의 **key의 타입을 선언**할 때 사용된다.

```typescript
interface ErrorContainer {
  // { email: 'Not a vaild email', username: 'Must start with a capital character!' }
  // key는 boolean 타입을 가질 수 없다.

  // 작성된 프로퍼티의 key와 value의 값은 모르지만 모두 문자열을 가져야 함을 정의한 것과 같다.
  [prop: string]: string;

  // 이 부분은 에러가 발생하지 않지만, 이 부분을 주석 해제하면 interface로 작성되어 있으므로 해당 타입을 갖는 객체에 id 프로퍼티를 무조건 작성해야 한다.
  // id : string;

  // 위에 정의된 인덱스 속성에 따라 key값과 value값 모두 문자열이어야 하므로 에러가 발생한다.
  // id: number;
}

const errorBag: ErrorContainer = {
  email: "Not a vaild email",
  username: "Must start with a capital character!",
};
```

## 6. Function Overloads

- 같은 이름을 가진 함수를 여러 개 정의할 수 있다.
- 각 함수는 서로 다른 타입을 가진 매개변수로 정의되어야 한다.
- 매개변수의 개수나 타입이 다르고 함수의 이름이 동일한 함수를 함수 오버로딩이라고 한다.
- 중괄호는 작성하지 않는다.
- 해당 함수 상단에 함수 오버로드 코드를 작성한다.
- **함수의 반환 타입을 정확히 추론하지 못하는 경우에 사용된다.**
- 타입스크립트는 함수의 정보와 함수의 구현 코드를 하나로 병합하여 작동한다.

```typescript
// 위 add 함수 참고
// function add(a: Combinable, b: Combinable) {
//    // 타입 가드
//    if (typeof a === "string" || typeof b === "string") {
//      return a.toString() + b.toString();
//    }
//    return a + b;
// }

// result값의 타입은 문자열이지만 타입스크립트는 문자열이나 숫자형을 지닐 것이라고 추론하고 있다.
const result = add("Max", "Tom");
// 타입스크립트가 result값의 타입을 문자열이라고 추론하지 못해 문자열 메서드에서 에러가 발생한다.
// result.split(' ');

// 이는 해당 함수 오버로드를 작성해 해결할 수 있다.

// add1 함수의 인수 a와 b는 number, string 또는 Combinable 타입을 가질 수 있음을 알 수 있다.
// 두 인수가 모두 숫자형이라면 이 함수는 숫자형을 반환한다고 명시적으로 작성한 것이다.
function add1(a: number, b: number): number;
function add1(a: string, b: string): string;
function add1(a: string, b: number): string;
function add1(a: number, b: number): string;
function add1(a: Combinable, b: Combinable) {
  // 타입 가드
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

// 함수 오버로드를 통해 result1의 값은 string으로 추론된다.
// 그러므로 문자열 메서드를 사용한 코드에서 에러가 발생하지 않는다.
const result1 = add1("Max", "Tom");
result1.split(" ");
```

## 7. Optional Chaining

- 선택적 체이닝
- 선택적 체이닝 연산자(?.)는 객체 데이터의 중첩된 속성과 객체에 안전하게 접근할 수 있도록 한다.
- 선택적 체이닝 연산자(?.) 앞의 요소가 정의되지 않았다면 그 이후 요소에는 접근하지 않기 때문이다.
- 백엔드에서 접근하고자 하는 데이터의 존재 여부가 확실치 않은 요소에 사용한다.

```typescript
const fetchUserData = {
  id: "u1",
  name: "Max",
  // job: { title: "CEO", description: "My own company" },
};

// 에러 발생 : 해당 객체에 job 속성을 주석 처리했으므로 에러가 발생한다.
// console.log(fetchUserData.job.title);

// 현재 job 요소가 주석 처리되어 있으므로 당연히 에러가 발생한다.
// 만약 job 요소가 주석 해제된 경우이면 정상적으로 동작한다.
// console.log(fetchUserData?.job?.title);
```

## 8. Nullish Coalescing

- 널 병합
- 널 병합 연산자 : ??
- 연산자 왼쪽 항이 null이거나 undefined라면 오른쪽 항을 반환한다.
- 널 병합 연산자를 사용하면 피연산자 중 '값이 할당된' 변수를 빠르게 찾을 수 있다.
- 빈 문자열('')과 0은 truthy value로 취급한다.

```typescript
const input1 = "";
const input2 = "hi";

const data1 = input1 ?? "Default";
const data2 = input2 ?? "Default";
console.log(data1); // ''
console.log(data2); // 'hi'
```
