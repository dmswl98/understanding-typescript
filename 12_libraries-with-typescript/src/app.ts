import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { Product } from "./product.model";
import { validate } from "class-validator";

const products = [
  { title: "A Carpet", price: 29.99 },
  { title: "A Book", price: 10.99 },
];

// const loadedProducts = products.map((prod) => {
//   return new Product(prod.title, prod.price);
// });

const loadedProducts = plainToClass(Product, products);

for (const prod of loadedProducts) {
  console.log(prod.getInformation());
}

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
// console.log(p2.getInformation());
