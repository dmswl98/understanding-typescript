// 클래스
class Department1 {
  // 필드
  name: string;
  // private 필드
  // 1) 생성된 클래스 내부에서만 접근가능한 필드
  // 2) 해당 클래스를 상속한 클래스에서 접근 불가능
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

// 에러 발생: employees는 private 필드이므로 외부에서 변경할 수 없다.
// 단, 컴파일된 자바스크립트 코드에서는 에러가 발생하지 않고 정상 동작한다.
// 그 이유는 바닐라 자바스크립트(es5)에서는 private, public 키워드가 없기 때문이다.
// 컴파일을 수행하는 버전에 에러 발생 여부가 달려있다.
// accounting.employees[2] = "Anna";

accounting.printInfo(); // 2 ['max', 'tom']

const accountingCopy1 = { describe: accounting.describe1 };
accountingCopy1.describe(); // Department: undefined

const accountingCopy2 = { name: "2", describe: accounting.describe2 };
// accountingCopy2.describe(); // Department: 2

// 클래스 내 필드 약식 초기화 방법 + readonly 키워드
abstract class Department2 {
  // 생성자 메서드 매개변수로 클래스 내 필드를 생성 및 초기화할 수 있다.
  // readonly: 클래스 내부에서도 해당 필드를 변경할 수 없다.
  // private readonly id: string;
  // public name: string;

  // static property : static 메서드와 마찬가지로 인스턴스로 접근이 불가능하다.
  static fiscalYear = 2030;

  // 선언된 클래스 내부에서는 접근 가능하지만 해당 클래스 외부에서는 변경 불가능한 속성으로 만들고자 할 때,
  // private 키워드가 아닌 protected 키워드를 사용하면 된다.
  protected employees: string[] = [];
  constructor(protected readonly id: string, public name: string) {
    // this.id = id;
    // this.name = name;
    // 생성자 함수 내부에서 static 속성을 사용할 수 없다.
    // this는 클래스 기반으로 생성된 인스턴스를 참조하며, static 속성은 인스턴스에서 사용할 수 없기 때문이다.
    // console.log(this.fiscalYear);
    // 단, 클래스 이름을 사용해 접근할 수 있다.
    console.log(Department2.fiscalYear);
  }

  // static 메서드는 인스턴스로 호출할 수 없으며, 클래스를 통해 직접 호출 가능하다.
  static createEmployee(name: string) {
    return { name };
  }

  // describe() {
  //   console.log(`Department (${this.id}): ` + this.name);
  // }

  // 추상 메서드: 구현부는 작성하지 않은 채로 남겨둔 메서드를 말한다.
  // 1) 자식 클래스에도 해당 추상 메서드를 반드시 구현하도록 강요하기 위해 사용한다.
  // 2) 클래스 명 앞에도 'abstract' 키워드를 작성해야 한다.
  // 3) 추상 클래스는 인스턴스 생성이 불가하다.
  abstract describe(): void;

  updateId() {
    // 에러 발생: readonly 필드는 클래스 내부에서도 변경할 수 없다.
    // this.id = "d2";
  }

  printInfo() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}
// const marketing = new Department2("d1", "marketing");
// marketing.describe(); // Department (d1): marketing

// 예시
// class Product {
//   title: string;
//   price: number;
//   private isListed: boolean;

//   constructor(name: string, pr: number) {
//     this.title = name;
//     this.price = pr;
//     this.isListed = true;
//   }
// }

// 약식 초기화
class Product {
  private isListed: boolean;
  constructor(public title: string, public price: number) {
    this.isListed = true;
  }
}

// 상속
class ITDepartment extends Department2 {
  // admins: string[];
  constructor(id: string, public admins: string[]) {
    super(id, "IT");
  }

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

class AccountingDepartment extends Department2 {
  private lastReports: string;
  // AccountingDepartment 인스턴스를 static 속성인 instance에 저장한다.
  private static instance: AccountingDepartment;

  get mostRecentReport() {
    if (this.lastReports) return this.lastReports;
    throw new Error("No report found.");
  }

  set mostRecentReport(value: string) {
    if (!value) throw new Error("error");
    this.addReport(value);
  }

  // private 생성자 함수
  // 1) 생성자 앞에 private 키워드를 붙여 private 생성자로 변경할 수 있다.
  // 2) new AccountingDepartment를 여러 번 수동으로 호출하지 않기 위해 private 생성자 함수로 변경하는 것이다.
  // 3) private 생성자 함수로 변경하게 되면 new AccountingDepartment를 클래스 바깥에서 선언할 수 없다.
  // 4) 클래스 내부에서만 해당 클래스의 인스턴스를 생성할 수 있다. === 클래스 내부에서는 private 생성자를 호출할 수 있다.
  private constructor(id: string, private reports: string[]) {
    super(id, "Account");
    this.lastReports = reports[0];
  }

  // 정적 메서드
  static getInstance() {
    if (AccountingDepartment.instance) {
      return this.instance;
    }
    // 해당 클래스 내부에서는 private 생성자를 호출할 수 있다.
    this.instance = new AccountingDepartment("d5", []);
    return this.instance;
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

// const account = new AccountingDepartment("d3", ["get"]);

// 싱글톤 : 특정 클래스의 인스턴스를 하나만 갖도록 한다.
// 1) private 키워드를 통해 private 생성자 함수를 만들면 싱글톤을 구현할 수 있다.
// 2) new 키워드를 통해 인스턴스를 생성하지 못하도록 제한한다.
// 3) static 메서드를 통해 해당 클래스의 오직 한 번만 인스턴스를 생성할 수 있다.
const account = AccountingDepartment.getInstance();
const account2 = AccountingDepartment.getInstance();
console.log(account);
console.log(account, account2); // ** 동일한 객체를 리턴한다.

account.addReport("Something went wrong...");
account.printReports(); // ['Something went wrong...']

account.addEmployee("Max");
account.addEmployee("Tom");
account.addEmployee("Ford");
account.printInfo(); // 2 ['Tom', 'Ford']

// getter는 메서드 명만 작성하면 실행된다.
// reports 필드에 아무것도 없을 때
console.log(account.mostRecentReport); // Uncaught Error: No report found.
// reports 필드에 저장된 것이 있을 때
console.log(account.mostRecentReport); // Uncaught Error: No report found.

// setter는 등호를 이용해 전달할 값을 작성하면 된다.
account.mostRecentReport = "Year Report";
account.printReports(); // ['get', 'Something went wrong...', 'Year Report']

// account.mostRecentReport = ""; // Uncaught Error: error

// static 메서드 및 property는 모두 인스턴스로 접근이 불가능하며 클래스를 통해 접근할 수 있다.
// 또한, 작성된 클래스 내부에서 static 메서드 및 propery를 this를 통해 사용할 수 없다.
// static 메서드
const employee = Department2.createEmployee("max");
console.log(employee); // { name: 'max' }

// static property
console.log(Department2.fiscalYear); // 2030

// 메서드 오버라이드
account.describe(); // accounting department d3

// 추상 메서드
account.describe(); // accounting department d3
