# Section 10: Modules & Namespaces

## 1. Module code

타입스크립트 코드를 여러 파일에 나눠 작성하고 싶은 경우 어떻게 해야할까?

1. 단순하게 여러 파일에 코드를 나눠 작성하는 방법

- 수동으로 컴파일된 자바스크립트 파일을 HTML에 import 해야 한다.
- 이는 번거롭고 오류가 발생하기 쉽다.
- 만약 특정 타입이 파일 A에 정의되어 있고 이를 파일 B에서 사용하려고 할 때 타입스크립트의 타입 지원을 받을 수 없다.
- 특히나 큰 프로젝트의 경우에는 이 방법을 지양해야 한다.

2. Namespace and File Bundling

- 네임스페이스를 TypeScript 1.5버전 이전에는 내부 모듈(Internal modules)이라 불렸다.
- 내부 모듈인 네임스페이스를 이용해 여러 파일에 걸친 하나의 네임스페이스의 이름 공간을 생성할 수 있다.
- 따라서 같은 네임스페이스의 이름 공간에서 파일 A가 파일 B의 모듈을 참조할 수 있으며 참조할 때 별도의 참조문을 선언할 필요가 없다.
- 즉, 같은 네임스페이스 내부에서 함수명, 변수명, 클래스명을 중복하여 사용할 수 없다.

3. ES6 imports/exports(추천 방법)

- 공식문서에 따르면 위 두 가지 방법보다 ES6 module의 사용을 권장하고 있다.

## 2. Namespace

- 자바스크립트 기능이 아닌 타입스크립트만의 기능이므로 해당 키워드는 컴파일되지 않는다.
- 특정 네임스페이스 내부에 선언된 모든 코드들은 해당 네임스페이스에서만 사용할 수 있다.
- `export` 키워드를 작성해 특정 네임스페이스 내부의 코드를 export하여 해당 네임스페이스 내부와 파일 외부에서도 이용할 수 있다.

```typescript
namespace App {
  export enum ProjectStatus {
    Active,
    Finished,
  }

  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: ProjectStatus // enum을 활용
    ) {}
  }
}
```

### 하나의 파일로 컴파일되도록 설정하기

> 흩어져 있는 여러 타입스크립트 파일을 하나의 자바스크립트 파일로 컴파일되도록 하는 방법은 다음과 같다.

1. tsconfig.json 파일의 --outFile 주석을 해제한 후 단일 파일로 출력시 파일명을 작성한다.
2. 하지만 `Only 'amd' and 'system' modules are supported alongside --outFile.`와 같은 에러가 발생할 것이다.
3. tsconfig.json 파일의 module의 값을 `commonjs`에서 `amd`로 변경한다.
4. 그리고 잊지 말고 html 파일의 script 태그에 컴파일된 최종 js 파일로 변경해야 한다.

```json
// tsconfig.json
{
  "outFile": "./dist/bundle.js",
  "module": "amd"
}
```

위 과정을 생략하면 타입스크립트의 각 파일이 따로따로 컴파일이 되지만 위 과정을 통해 하나의 파일로 즉, outFile에 정의한 파일명으로 여러 ts파일이 하나의 파일로 컴파일된다.

### 같은 네임스페이스의 공간

```typescript
// a.ts
namespace F {
  export const add = (x: number, y: number) => {
    return x + y;
  };

  export const x = 10;
}

// b.ts
/// <reference path="a.ts"/>
namespace F {
  const y = 20;
  console.log(add(x, y)); // 30;
}
```

b.ts 파일에서 a.ts 파일의 add 함수를 사용하고자 한다면,

1. 같은 네임스페이스를 가져야 한다. 위 코드는 두 파일의 네임스페이스를 'F'로 설정하였다.
2. 외부에 사용할 함수나 변수, 타입 등은 항상 `export` 키워드를 작성한다.
3. `/// <reference path="..."/>` 지시어(파일 간 의존성 선언)를 사용해 외부 함수가 있는 파일을 참조하도록 작성한다.

### 네임스페이스를 사용하지 않는 이유

네임스페이스는 간단하게 애플리케이션의 코드를 구조화하기에 좋다.
다만 네임스페이스의 단점은 파일에 특정 의존성 선언이 일부 누락되더라도 오류 메시지를 발생시키지 않는다.

따라서 공식문서에 따르면 네임스페이스 대신 ES 모듈(module)을 사용할 것을 권장하고 있다.

> It is also worth noting that, for Node.js applications, modules are the default and _we recommended modules over namespaces in modern code._

## 3. Module

**표준 방식**

> 각 파일에서 외부에서 어떤 코드를 사용하고 있는지 분명히 명시할 수 있다는 장점이 있다.

```json
// tsconfig.json
{
  // "outFile": "./dist/bundle.js",
  "module": "es2015"
}
```

다음과 설정하면 dist 폴더에서 src 폴더의 복사본을 확인할 수 있다.
또한 잊지 말고 html 파일의 script 태그에 파일을 변경해야 한다.

```typescript
// a.ts
export const add = (x: number, y: number) => {
  return x + y;
};

export const x = 10;

// b.ts
import { add, x } from "./a.js";
const y = 20;
console.log(add(x, y)); // 30;
```

크롬 개발자 도구 > Network 탭 > 작성한 컴파일된 모든 자바스크립트 파일은 import 키워드를 만나면 자동적으로 브라우저에 의해 요청받음을 알 수 있다. 그러므로 기존 자바스크립트에서 사용하는 것과 사용법은 비슷하나 반드시 파일명의 확장자를 `.js`로 작성해야 한다.

만약 웹팩과 빌드 툴을 추가하면 .js 확장자를 작성하지 않아도 되지만 import를 위해 브라우저에 의존하는 한 반드시 확장자를 작성해야 한다.

만약 모듈 내에서 인스턴스 생성 코드를 작성하고 해당 모듈을 여러 번 import하면 어떤 일이 일어날까? 여러 번 호출되어 여러 개의 인스턴스가 생성될까? 정답은 아니다.

export된 모듈은 import 횟수만큼 실행되지 않으므로 **해당 모듈 내부에서 인스턴스를 생성해도 무방하다.**
