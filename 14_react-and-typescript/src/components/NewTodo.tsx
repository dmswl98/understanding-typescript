import React, { useRef } from "react";

import "./NewTodo.css";

// interface 또는 type으로 해당 컴포넌트의 props 타입을 정의한다.
type NewTodoProps = {
  onAddTodo: (todoText: string) => void;
};

const NewTodo: React.FC<NewTodoProps> = ({ onAddTodo }) => {
  // ref에 입력값이 저장될 것이므로 HTMLInputElement 타입으로 설정하며, 기본값 null도 설정한다.
  const textInputRef = useRef<HTMLInputElement>(null);

  // 폼 이벤트 객체 : React.FormEvent
  const todoSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    // textInputRef.current.value에서 textInputRef.current 부분에 에러가 발생하는데 느낌표(!)를 중간에 작성해 에러 부분이 null이 아님임을 타입스크립트에게 알린다.
    const enteredText = textInputRef.current!.value;
    onAddTodo(enteredText);
    textInputRef.current!.value = "";
  };

  return (
    <form onSubmit={todoSubmitHandler}>
      <div className="form-control">
        <label htmlFor="todo-text">Todo Text</label>
        <input type="text" id="todo-text" ref={textInputRef} />
      </div>
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default NewTodo;
