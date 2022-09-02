// 인터페이스명의 첫 글자는 항상 대문자
// 인터페이스는 '객체의 구조'를 설명하기 위해서 사용된다.
// 인터페이스 내에는 구현 코드가 아닌 기능의 구조를 작성한다.
// 사용자 정의 타입(type)보다 interface를 자주 사용하는 이유는
// 클래스가 인터페이스를 이행해야 하는 약속처럼 사용될 수 있기 때문이다.
// 즉, user 객체는 Person 인터페이스를 가지므로 인터페이스 내 정의된
// name, age, greet(필드 및 메서드)를 반드시 모두 포함해야 한다는 의미이다.
// 추상 클래스는 인터페이스와 달리 추상 메서드이외에 구체적으로 구현된 메서드를 포함할 수 있다.
interface Greetable {
  name: string;
  age: number;

  greet(phrase: string): void;
}

class Person1 implements Greetable {
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

// Person 객체는 Greetable 인터페이스에 기반한 것이므로
// user2 객체의 타입은 Greetable와 Person 모두 가능하다.
let user2: Greetable = new Person1("Tom");
user2.greet(`hi i'm`); // hi i'm Tom
console.log(user1.age); // 30

// readonly 키워드 : 읽기 전용 속성은 수정할 수 없다.
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

// 함수의 구조 정의 : type을 이용하는 것이 보편적이다.
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

// 인터페이스 옵션 설정
// 1) 인터페이스에 정의된 '속성' 또는 '메서드'를 반드시 사용하지 않고, 필요에 따라 선택적으로 사용할 때 설정한다.
// 2) 속성명 뒤에 물음표를 붙여 옵션을 설정할 수 있다.
// Car 클래스에서 인터페이스 Wheel의 옵셔널 속성을 작성하지 않아도 에러가 발생하지 않는다.
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

// 인터페이스는 컴파일된 자바스크립트 코드에서 볼 수 없다.
// 인터페이스는 개발 및 컴파일 도중에만 사용할 수 있는 타입스크립트 전용 기능이기 때문이다.

// 인터페이스 vs. 클래스
// 인터페이스 : 인스턴스화할 수 없으며 컴파일되지 않는다.(인터페이스는 타입스크립트 기능이기 때문이다.)
// 클래스 : 인스턴스화할 수 있으며 컴파일된다.
