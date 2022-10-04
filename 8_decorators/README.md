# Section 8: Decorators

## 데코레이터 설정

> tsconfig.json > compilerOptions > experimentalDecorators: true

## 1. Decorator

- 데코레이터는 클래스, 프로퍼티(속성), 메서드, 접근 제어자, 매개변수 등에 사용할 수 있는 특별한 함수이다.
- 선언된 데코레이터 함수를 사용할 때는 데코레이터 이름 앞에 @를 붙인다.
- 데코레이터는 클래스를 정의할 때 실행되며, 클래스 내부의 메서드를 실행하거나 프로퍼티에 접근할 때 작동되지 않는다.
- 즉, 데코레이터가 설정된 클래스로 한 인스턴스를 생성하지 않더라도 데코레이터는 작동한다.

## 2. Class Decorator

- 라이브러리 내 데코레이터명은 대부분 대문자로 시작하므로 첫 글자를 대문자로 작성한다.
- 설정된 클래스 선언을 관찰, 수정 또는 대체하는데 사용한다.
- 클래스 데코레이터는 런타임에 함수로 호출된다.
- 데코레이팅되는 클래스가 유일한 인자로 전달되어 호출된다.
- 클래스 데코레이터는 클래스에 해당하는 인스턴스가 생성되지 않고 클래스가 정의만 되어도 실행된다.

```typescript
function Logger(constructor: Function) {
  console.log("Logging...");
  console.log(constructor);
  // 아래의 내용이 차례로 출력된다.
  // Logging...
  // class Person {
  //   constructor() {
  //     this.name = "Max";
  //     console.log("Creating person object...");
  //   }
  // }
}

@Logger
class Person {
  name = "Max";

  constructor() {
    console.log("Creating person object...");
  }
}

const person = new Person();
console.log(person); // Person { name: 'Max' }
```

## 3. Decorator Factories

- 데코레이터 팩토리
- 데코레이터 함수에서 팩토리를 사용해 사용자로부터 인자를 전달받을 수 있다.
- 데코레이터 팩토리 함수는 '데코레이터 함수'를 감싸는 래퍼 함수이다.
- 'Logger1()'는 데코레이터 팩토리 함수를 실행하는 것이 아니라 데코레이터 팩토리 함수가 반환하는 데코레이터 함수를 실행하는 것이다.

```typescript
// 데코레이터 펙토리 : 데코레이터 함수를 감싸는 함수이다.
function Logger1(logString: string) {
  console.log(`Logger1's decorator facotry`);
  // 데코레이터 함수
  return function (constructor: Function) {
    // console.log(`Logger1's decorator function`);
    console.log(logString);
    console.log(constructor);
    // 아래의 내용이 차례로 출력된다.
    // Logging - factory
    // class Person1 {
    // constructor() {
    // this.name = "Max";
    // console.log("Creating person object...");
    // }
    // }
  };
}

// 데코레이터 팩토리를 이용하면 값을 전달할 수 있다.
@Logger1("Logging - factory")
class Person1 {
  name = "Max";

  constructor() {
    console.log("Creating person object...");
  }
}
```

## 4. Useful Decorators

- 유용한 데코레이터 만들기

```typescript
function WithTemplate(template: string, hookId: string) {
  console.log(`WithTemplate's decorator facotry`);
  return function (_: Function) {
    console.log("rendering template");
    // 함수 내부에서 constructor 인수를 사용하지 않으므로 '_'를 입력한 것이다.
    // 함수 내부에서는 필요 없지만 constructor 인수가 자동 할당되므로 타입은 명시해야 한다.
    // 즉, 자동 할당되는 인수의 존재는 알지만 함수 내부에서 쓰지 않음을 명시한 것이다.
    const ele = document.getElementById(hookId)!;
    if (hookId) {
      // ele 요소 내부에 template 문자열이 랜더링됨을 알 수 있다.
      ele.innerHTML = template;
    }
  };
}

@WithTemplate("<h1>Decorators!!!</h1>", "app")
class Person2 {
  name = "Max";

  constructor() {
    console.log("Creating person object...");
  }
}

// 데코레이터를 이용해 클래스 내부 필드 출력하기
function WithTemplate1(template: string, hookId: string) {
  return function (constructor: any) {
    const ele = document.getElementById(hookId)!;
    const p = new constructor();
    if (hookId) {
      // ele 요소 내부에 template 문자열이 랜더링됨을 알 수 있다.
      ele.innerHTML = template;
      // ele 요소 내부의 h1 태그 내용을 클래스 내 name 필드로 변경하여 화면에 'Max'가 랜더링된다.
      ele.querySelector("h1")!.textContent = p.name;
    }
  };
}

@WithTemplate1("<h1>Decorators!!!</h1>", "app")
class Person3 {
  name = "Max";

  constructor() {
    console.log("Creating person object...");
  }
}
```

## 5. Multiple Decorators

- 여러 데코레이터 설정하기
- 아래 두 데코레이터에 의해 다음과 같이 차례로 출력되므로 설정한 데코레이터가 클래스와 가장 가까운 것부터 실행됨을 알 수 있다.
- 즉, 데코레이터 함수는 다음의 출력 순서를 갖는다.
  - rendering template -> (1) WithTemplate 데코레이터 함수 실행
  - Decorator 1 -> (2) Logger1 데코레이터 함수 실행
- 사실 **데코레이터 팩토리 함수가 먼저 수행**된다.
  - Logger1's decorator facotry -> (1) Logger1 데코레이터 팩토리 함수 실행
  - WithTemplate's decorator facotry -> (2) WithTemplate 데코레이터 팩토리 함수 실행
  - rendering template -> (3) WithTemplate 데코레이터 함수 실행
  - Decorator 1 -> (4) Logger1 데코레이터 함수 실행

```typescript
@Logger1("Decorator 1")
@WithTemplate("<h1>Decorator 2</h1>", "app")
class Person4 {
  name = "Max";

  constructor() {
    console.log("Creating person object...");
  }
}
```

## 6. Property Decorators

- 속성(프로퍼티) 데코레이터
- 특정 속성 선언 앞에서 사용된다.
- 속성 선언을 확인, 수정, 교체하는데 사용된다.
- 속성 데코레이터 함수는 전달받는 인자가 2개이며 다음과 같다.
  1. target: any
  2. prop: string

```typescript
function Log(target: any, propertyName: string | Symbol) {
  console.log("Property decorator!");
  console.log(target); // (객체의 프로퍼티) { constructor: ƒ, getPriceWithTax: ƒ }
  console.log(propertyName); // (설정한 데코레이터 아래에 작성된 프로퍼티 이름) title
}

class Product {
  @Log
  title: string;
  private _price: number;

  set price(val: number) {
    if (val > 0) {
      this._price = val;
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
```

## 7. Accessor Decorators

- 접근 제어자 데코레이터
- 접근 제어자 앞에 사용된다.
- 접근 제어자에 대한 선언 확인, 수정, 교체하는데 사용된다.
- 접근 제어자 데코레이터 함수는 전달받는 인자가 3개이며 다음과 같다.
  1.  target: any
  2.  prop: string
  3.  descriptor: PropertyDescriptor

```typescript
function Log2(target: any, name: string, description: PropertyDescriptor) {
  console.log("Accessor decorator!");
  console.log(target); // (객체의 프로퍼티) { constructor: ƒ, getPriceWithTax: ƒ }
  console.log(name); // (setter 함수명) price
  console.log(description); // (setter 함수만 작성되었음을 알 수 있다.) { get: undefined, enumerable: false, configurable: true, set: ƒ }
}

class Product2 {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
```

## 8. Method Decorators

- 메서드 데코레이터
- 메서드 선언 앞에 사용된다.
- 메서드 선언을 확인, 수정, 교체하는데 사용된다.
- 메서드 데코레이터 함수는 전달받는 인자가 3개이며 다음과 같다.
  1. target: any
  2. prop: string
  3. descriptor: PropertyDescriptor

```typescript
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator!");
  console.log(target); // (객체의 프로퍼티) { constructor: ƒ, getPriceWithTax: ƒ }
  console.log(name); // (메서드명) getPriceWithTax
  console.log(descriptor); // { writable: true, enumerable: false, configurable: true, value: ƒ }
}

class Product3 {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }
  @Log3
  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
```

## 9. Parameter Decorators

- 파라미터(매개변수) 데코레이터
- 클래스 생성자 함수 또는 메서드의 매개변수에 사용된다.
- 매개변수 데코레이터 함수는 전달받는 인자가 3개이며 다음과 같다.
  1. target: any
  2. prop: string
  3. parameter_index: number

```typescript
function Log4(target: any, name: string | Symbol, position: number) {
  console.log("Parameter decorator!");
  console.log(target); // (객체의 프로퍼티) { constructor: ƒ, getPriceWithTax: ƒ }
  console.log(name); // (메서드명) getPriceWithTax
  console.log(position); // (메서드의 인수 인덱스) 0
}

class Product4 {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }
  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}
```

## 10. Returning (and changing) a Class in a Class Decorator

> 이제껏 작성한 데코레이터 함수는 어떠한 것도 반환하지 않았다. 즉, 데코레이터 팩토리 함수는 데코레이터 함수를 반환하지만 데코레이터 함수는 아무것도 반환하지 않았다. 데코레이터 함수에서 반환 값을 추가해보자

- 클래스 데코레이터 함수의 클래스 반환
- 반환된 클래스의 내부 코드는 클래스가 정의될 때 수행되지 않고 데코레이터를 설정한 클래스의 인스턴스를 생성한 경우에 실행된다.
- 인스턴스를 생성하지 않으면 화면에 클래스 필드 name의 값이 랜더링되지 않는다.
- 클래스를 반환함으로써 데코레이터가 설정된 클래스를 대체 및 확장할 수 있다.

```typescript
function WithTemplate2(template: string, hookId: string) {
  return function <T extends { new (...args: any[]): { name: string } }>(
    Originalconstructor: T
  ) {
    // 클래스를 반환할 때, 클래스의 이름을 작성하지 않아도 된다.
    return class extends Originalconstructor {
      constructor(..._: any[]) {
        super();
        const ele = document.getElementById(hookId)!;
        if (hookId) {
          ele.innerHTML = template;
          ele.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

@WithTemplate2("<h1>Return value</h1>", "app")
class Person5 {
  name = "Max";

  constructor() {
    console.log("Creating person object...");
  }
}

// 클래스 데코레이터가 반환하는 클래스 내부 코드가 실행되어 화면에 'Max'가 랜더링된다.
const per = new Person5();
```

## 11. Other Decorator Return Types

- 기타 데코레이터의 반환 타입
- 메서드 데코레이터나 접근 제어자 데코레이터는 어떤 값(property descriptor)을 반환할 수 있는 데코레이터이다.
- 프로퍼티 데코레이터나 매개변수 데코레이터는 어떤 값을 반환하지만 이를 타입스크립트가 무시한다.

- 접근 제어자 데코레이터와 메서드 데코레이터는 프로퍼티의 descriptor를 얻는다.
- PropertyDescriptor는 타입스크립트가 아닌 자바스크립트 개념이다.

### 접근 제어자 데코레이터

```typescript
function Log2(target: any, name: string, description: PropertyDescriptor) {
  console.log("Accessor decorator!");
  console.log(target); // (객체의 프로퍼티) { constructor: ƒ, getPriceWithTax: ƒ }
  console.log(name); // (setter 함수명) price
  console.log(description); // (setter 함수만 작성되었음을 알 수 있다.) { get: undefined, enumerable: false, configurable: true, set: ƒ }
}
```

### 메서드 데코레이터

```typescript
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator!");
  console.log(target); // (객체의 프로퍼티) { constructor: ƒ, getPriceWithTax: ƒ }
  console.log(name); // (메서드명) getPriceWithTax
  console.log(descriptor); // { writable: true, enumerable: false, configurable: true, value: ƒ }
}
```

### 접근 제어자 데코레이터의 descriptor 반환하기

```typescript
function Log5(
  target: any,
  name: string,
  description: PropertyDescriptor
): PropertyDescriptor {
  console.log("Accessor decorator!");
  console.log(target); // (객체의 프로퍼티) { constructor: ƒ, getPriceWithTax: ƒ }
  console.log(name); // (setter 함수명) price
  console.log(description); // (setter 함수만 작성되었음을 알 수 있다.) { get: undefined, enumerable: false, configurable: true, set: ƒ }
  return {};
}
```

### 메서드 데코레이터의 descriptor 반환하기

```typescript
function Log6(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  console.log("Method decorator!");
  console.log(target); // (객체의 프로퍼티) { constructor: ƒ, getPriceWithTax: ƒ }
  console.log(name); // (메서드명) getPriceWithTax
  console.log(descriptor); // { writable: true, enumerable: false, configurable: true, value: ƒ }
  return {};
}
```

## 12. Creating an "Autobind" Decorator

```typescript
class Printer {
  message = "This works";

  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
p.showMessage(); // 'This works'

const button = document.querySelector("button")!;

// 콜백 함수인 showMessage 내부의 this가 button을 가리키므로 제대로 작동하지 않는다.
button.addEventListener("click", p.showMessage); // undefined

// this를 bind에 작성한 p를 참조하도록 해야 정상적으로 동작한다.
button.addEventListener("click", p.showMessage.bind(p)); // 'This works'
```

### 'Autobind' 메서드 데코레이터를 이용한 바인딩

```typescript
// Autobind에서 항상 this 키워드를 해당 메서드에 속한 객체로 설정하고자 한다.
function Autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
  // descriptor.value를 통해 메서드에 접근할 수 있다.
  const originalMethod = descriptor.value; // 데코레이터를 설정한 메서드를 가리킨다. (showMessage 메서드)
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      // this는 메서드를 호출하는 객체를 가리킨다.
      // p1.showMessage -> showMessage.bind(p1)
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  console.log(adjDescriptor);
  // 반환된 descrptior 객체는 이전의 descriptor를 덮어쓴다.
  return adjDescriptor;
}

class Printer1 {
  message = "This works";

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p1 = new Printer1();

// Autobind 데코레이터를 통해 제대로 바인딩이 되었음을 알 수 있다.
const button1 = document.querySelector("button")!;
button1.addEventListener("click", p1.showMessage); // 'This works'
```

## 13. Validation with Decorators

### 속성(프로퍼티) 데코레이터를 이용한 유효성 검사

```typescript
interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; // ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  // target.constructor.name : 클래스명
  // propName : 속성명
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "required",
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "positive",
    ],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  // 기존에는 데이터를 추가하기 전에 유효성 검사 로직을 이 부분에 작성하였다.
  // if(title.trim().length > 0 && price > 0) {}

  const createdCourse = new Course(title, price);
  console.log(createdCourse);

  if (!validate(createdCourse)) {
    alert("Invalid input, please try again!");
    return;
  }
});
```
