// unknown 타입 : 어떤 타입의 값이 저장될지 모를 때 사용한다.
// 만약 어떤 타입이 저장될지 알 경우에는 unknown 타입 대신 union 타입을 사용하는 것이 좋다.
// 1) any 타입과 동일하게 모든 타입을 허용하지만,
// unknown 타입으로 선언된 변수는 any를 제외한 다른 타입으로 선언된 변수에 할당될 수 없다.
// 2) unknown 타입으로 선언된 변수는 프로퍼티에 접근할 수 없으며, 메소드를 호출할 수 없고 인스턴스를 생성할 수 없다.

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

// never 타입
// never 타입이 발생하는 경우 : 리턴하지 않는 함수, 항상 예외를 던지는 함수
// void vs. never
// void : 아무것도 리턴하지 않는 경우
// never : 절대 리턴하지 않는 경우
// 1) 리턴하지 않는 함수 (e.g. 함수 내용에 while(true){}가 들어 있는 경우)
// 2) 항상 예외를 던지는 함수 (e.g. function foo(){throw new Error('Not Implemented')} 에서 foo의 리턴 타입이 never)

function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code };
}

generateError("An error occurred!", 500);
