# Section 5: Classes & Interfaces

## 클래스

```typescript
class Department1 {
  // 필드
  name: string;
  // private 필드
  private employees: string[] = [];

  // 생성자 메서드
  constructor(n: string) {
    this.name = n;
  }

  // 메서드: 클래스에 정의된 함수
  describe1() {
    console.log("Department: " + this.name);
  }

  describe2(this: Department1) {
    console.log("Department: " + this.name);
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printInfo() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

const accounting = new Department1("accounting");
console.log(accounting); // { name: accounting }

accounting.describe1(); // Department: accounting
accounting.describe2();

accounting.addEmployee("max");
accounting.addEmployee("tom");
accounting.printInfo(); // 2 ['max', 'tom']

const accountingCopy1 = { describe: accounting.describe1 };
// describe1 메서드 내부의 this는 accountingCopy1 객체를 바라보기 때문에 즉, accountingCopy1 객체에 name 필드가 없으므로 undefined가 출력된다.
accountingCopy1.describe(); // Department: undefined

// 해결 방법
const accountingCopy2 = { name: "2", describe: accounting.describe2 };
// accountingCopy2.describe(); // Department: 2
```

<br/>

### 1. private 필드

- 생성된 클래스 내부에서만 접근가능한 필드를 말한다.
- 해당 클래스를 상속한 클래스에서 접근이 불가능하다.
- 다음 코드는 에러를 발생시킨다.
  ```typescript
  accounting.employees[2] = "Anna"; // 에러 발생
  ```
  - employees는 private 필드이므로 외부에서 변경할 수 없다.
  - 단, 컴파일된 자바스크립트 코드에서는 에러가 발생하지 않고 정상적으로 동작하며, 그 이유는 바닐라 자바스크립트(es5)에서는 private, public 키워드가 없기 때문이다.
  - 컴파일을 수행하는 버전에 에러 발생 여부가 달려있음을 알 수 있다.

<br/>

### 2. 클래스 내 필드 약식 초기화 방법

```typescript
class Department2 {
  // private readonly id: string;
  // public name: string;

  protected employees: string[] = [];
  constructor(private readonly id: string, public name: string) {
    // this.id = id;
    // this.name = name;
  }
}
```

- 생성자 메서드 매개변수로 클래스 내 필드를 생성 및 초기화할 수 있다.
- readonly: 클래스 내부에서도 해당 필드를 변경할 수 없다.
- private: 선언된 클래스 내부에서만 접근 가능하다.
- protected: 선언된 클래스 내부에서는 접근 가능하지만 해당 클래스 외부에서는 변경 불가능하다.
- 예제

  ```typescript
  // 예시
  class Product {
    title: string;
    price: number;
    private isListed: boolean;

    constructor(name: string, pr: number) {
      this.title = name;
      this.price = pr;
      this.isListed = true;
    }
  }

  // 약식 초기화
  class Product {
    private isListed: boolean;
    constructor(public title: string, public price: number) {
      this.isListed = true;
    }
  }
  ```

<br/>

### 3. static 속성 및 메서드

```typescript
abstract class Department2 {
  // static property
  static fiscalYear = 2030;

  protected employees: string[] = [];
  constructor(protected readonly id: string, public name: string) {
    // this.id = id;
    // this.name = name;
    // static 속성은 클래스 이름을 사용해 접근할 수 있다.
    console.log(Department2.fiscalYear);
  }

  // static method
  static createEmployee(name: string) {
    return { name };
  }

  printInfo() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

// static 메서드 호출
const employee = Department2.createEmployee("max");
console.log(employee); // { name: 'max' }

// static 속성 접근
console.log(Department2.fiscalYear); // 2030
```

- 인스턴스로 접근 및 호출할 수 없으며, 클래스를 통해 직접 호출 가능하다.
- 또한, 작성된 클래스 내부에서 static 메서드 및 propery를 this를 통해 사용할 수 없다.

<br/>

### 4. 추상 메서드, 추상 클래스

```typescript
abstract class Department2 {
  static fiscalYear = 2030;

  protected employees: string[] = [];
  constructor(protected readonly id: string, public name: string) {}

  // static 메서드는 인스턴스로 호출할 수 없으며, 클래스를 통해 직접 호출 가능하다.
  static createEmployee(name: string) {
    return { name };
  }

  // 추상 메서드
  abstract describe(): void;

  // describe() {
  //   console.log(`Department (${this.id}): ` + this.name);
  // }

  updateId() {
    // 에러 발생: readonly 필드는 클래스 내부에서도 변경할 수 없다.
    // this.id = "d2";
  }

  printInfo() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

class ITDepartment extends Department2 {
  // admins: string[];
  constructor(id: string, public admins: string[]) {
    super(id, "IT");
  }

  // 부모 클래스의 추상 메서드인 describe 메서드를 구현해야 한다.
  describe() {
    console.log(`IT department ${this.id}`);
  }
}

const engineering = new ITDepartment("d2", ["tom"]);
// 추상 메서드가 아닌 경우
// engineering.describe(); // Department (d2): IT

// 추상 메서드인 경우
engineering.describe(); // IT department d2
console.log(engineering); // ITDepartment { id: 'd2', name: 'IT', admins: ['tom'] }
```

- 구현부는 작성하지 않은 채로 남겨둔 메서드를 말한다.
- 자식 클래스에도 해당 추상 메서드를 반드시 구현하도록 강요하기 위해 사용한다.
- 클래스 명 앞에도 `abstract` 키워드를 작성해야 한다.
- 추상 클래스는 인스턴스 생성이 불가하다.

<br/>

### 5. getter, setter

```typescript
class AccountingDepartment extends Department2 {
  private lastReports: string;

  get mostRecentReport() {
    if (this.lastReports) return this.lastReports;
    throw new Error("No report found.");
  }

  set mostRecentReport(value: string) {
    if (!value) throw new Error("error");
    this.addReport(value);
  }

  constructor(id: string, private reports: string[]) {
    super(id, "Account");
    this.lastReports = reports[0];
  }

  describe() {
    console.log(`accounting department ${this.id}`);
  }

  addEmployee(name: string) {
    if (name === "Max") {
      return;
    }
    // protected 키워드로 변경한 필드이므로 접근 및 변경이 가능하다.
    this.employees.push(name);
  }

  addReport(text: string) {
    this.reports.push(text);
  }

  printReports() {
    console.log(this.reports);
  }
}

const account = new AccountingDepartment("d3", ["get"]);
account.addReport("Something went wrong...");

// 추상 메서드
account.describe(); // accounting department d3

// getter
// reports 필드에 아무것도 없을 때
console.log(account.mostRecentReport); // Uncaught Error: No report found.
// reports 필드에 저장된 것이 있을 때
console.log(account.mostRecentReport); // get

// setter
account.mostRecentReport = "Year Report";
account.printReports(); // ['get', 'Something went wrong...', 'Year Report']
// account.mostRecentReport = ""; // Uncaught Error: error
```

- getter: 메서드 명만 작성하여 실행한다.
- setter: 등호를 이용해 전달할 값을 작성한다.

<br/>

### 6. 싱글톤 & private 생성자 함수

- 특정 클래스의 인스턴스를 하나만 갖도록 한다.
- static 메서드나 속성을 사용할 수 없다.
- 클래스 기반으로 여러 객체를 만들 수 없지만 하나의 객체를 보장한다.
- 해당 생성자 함수 앞에 private 키워드를 붙여 private 생성자 함수로 바꾸어야 한다.

```typescript
class AccountingDepartment extends Department2 {
  // AccountingDepartment 인스턴스를 static 속성인 instance에 저장한다.
  private static instance: AccountingDepartment;

  // private 생성자 함수
  private constructor(id: string, private reports: string[]) {
    super(id, "Account");
    this.lastReports = reports[0];
  }

  static getInstance() {
    if (AccountingDepartment.instance) {
      return this.instance;
    }
    // 해당 클래스 내부에서는 private 생성자를 호출할 수 있다.
    this.instance = new AccountingDepartment("d5", []);
    return this.instance;
  }
}

// account1과 account2는 같은 객체(인스턴스)를 갖는다.
const account1 = AccountingDepartment.getInstance();
const account2 = AccountingDepartment.getInstance();
```

## 인터페이스

- 인터페이스명의 첫 글자는 항상 대문자로 작성한다.
- 인터페이스는 주로 '객체의 구조'를 설명하기 위해서 사용된다.(함수의 구조를 정의할 수도 있다.)
- 인터페이스 내에는 구현 코드가 아닌 기능의 구조를 작성한다.
- 사용자 정의 타입(type)보다 interface를 자주 사용하는 이유는 클래스가 인터페이스를 이행해야 하는 약속처럼 사용될 수 있기 때문이다.
- 즉, user 객체는 Person 인터페이스를 가지므로 인터페이스 내 정의된 name, age, greet(필드 및 메서드)를 반드시 모두 포함해야 한다는 의미이다.
- 인터페이스와 달리 추상 클래스는 추상 메서드 이외에 구체적으로 구현된 메서드를 포함할 수 있다.
- 인터페이스는 개발 및 컴파일 도중에만 사용할 수 있는 타입스크립트 전용 기능이므로 인터페이스는 컴파일된 자바스크립트 코드에서 볼 수 없다.

```typescript
interface Greetable {
  name: string;
  age: number;

  greet(phrase: string): void;
}

class Person1 implements Greetable {
  // 인터페이스 Greetable의 모든 속성과 메서드를 구현해야 한다.
  name: string;
  age = 30;

  constructor(n: string) {
    this.name = n;
  }

  greet(phrase: string) {
    console.log(phrase + " " + this.name);
  }
}

let user1: Greetable;
user1 = {
  name: "Max",
  age: 30,
  greet(phrase: string) {
    console.log(phrase + " " + this.name);
  },
};

user1.greet("Hi there - I am"); // Hi there - I am Max

// Person 객체는 Greetable 인터페이스에 기반한 것이므로 user2 객체의 타입은 Greetable와 Person 모두 가능하다.
let user2: Greetable = new Person1("Tom");
user2.greet(`hi i'm`); // hi i'm Tom
console.log(user1.age); // 30
```

<br/>

### 1. readonly 키워드

- 읽기 전용 속성은 수정할 수 없다.

```typescript
// 1) 인터페이스의 경우
interface Greetable1 {
  readonly name: string;
  age: number;
}

// 2) type의 경우
type Greetable2 = {
  readonly name: string;
  age: number;
};

let user3: Greetable1 = {
  name: "tom",
  age: 20,
};

console.log(user3);
// 에러 발생: 읽기 전용 속성은 변경할 수 없다.
// user3.name = 'Eric';
```

<br/>

### 2. 인터페이스의 확장

```typescript
// 여러 인터페이스 구현하기
// (interface Named), (interface Greet), (class Person2 implements Greet, Named)로도 구현 가능하다.
interface Named {
  readonly name: string;
}

// 인터페이스 확장
interface Greet extends Named {
  greet(phrase: string): void;
}

// 클래스 Person2는 name과 greet를 작성해야 한다.
class Person2 implements Greet {
  name: string;
  age = 30;

  constructor(n: string) {
    this.name = n;
  }

  greet(phrase: string) {
    console.log(phrase + " " + this.name);
  }
}

const user4 = new Person2("Sam");
user4.greet("hi,"); // hi, Sam
```

<br/>

### 3. 함수의 구조 정의

- type을 이용하는 것이 보편적이다.

```typescript
// 1) type 이용한 방법
type AddFn = (a: number, b: number) => number;

let add: AddFn;
add = (n1: number, n2: number) => {
  return n1 + n2;
};

// 2) interface 이용한 방법: 익명 함수를 작성한다.
interface SubFn {
  (a: number, b: number): number;
}

let sub: SubFn;
sub = (n1: number, n2: number) => {
  return n1 - n2;
};
```

<br/>

### 4. 인터페이스의 옵션 설정

- 인터페이스에 정의된 '속성' 또는 '메서드'를 반드시 사용하지 않고, 필요에 따라 선택적으로 사용할 때 설정한다.
- 속성명 또는 메서드명 뒤에 물음표를 붙여 옵션을 설정할 수 있다.

```typescript
// Car 클래스에서 인터페이스 Wheel의 옵션을 설정한 속성을 작성하지 않아도 에러가 발생하지 않는다.
interface Wheel {
  readonly name?: string;
  model?: string;

  printInfo?(): void;
}

class Car implements Wheel {
  name?: string;

  constructor(n?: string) {
    if (n) this.name = n;
  }

  printInfo() {
    if (this.name) console.log("this is " + this.name);
    else console.log("No Name");
  }
}

const newCar1 = new Car("new car");
console.log(newCar1); // Car {name: 'new car'}
newCar1.printInfo(); // this is new car

// 생성자 함수의 매개변수 또한 옵션이 설정된 요소이므로 매개변수를 전달하지 않아도 에러가 발생하지 않는다.
const newCar2 = new Car();
newCar2.printInfo(); // No Name
```

<br/>

### 5. 인터페이스 vs. 클래스

- 인터페이스 : 인스턴스화할 수 없으며 컴파일되지 않는다.(인터페이스는 타입스크립트 기능이기 때문이다.)
- 클래스 : 인스턴스화할 수 있으며 컴파일된다.
