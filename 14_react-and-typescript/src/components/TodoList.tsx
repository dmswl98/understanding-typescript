import React from "react";

import "./TodoList.css";

// 객체의 구조를 설명하기 위해 type보다 interface를 사용한다.
// interface 또는 type으로 해당 컴포넌트의 props 타입을 정의한다.
interface TodoListProps {
  items: { id: string; text: string }[];
  onDeleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ items, onDeleteTodo }) => {
  return (
    <ul>
      {items.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={onDeleteTodo.bind(null, todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
