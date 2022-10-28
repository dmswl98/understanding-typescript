# Section 12: Libraries with typescript

## 1. [lodash](https://lodash.com/)

```
$ npm i --save lodash
```

lodash 라이브러리는 자바스크립트로만 빌드되어 있어 타입스크립트에서 사용하면 에러가 발생한다. 타입스크립트가 자바스크립트 상에 빌드된다면 타입스크립트 프로젝트 내에서 모든 자바스크립트 라이브러리를 사용할 수 있다.

</br>

```
npm i --save @types/lodash
```

```typescript
import _ from "lodash";

console.log(_.shuffle([1, 2, 3]));
```

타입스크립트로 변환된 라이브러리를 사용해 에러를 해결할 수 있다. `파일명.d.ts` 파일들이 존재하는데 d는 declaration(선언) 파일이며 즉, 실제 타입스크립트로 이루어진 로직이 작성되어 있지 않고 타입스크립트에게 지시하는 내용이 작성되어 있다. 타입스크립트 선언 파일 `d.ts`는 타입스크립트 코드의 타입 추론을 돕는 파일이다.

단, loadsh를 제외한 자바스크립트로 작성된 다수의 써드파티 라이브러리 중 `d.ts`의 빌드를 거치지 않고도 에러 없이 동작하는 라이브러리이 존재한다. 이러한 라이브러리는 일반 바닐라 자바스크립트 라이브러리를 타입스크립트 프로젝트에서 사용할 수 있다. 만약 특정 라이브러리가 타입스크립트 파일 내에서 동작하지 않는다면
`@types/`로 시작하는 패키지들을 사용하자.

<br/>

### **[막간 상식]** declare 키워드

- 변수, 상수, 함수, 클래스가 어딘가에 이미 선언되어 있음을 알린다.
- 타입스크립트 컴파일러에게 타입 정보만 알린다.
- declare가 붙은 코드는 js로 변환되지 않는다.
- 이는 자바스크립트로 작성된 외부 라이브러리를 쓸 떄 유용하며 타입스크립트 버전이 없을 때 직접 declare로 타입을 작성할 수 있다.

```html
<body>
  <script>
    var GLOBAL = 1000;
  </script>
</body>
```

```typescript
// 에러 발생
// console.log(GLOBAL);

// declare 키워드
declare var GLOBAL: any;
console.log(GLOBAL);
```

html 내부 script 태그에 GLOBAL 전역 변수를 선언했지만 해당 변수 값을 타입스크립트 파일에서 출력할 수 없다. 해당 변수는 타입이 선언되어 있지 않기 때문이다. 해당 변수를 사용하기 위해 `declare`를 이용해 변수의 타입을 지정한 뒤 출력할 수 있다.

## 2. [class-transformer](https://github.com/typestack/class-transformer)

📜 [참고 자료 1](https://cherrypick.co.kr/convert-plain-object-to-class-object-using-class-transformer/)
📜 [참고 자료 2](https://cocook.tistory.com/203)

외부에서 들어온 json 응답 데이터을 내부 로직에 사용하거나 내부에 있는 데이터를 외부로 내보낼 때 json 데이터를 그대로 사용하거나 plain Object를 만들어 반환해줄 때가 있는데 이는 좋은 방식이 아니다. 외부의 세부 사항이 그대로 들어나 내부 로직을 더럽히는 경우가 발생하기 때문이다. 즉, 캡슐화를 위해 사용하는 것이다.

해당 라이브러리를 이용해 **쉽게 plain object에서 class object로 변환**할 수 있다.

```
npm install class-transformer --save
npm install reflect-metadata --save
```

📣 product.model.ts

```typescript
export class Product {
  title: string;
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }

  getInformation() {
    return [this.title, `$${this.price}`];
  }
}
```

📣 product.model.ts

```typescript
import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { Product } from "./product.model";

const products = [
  { title: "A Carpet", price: 29.99 },
  { title: "A Book", price: 10.99 },
];

// class-transformer 라이브러리가 없다면 각 데이터 마다 인스턴스를 생성해야 한다.
// const loadedProducts = products.map((prod) => {
//   return new Product(prod.title, prod.price);
// });
// console.log(loadedProducts.getInformation());

// class-transformer 라이브러리를 사용하면 다음과 같이 작성할 수 있다.
const loadedProducts = plainToClass(Product, products);

for (const prod of loadedProducts) {
  console.log(prod.getInformation());
}

// 출력 결과
// ['A Carpet', '$29.99']
// ['A Book', '$10.99']
```

<br/>

## 3. [class-validator](https://github.com/typestack/class-validator)

타입스크립트의 데코레이터를 이용해 **쉽게 유효성을 검사**할 수 있다.

```
npm install class-validator --save
```

📣 tsconfig.json

> 데코레이터 사용을 위해 주석을 해제한다.

```json
{
  "experimentalDecorators": true
}
```

📣 product.model.ts

```typescript
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class Product {
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsPositive()
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }

  getInformation() {
    return [this.title, `$${this.price}`];
  }
}
```

📣 product.model.ts

```typescript
import { Product } from "./product.model";
import { validate } from "class-validator";

const p1 = new Product("A Book", 12.99);
console.log(p1.getInformation());

const p2 = new Product("", -1);
validate(p2).then((errors) => {
  if (errors.length) {
    console.log(errors);
  } else {
    console.log(p2.getInformation());
  }
});

// 출력 결과
// [
//   {
//     children: [],
//     constraints: {isNotEmpty: 'title should not be empty'},
//     property: "title",
//     target: Product {title: '', price: -1},
//     value: "",
//   },
//   {
//     children: [],
//     constraints: {isPositive: 'price must be a positive number'},
//     property: "price",
//     target: Product {title: '', price: -1},
//     value: -1,
//   }
// ]
```
