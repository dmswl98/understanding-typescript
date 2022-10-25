// Drag & Drop interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project Type
// public status: "active" | "finished" : 리터럴 타입 + 유니언 타입을 활용해 생성자 함수의 매개변수로 사용할 수 있지만, enum을 사용해도 된다.
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus // enum을 활용
  ) {}
}

type Listener<T> = (items: T[]) => void;

// 여러 상태를 관리하기 위해 베이스 상태 코드 작성
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// Project State Management
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  // static 메서드 내부에 사용하기 위해 static 키워드를 작성해야 한다.
  private static instance: ProjectState;

  // 싱글톤 패턴을 위해 private 생성자 함수를 만든다.
  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active // project의 status값의 기본값은 active로 설정한다.
    );
    this.projects.push(newProject);

    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// 싱글톤 패턴을 이용해 항상 동일한 객체로 작업할 수 있다.
// 즉, 전체 앱에서 하나의 객체만 갖도록 하였다.
const projectState = ProjectState.getInstance();

// Validation
// 객체의 구조를 정의할 때는 interface를 사용하는 것이 좋다.
// option 프로퍼티임을 설정(두 가지 경우 동일한 동작을 수행한다.)
// 1) 콜론 왼쪽에 '?'를 작성하는 방법
// 2) undefined 타입을 추가하는 방법 -> min: number | undefined;
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  let isValid = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  if (input.minLength && typeof input.value === "string") {
    isValid = isValid && input.value.length >= input.minLength;
  }
  if (input.maxLength && typeof input.value === "string") {
    isValid = isValid && input.value.length <= input.maxLength;
  }
  if (input.min && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }
  return isValid;
}

// Autobind decorator
// 사용하지 않은 파라미터에서 에러가 나는 경우 2가지 방법으로 해결할 수 있다.
// 1) 파라미터의 이름을 '_'로 작성한다.
// 2) tsconfig.json > noUnusedParameters를 true로 변경한다.
function Autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
  // 데코레이터를 설정한 메서드를 가리킨다.(submitHandler 메서드)
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// Component Base Class
// ProejctList 클래스와 ProejctInput 클래스의 중복 메서드나 필드를 없애기 위한 클래스
// 제네릭 타입을 사용해 상속을 받을 때마다 다양한 구현 타입을 정할 수 있다.
// 베이스 코드가 작성된 클래스를 인스턴스화하지 않기 위해 'abstract' 키워드를 사용한다.
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T; // 삽입할 노드
  element: U;

  // newElementId는 옵션 매개변수
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    // content : HTMLTemplateElement에서 제공하는 프로퍼티
    // importNode : 노드 복사
    // -> document.importNode(복제를 원하는 노드, 자식노드 포함 여부(boolean))
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // firstElementChild : 첫 번째 자식 요소
    // importedNode.firstElementChild : .project-input 내부의 form 태그를 가리킨다.
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  // insertAdjacentElement(position, 삽입하고 싶은 노드) : 특정 위치에 노드를 추가한다.
  // pos1) beforebegin : element 앞에
  // pos2) afterbegin : element 안에 가장 첫번째 child
  // pos3) beforeend : element 안에 가장 마지막 child
  // pos4) afterend : element 뒤에
  // 즉, 아래의 코드는 this.element 노드를 .app 요소 내부 맨 앞에 위치시키는 것이다.
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// ProjectItem Class
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    // e.dataTransfer.setData로 전달할 데이터를 지정한다.
    // setData는 키-값 형식으로 저장한다.
    // e.dataTransfer.getData로 데이터를 받을 수 있다.
    event.dataTransfer!.setData("text/plain", this.project.id);
    // 커서의 모양을 변경
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    // 이벤트 리스너만 추가한다고 해서 해당 요소가 드래그되지 않는다.
    // 반드시 해당 요소의 속성으로 `draggable='true'`를 작성해야 한다.
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// ProjectList Class
class ProejctList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  // 작성한 필드를 생성자 함수 내부에서 초기화를 해주어야 에러가 발생하지 않는다.
  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement; // 삽입할 노드
  // element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      // projects : 추가한 프로젝트
      // private 필드인 type의 값이 'active'이거나 'finished'일 경우를 필터링한다.
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    // ul tag에 id 부여
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  // private 메서드는 맨 뒤에 작성한다.
  private renderProjects() {
    // ul tag
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";

    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
}

// ProjectInput Class : 양식 생성과 사용자 입력값 수집을 담당
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement;
  // element: HTMLFormElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.renderContent();
  }

  configure() {
    // 이 곳에서 this는 ProjectInput 클래스를 가리킨다.
    // this.element.addEventListener("submit", this.submitHandler);

    // bind를 통해 클래스(this)를 가리키도록 해야 submitHandler 메서드 내부에서 에러가 발생하지 않는다.
    // this.element.addEventListener("submit", this.submitHandler.bind(this));

    // Autobind 데코레이터를 이용한 바인딩
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = +this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      // 항상 [string, string, number] 형식의 튜플을 반환해야 하지만 if문 내에서는 튜플을 반환하지 않으므로 에러가 발생한다.
      // 이 경우 아무것도 반환할 수 있도록 void 타입을 추가해야 한다.
      return;
    } else {
      return [enteredTitle, enteredDescription, enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  // private 메서드 : 클래스 내부에서는 접근 가능하지만 클래스 외부에서는 접근할 수 없다.
  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();

    // 이 곳에서 this는 ('this.element' === form 태그 요소)를 가리킨다.(이벤트 리스너가 붙은 요소를 가리킨다.)
    // console.log(this);
    // 즉, this가 ProjectInput 클래스를 가리키지 않아 에러가 발생하고 이를 'bind'를 통해 해결할 수 있다.
    // console.log(this.titleInputElement.value);

    // userInput은 튜플 또는 void를 반환한다.
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProejctList("active");
const finishedPrjList = new ProejctList("finished");
