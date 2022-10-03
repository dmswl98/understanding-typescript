# Section 7: Generics

## 1. Generics

- 제네릭이란 타입을 마치 함수의 파라미터처럼 사용하는 것을 말한다.
- 한 가지 타입보다 여러 가지 타입에서 동작하는 함수를 생성하고자 할 때 사용한다.
- 함수를 정의할 때 타입을 고정적으로 설정하지 않고 함수를 호출할 때 동적으로 타입을 설정할 수 있도록 한다.

<br/>

### 배열 타입

- `Array<T>`와 같은 형식을 제네릭 타입이라고 한다. 이는 Array 타입과 T라는 타입과 연결된 타입을 말한다.
- 배열 내부에 특정 타입을 저장하도록 고정시키고 싶을 때 다음과 같이 작성한다.

```typescript
// 타입스크립트는 names1를 string[] 타입으로 추론한다.
const names1 = ["Max", "Manuel"];
// 배열 내부에 값이 없으므로 타입스크립트는 names2를 any[] 타입으로 추론한다.
const names2 = [];

// 제네릭 타입을 설정하여 배열 내부에 특정 타입을 가진 데이터를 저장할 수 있다.
// Array<string> === string[] (동일한 의미를 갖는다.)
const names3: Array<string> = ["str"];
names3[0].split(" "); // 이 배열의 요소가 문자열 타입임을 추론하기 때문에 에러가 발생하지 않는다.

// 유니언 타입을 사용해 해당 배열 내부에 문자열 요소나 숫자형 요소를 저장할 수 있다.
const names4: Array<string | number> = [];
```

<br/>

### 프로미스 타입

- 위 배열 타입(Array)과 같이 프로미스 타입(Promise)도 다른 타입과 함께 작성될 수 있다.
- 프로미스도 결국 어떠한 데이터를 반환하는 것이므로 다른 타입과 함께 사용될 수 있다.
- 타입을 지정하지 않으면 타입스크립는 변수 promise를 `Promise<unknown>`로 추론한다.
- 제네릭 타입을 이용해 자바스크립트에게 반환 값의 타입 정보를 전달하면 해당 반환 값에 사용된 메서드가 올바르게 호출하는지 판단할 수 있다.
- 즉, 아래의 promise에서 반환 값은 string이므로 `data.split(' ')` 코드에서 에러가 발생하지 않는 것이다.

```typescript
const promise: Promise<string> = new Promise((resolve, _) => {
  setTimeout(() => {
    resolve("This is done!");
  }, 2000);
});

promise.then((data) => {
  data.split(" ");
});
```

<br/>
<br/>

## 2. Generic Function

### **제네릭 타입 선언**하는 방법

- 함수의 매개변수 타입을 설정하는 것이다.
- 타입의 첫 글자인 'T'를 입력하며 관례상 **한 글자**를 사용하는 것이 일반적이다.
- 두 번째 제네릭 매개변수의 타입 이름은 알파벳 순서인 'U'를 사용하는 것이 일반적이다.
- 제네릭이란 **타입을 마치 함수의 파라미터처럼 사용**하는 것을 말한다.

```typescript
function merge(objA: object, objB: object) {
  return Object.assign(objA, objB);
}

// mergedObj의 타입은 object로 추론된다.
const mergedObj = merge({ name: "Max" }, { age: 33 }); // { name: 'Max', age: 33 }

// 추론되는 object 타입에 name 프로퍼티가 있음을 보장할 수 없으므로 에러가 발생한다.
// object 타입이 아닌 제네릭 타입을 이용해 구체적인 객체의 타입을 정의해야 한다.
// console.log(mergedObj.name);

// merge1 함수는 T와 U의 인터섹션 타입을 반환함을 추론하고 있다.
// 제네릭 타입은 함수를 정의할 때 타입을 고정적으로 설정하지 않고 함수를 호출할 때 동적으로 타입을 설정할 수 있도록 한다.
// 제네릭 타입을 사용해 각 매개변수에 작성된 값을 타입으로하여 유연하게 타입을 추론할 수 있다.
// objA와 objB의 타입명을 다르게 설정하였으므로 서로 다른 객체를 타입으로 가질 수 있다.
// *** extends 키워드로 제약 조건을 설정하지 않았기에 에러가 발생한다.
function merge1<T, U>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

// mergeObj1은 { name: string; } & { age: number; } 타입으로 추론된다.
// 아래의 코드는 merge1<{ name: string }, { age: number }>와 같이 작동한다.
const mergedObj1 = merge1({ name: "Max" }, { age: 33 }); // { name: 'Max', age: 33 }
console.log(mergedObj1.age); // 33
```

<br/>
<br/>

## 3. Working with Constraints

### **제약 조건**의 필요성

- 항상 Object.assign으로 인해 객체가 리턴되지만 merge1 함수의 두 번째 매개변수로 숫자 33을 작성해도 에러가 발생하지 않는 문제가 생긴다.
- **모든 매개변수에 객체가 작성되도록** T와 U 타입의 제약 조건을 작성해야 한다.

```typescript
const mergedObj2 = merge1({ name: "Max" }, 33); // { name: 'Max' }
```

<br/>

### 제약 조건 설정

- extends 키워드를 이용해 특정 타입을 갖도록 제약 조건을 설정한다.
- T와 U타입은 항상 객체여야 함을 명시하였다.

```typescript
function merge2<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

// 두 번째 매개변수가 객체가 아니므로 에러가 발생한다.
// const mergedObj3 = merge2({ name: "Max" }, 33);

const mergedObj4 = merge2({ name: "Max" }, { hobbies: ["sports"], age: 33 });
console.log(mergedObj4); // { name: 'Max', hobbies: ["sports"], age: 33 }
```

<br/>

### 인터페이스를 이용한 제약 조건 설정

- countAndDescribe 함수에서 T 타입은 Lengthy 인터페이스를 상속하였으므로 매개변수 element는 length 속성(프로퍼티)가 포함되어 있어야 한다.
- 만약 element의 타입을 제네릭 타입을 사용하지 않고 string이나 Array로만 작성한다면 이 함수는 하나의 특정 타입에만 사용가능한 제한적인 함수가 된다.

```typescript
interface Lengthy {
  length: number;
}

// 반환 값의 타입은 각각 [T, string]으로 명시하였다.
function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let text = "Got no value.";
  if (element.length === 1) {
    text = "Got 1 element.";
  } else if (element.length > 1) {
    text = "Got " + element.length + " elements.";
  }
  return [element, text];
}

// 매개변수에 문자열을 작성하더라도 문자열은 length 속성을 지니므로 정상적으로 작동한다.
console.log(countAndDescribe("hi there")); // ['hi there', 'Got 8 elements.']

// 배열은 length 속성을 지니므로 정상적으로 동작한다.
console.log(countAndDescribe([])); // [[], 'Got no value.']
console.log(countAndDescribe(["sports", "cooking"])); // [["sports", "cooking"], 'Got 2 elements.']

// 에러 발생 : 숫자형은 length 속성을 갖지 않으므로 에러가 발생한다.
// console.log(countAndDescribe(3));
```

<br/>
<br/>

## 4. keyof Constraint

### keyof 제약 조건의 필요성

- 항상 obj 객체 내부에 매개변수인 key로 하는 키 속성을 갖는지 보장하기 어렵기 때문에 `obj[key]`에서 에러가 발생한다.
- 이 경우 key 매개변수에 keyof 제약 조건을 갖는 타입을 설정하여 해결할 수 있다.

```typescript
// 에러 발생
function extractAndConvert1(obj: object, key: string) {
  return obj[key];
}
```

<br/>

### keyof 제약 조건 사용하기

- obj는 객체를 타입으로 한 T 타입이며, key는 T 타입 객체의 키를 갖는 U
  타입으로 설정해 위 에러를 해결하였다.

```typescript
function extractAndConvert2<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return obj[key];
}

// 에러 발생 : 객체에 U 타입을 갖는 key 매개변수에 해당하는 키가 존재하지 않기 때문이다.
// extractAndConvert2({}, 'name');

// 객체에 해당 두 번째 매개변수에 작성한 키가 존재하므로 정상적으로 작동한다.
console.log(extractAndConvert2({ name: "Max" }, "name")); // 'Max'
```

<br/>
<br/>

## 5. Generic Classes

### 제약 조건을 설정하지 않은 제네릭 클래스

- 제약 조건을 설정하지 않아 obejct 타입에서는 정상적으로 동작하지 않는 문제가 발생한다.

```typescript
class DataStorage<T> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    // 반환값의 타입은 T[]라고 추론된다.
    return [...this.data];
  }
}

// 배열에 문자열 요소만 저장하도록 제네릭 타입을 설정함
const textStorage = new DataStorage<string>();

// 에러 발생 : addItem의 매개변수는 문자열이어야 하기 때문이다.
// textStorage.addItem(10);

textStorage.addItem("Max");
textStorage.addItem("Tom");
textStorage.addItem("Eric");
textStorage.removeItem("Tom");
console.log(textStorage.getItems()); // ['Max', 'Eric']

const numberStorage = new DataStorage<number>();
numberStorage.addItem(10);

// 객체를 전달해 indexOf 메서드가 제대로 작동되지 않으므로 항상 배열의 마지막 객체를 삭제하게 된다.
// this.data.indexOf(item) === -1
// this.data.splice(-1, 1);
// removeItem 메서드 내부 if문을 작성해 잘못된 요소를 삭제하지 않도록 한다.
const objectStorage = new DataStorage<object>();
objectStorage.addItem({ name: "Max" });
objectStorage.addItem({ name: "Tom" });
objectStorage.removeItem({ name: "Max" });
console.log(objectStorage.getItems()); // [{ name: 'Max' }]
```

<br/>

### 제약 조건을 설정한 제네릭 클래스

- 특정 타입에만 작동하도록 제약 조건을 설정하였다.
- T 타입은 string이나 number 또는 boolean 타입만을 갖도록 명시하여 위와 같이 object 타입을 작성하는 일을 피하도록 할 수 있다.

```typescript
// 개선한 코드
class DataStorage1<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    // 반환값의 타입은 T[]라고 추론된다.
    return [...this.data];
  }
}

// 배열의 요소는 숫자형이어야 한다.
const storages1 = new DataStorage1<number>();
storages1.addItem(1);
storages1.addItem(10);
storages1.addItem(100);
storages1.removeItem(10);
console.log(storages1.getItems()); // [1, 100]

// 에러 발생 : T 타입은 항상 string 또는 number 또는 boolean 타입을 가져야 하기 때문이다.
// const storages2 = new DataStorage1<object>();
```

<br/>
<br/>

## 6. Generic Utility Types

### 1. Partial 타입 : 특정 타입의 부분 집합 타입을 정의할 수 있다.

- `Partial<CourseGoal>` : {}, {title: 'title'}, {description: 'description'}, {title: 'title', description: 'description', date: Date 타입을 가진 값} 등 CourseGoal 타입의 부분 집합을 모두 허용한다는 뜻이다.

```typescript
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  // 이처럼 작성할 수 있지만 아래의 경우를 통해 Partial 타입을 알아보자.
  // return { title: title, description: description, completeUntil: date };

  // obj 객체가 CourseGoal 타입이어야 하지만 빈 객체이므로 에러가 발생한다.
  // let obj: CourseGoal = {};

  // 이때, Partial 타입을 사용하면 된다.
  let obj: Partial<CourseGoal> = {};
  obj.title = title;
  obj.description = description;
  obj.completeUntil = date;

  // *** 함수는 CourseGoal 타입을 항상 반환해야 하므로 obj를 Partial<CourseGoal> 타입이 아닌 CourseGoal 타입으로 형 변환하여 리턴한다.
  return obj as CourseGoal;
}
```

<br/>

### 2. Readonly 타입 : 변경 불가능하도록 읽기 전용 데이터로 만들 수 있다.

```typescript
const names: Readonly<string[]> = ["Max", "Anna"];

// 에러 발생 : Readonly 타입인 names에 다른 요소를 추가할 수 없다.
// names.push("Manu");
```

<br/>
<br/>

## 7. 제네릭 타입 vs. 유니언 타입

- 아래 두 가지 방식으로 작성된 클래스는 엄연히 다른 동작을 수행한다.

<br/>

### 제네릭 타입과 유니언 타입의 공통점

- 둘 다 여러 타입을 동시에 다룬다.

<br/>

### 제네릭 타입을 사용하는 경우

- 특정 타입을 고정할 때
- 전체 함수에 걸쳐 같은 타입을 사용하고자 할 때
- 여러 타입에서 동작하는 함수를 생성하고자 할 때
- 제네릭을 사용하지 않고 any 타입을 사용하면 여러 타입을 넣을 수 있지만 any는 타입 체크를 하지 않는다. 함수의 인자 타입과 반환 타입을 알 수 없다는 문제를 개선하고자 제네릭 타입을 사용한다.

  <br/>

### 유니언 타입을 사용하는 경우

- 모든 메서드나 함수 호출마다 다른 타입을 지정하고자 할 때

  <br/>

### 제네릭 타입으로 작성된 클래스

```typescript
class DataStorage1<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}
```

<br/>

### 유니언 타입으로 작성된 클래스

- 유니언 타입으로 작성된 data 배열은 문자열, 숫자형, 불리언 타입이 혼합된 배열을 의미한다.
- 따라서 문자열 배열이나 숫자형 배열 또는 불리언 타입 배열과 같이 표현하려면 반드시 제네릭 타입으로 작성해야 한다.

```typescript
class DataStorage2 {
  private data: (string | number | boolean)[] = [];

  addItem(item: string | number | boolean) {
    this.data.push(item);
  }

  removeItem(item: string | number | boolean) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}
```
