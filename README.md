1) What is the difference between var, let, and const?
var → old way, function-scoped, can be redeclared.

let → block-scoped, can be updated but not redeclared.

const → block-scoped, can’t be reassigned (but objects/arrays inside can still change).


2) What is the difference between map(), forEach(), and filter()? 
map() → returns a new array after transforming each element.

forEach() → just loops through items, doesn’t return anything.

filter() → returns a new array with elements that pass a condition.

3) What are arrow functions in ES6?
A shorter way to write functions → const add = (a, b) => a + b;.
They don’t have their own this (useful inside callbacks).

4) How does destructuring assignment work in ES6?
It allows to directly pull out values from arrays or objects and assign them to variables in a neat way, instead of accessing them one by one.


5) Explain template literals in ES6. How are they different from string concatenation?
They use backticks to make strings more powerful. We can easily insert variables or expressions inside them and also write multi-line strings without hassle.