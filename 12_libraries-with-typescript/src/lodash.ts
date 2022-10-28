import _ from "lodash";

console.log(_.shuffle([1, 2, 3]));

// 에러 발생
// console.log(GLOBAL);

// declare 키워드
declare var GLOBAL: any;
console.log(GLOBAL);
