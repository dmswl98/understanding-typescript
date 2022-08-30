# Section 3: Typescript Compiler

## 관찰 모드

해당 파일에 변경 사항이 생길 때마다 자동으로 컴파일을 수행한다.

```
tsc [파일 이름].ts -w
```

- 여러 개의 파일 컴파일 방법
  1. `tsc --init` : tsconfig.json 파일 생성
  2. `tsc` : 프로젝트 내 존재하는 모든 타입스크립트 파일에 대해 컴파일 수행
  3. `tsc -w` : 프로젝트 내 존재하는 모든 타입스크립트 파일에 관찰 모드 적용

## tsconfig.json

> 파일을 어떻게 컴파일할 것인지 작성한 파일

### 1. target

> 타입스크립트를 자바스크립트로 변환할 자바스크립트 버전 설정

### 2. exclude

> 컴파일에서 파일 제외하기

- 특정 파일을 컴파일에서 제외하기
  ```json
  {
    "compilerOptions": {
      // 중략
      "exclude": ["app.ts"]
    }
  }
  ```
- 와일드카드(\*)를 사용한 특정 파일을 컴파일에서 제외하기
  ```json
  {
    "compilerOptions": {
      // 중략
      "exclude": [
        // ~.dev.ts로 끝나는 파일 이름을 컴파일에서 제외하기
        "*.dev.ts"
      ]
    }
  }
  ```
- 특정 폴더 내 타입스크립트 파일을 컴파일에서 제외하기
  - exclude 옵션을 작성하지 않으면 ‘node_modules’는 기본적으로 컴파일에서 제외된다.
  - 만약 exclude 옵션을 작성했다면 내부에 ‘node_modules’를 작성해야 한다.
  ```json
  {
    "compilerOptions": {
      // 중략
      "exclude": [
        "node_modules" // default
      ]
    }
  }
  ```

### 3. include

> 컴파일에 특정 파일 추가하기

```json
{
  "compilerOptions": {
    // 중략
    // include에 작성되지 않은 파일은 컴파일되지 않도록 한다.
    "include": ["app1.ts", "app2.ts"]
  }
}
```

### 4. sourceMap

```json
{
  "compilerOptions": {
    // 중략
    "sourceMap": true
  }
}
```

- 브라우저의 개발자 도구에서 타입스크립트 코드를 디버깅할 수 있다.
- 각 타입스크립트 파일에 대한 .js.map 파일이 생성되며, 이 파일은 컴파일된 자바스크립트 코드를 컴파일 전의 타입스크립트 코드와의 매핑 관계를 나타낸다.

### 5. outDir

> 출력 파일이 생성될 폴더 위치 설정

- 타입스크립트 코드가 컴파일되어 생성된 자바스크립트 파일을 저장할 폴더 위치를 작성한다.
- 기본적으로 컴파일된 파일은 컴파일 대상 파일과 같은 폴더 내에 생성된다.

  #### outDir 설정 예시

  | 작성 전 폴더 구조                                                                                                      | 작성 후 폴더 구조                                                                                                      |
  | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
  | ![Untitled (2)](https://user-images.githubusercontent.com/76807107/187472306-3fd96450-f41d-40eb-b86d-556ffb674a2b.png) | ![Untitled (3)](https://user-images.githubusercontent.com/76807107/187472694-d5835b48-d512-41c2-872e-d42e377792d1.png) |

  ```json
  {
    "compilerOptions": {
      // 중략
      "outDir": "./dist"
    }
  }
  ```

### 6. rootDir

> 입력 파일이 있는 폴더 위치 설정

- 컴파일할 파일들의 폴더 위치를 작성하면 해당 폴더 내의 모든 타입스크립트 파일을 컴파일한다.
- 적용 후 폴더 구조

  ![Untitled (4)](https://user-images.githubusercontent.com/76807107/187473378-a68a5b7c-2f93-4258-a074-961ea1da963b.png)

```json
{
  "compilerOptions": {
    // 중략
    "rootDir": "./src"
  }
}
```

### 7. removeComments

```json
{
  "compilerOptions": {
    // 중략
    "removeComments": true
  }
}
```

- 타입스크립트 파일 내 작성된 모든 주석이 컴파일된 자바스크립트 파일에서 제거된다.
- 파일 크기를 줄이는데 도움이 된다.

### 8. noEmit

```json
{
  "compilerOptions": {
    // 중략
    "noEmit": true
  }
}
```

- 컴파일된 자바스크립트 파일을 생성하지 않도록 설정한다.
- 대규모 프로젝트에서는 이 값을 설정해 출력 파일을 생성하지 않고, 컴파일러가 파일을 검사해 보고한 잠재적 에러를 확인한다.

### 9. noEmitOnError

```json
{
  "compilerOptions": {
    // 중략
    "noEmitOnError": true // 기본값 false
  }
}
```

- 기본적으로 타입스크립트 파일 내 에러가 발생했더라도 컴파일된 자바스크립트 파일이 생성된다.
- true 설정한 경우, 에러가 발생했을 때 컴파일된 자바스크립트 파일을 생성하지 않을 수 있다.

### 10. noImplicitAny

> 변수들이 미리 정의된 타입을 가져야 하는지 여부를 제어한다.

- noImplicitAny의 기본값은 false이며, 함수의 매개변수에 타입을 명시하지 않을 때, 암묵적으로 타입스크립트는 any로 간주한다.
- noImplicitAny를 true로 설정하면, any를 명시적으로 선언하거나 타입을 분명히 선언해야 정상적으로 동작한다. 즉, 타입 선언을 하지 않으면 에러가 발생한다.

  ```json
  {
    "compilerOptions": {
      // 중략
      "noImplicitAny": true
    }
  }
  ```

  #### 예시

  - true일 때, 함수의 매개변수에는 타입을 지정해야 에러가 발생하지 않는다.
  - true일 때, 특히 변수의 경우는 타입 지정을 하지 않아도 정상적으로 동작한다.
  - 이렇게 함수의 매개변수와 변수의 동작 차이가 나는 이유
    - 변수의 경우, 타입스크립트는 코드의 흐름을 이해할 수 있어 타입을 정확하게 지정하지 않아도 된다.
    - 함수의 매개변수의 경우, 함수가 먼저 생성되기 때문에 타입을 정확히 지정해야 한다.

  ```typescript
  // noImplicitAny를 true로 설정한 경우
  // 오류 없는 코드
  let logged;
  function sendValue(data: string) {
    console.log(data);
    logged = true; // boolean 타입
  }
  ```

### 11. strictNullChecks

- 기본값은 true이며, null 타입을 허용하지 않는다.
- false로 설정하면, null 타입을 잠재적으로 가질 수 있는 값을 에러로 취급하지 않는다. 즉, null 검사를 비활성화한 셈이다.

  #### 예시

  - strictNullChecks가 true인 경우(기본값)

    ```typescript
    // strictNullChecks : true(기본값)
    const button1 = document.querySelector("button"); // 에러 발생
    // 뒤에 느낌표를 붙여 해당 dom 요소가 존재함을 알려야 에러가 발생하지 않는다.
    const button2 = document.querySelector("button")!; // 에러가 발생하지 않음

    button1.addEventListener("click", () => {
      console.log("Clicked");
    });
    button2.addEventListener("click", () => {
      console.log("Clicked");
    });
    ```

    - 느낌표를 붙이면 해당 요소가 null이 아님을 보장한다는 의미이다.
    - 즉, 개발자가 null을 반환하지 않는 요소에 붙여 타입스크립트에게 null 값을 반환하지 않음을 보장하며 에러를 해결할 수 있다.
    - 느낌표를 붙이지 않았을 때(에러 발생) : `const_ button: HTMLButtonElement | _null_`
    - 느낌표를 붙였을 때(에러 해결) : `const_ button: HTMLButtonElement`

  - strictNullChecks가 false인 경우

    ```typescript
    // strictNullChecks : false
    const button1 = document.querySelector("button"); // 에러가 발생하지 않음

    button1.addEventListener("click", () => {
      console.log("Clicked");
    });
    ```
