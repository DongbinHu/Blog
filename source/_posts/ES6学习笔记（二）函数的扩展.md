---
title: ES6学习笔记（二）函数的扩展
date: 2017-08-29 10:26:31
categories: 前端学习笔记
tags:
description:
---

# 1.函数参数的默认值

## 基本用法

ES6之前，不能直接为函数的参数指定默认值，只能采用变通的方法。  


```javascript
function log(x,y) {
    y = y || 'World';
    console.log(x,y);
}
log('Hello') //Hello World
log('Hello', 'China') //Hello China
log('Hello','') // Hello World
```  


上面代码检查函数`log`的参数`y`有没有赋值，如果没有，则指定默认值为`World`。这种写法的缺点在于，如果参数`y`赋值了，但是对应的布尔值为`false`，则该赋值不起作用。就像上面代码的最后一行，参数`y`等于空字符，结果被改为默认值。  
为了改变这个问题，通常需要先判断一下参数`y`是否被赋值，如果没有，再等于默认值。  

```javascript
if(typeof y === 'undefined'){
    y = 'World';
}
```  

ES6允许为函数的参数设置默认值，即直接写在参数定义的后面。  
```javascript
function log(x, y='World') {
    console.log(x,y);
}
log('Hello') //Hello World
log('Hello','China') //Hello China
log('Hello','') //Hello
```  

可以看到，ES6的写法比ES5简洁多了，而且非常自然。下面是另一个例子。  

```javascript
function Point(x = 0,y = 0) {
  this.x = x;
  this.y = y;
}
var p = new Point();
p // {x:0,y:0}
```  

除了简洁，ES6的写法还有两个好处：首先，阅读代码的人，可以立刻意识到哪些参数时可以省略的，不用查看函数体或文档；其次，有利于将来的代码优化，即使未来的版本在对外接口中，彻底拿掉这个参数，也不会导致以前的代码无法运行。  
函数变量是默认声明的，所以不能用`let`或`const`再次声明。  

```javascript
function foo(x = 5) {
  let x = 1; //error 
  const x = 2; //error
}
```  

上面代码中，参数变量`x`是默认声明的，在函数体中，不能用`let`或`const`再次声明，否则会报错。  
使用参数默认值时，函数不能有同名参数。  

```javascript
//不报错
function foo(x,x,y) {
  //...
}

//报错
function foo(x,x,y = 1) {
  //...
}
//SyntaxError: duplicate argument names not allowed in this context
```  

另外，一个容易忽略的地方是，参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值时惰性求值的。  

```javascript
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
foo() //100

x = 100;
foo() //101
```  

上面代码中，参数`p`的默认值时`x+1`.这时，每次调用函数`foo`，都会重新计算`x+1`，而不是默认`p`等于100。  

------------------------------------  

## 与解构赋值默认值结合使用  

参数默认值可以与解构赋值的默认值，结合起来使用。  

```javascript
function foo({x,y=5}){
    console.log(x,y);
}

foo({}) //undefined 5
foo({x:1}) // 1 5
foo({x:1,y:2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined
```  

上面代码只提供了对象的解构赋值默认值，没有使用函数的默认值。只有当函数`foo`的参数时一个对象时,变量`x`和`y`才会通过解构赋值生成。如果函数`foo`调用时没有提供参数，变量`x`和`y`就不会生成，从而报错。通过提供函数参数的默认值，就可以避免这种情况发生。  

```javascript
function foo({x,y=5} = {}) {
  console.log(x,y);
}

foo();//undefined 5
```  

上面代码指定，如果没有提供参数，函数`foo`的参数默认是一个空对象。  
下面是另一个解构赋值默认值的例子。  

```javascript
function fetch(url,{body = '', method = 'GET', headers = {} }) {
    console.log(method);  
}

fetch('huliuliu.top',{}) //"GET"
fetch('huliuliu.top') //报错
```  

上面代码中，函数`fetch`没有第二个参数时，函数参数的默认值就会生效，然后才是解构赋值的默认值生效，变量`method`才会取到默认值`GET`  

再请问下面两种写法有什么差别？  

```javascript
//写法一
function m1({x = 0, y = 0} = {}) {
  return[x,y];
}
//写法二
function m2({x, y} = {x : 0,y : 0}) {
  return[x,y];
}
```  

上面两种写法都对函数的参数设定了默认值，区别是写法一函数参数的默认值时空对象，但是设置了对象解构赋值的默认值；写法二函数参数的默认值是一个具有具体属性的对象，但是没有设置对象解构赋值的默认值。  

```javascript
// 函数没有参数的情况
m1(); //[0,0]
m2(); //[0,0]

//x和y都有值得情况
m1({x:3,y:8}); //[3,8]
m2({x:3,y:8}); //[3,8]

//x有值，y无值的情况
m1({x:3}) //[3,8]
m2({x:3}) //[3,undefined]

//x,y都无值的情况
m1({}) //[3,8]
m2({}) //[undefined,undefined]

m1({z:3}) //[0,0]
m2({z:3}) //[undefined,undefined]
```  

-----------------------------------------------  

对于m1来说，没有传参数的情况下，m1的参数默认是一个空对象，然后进行解构赋值，才有的x,y的默认值。也就是说，m1不但有函数参数值得默认值，而且还有解构赋值。在传值的情况向，我测试的结果是，只有传null的时候，会报错，其他情况只要没有覆盖解构赋值中的想x,y的值，都会打印出[0,0]
而对于m2来说，在没有传参数的情况下，函数会将它的默认值也就是{x:0,y:0}打印出来，传值之后，就覆盖了函数的参数默认值，而m2没有解构赋值，所以，如果穿的对象中没有x，y的值，就会打印出undefined。（传null同样会报错）  

----------------------------------------------------  

## 参数默认值的位置  

通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。  

```javascript
//例一
function f(x = 1, y) {
  return [x ,y];
}

f() //[1, undefined]
f(2) //[2, undefined]
f(, 1) //报错
f(undefined,2) //[1 ,2]

//例二
function f(x, y = 5, z) {
  return [x, y, z];
}

f() //[undefined, 5, undefined]
f(1) //[1, 5, undefined]
f(1,,2) //报错
f(1, undefined, 2) //[1, 5, 2]
```  

上面代码中，有默认值得参数都不是尾参数。这时，无法只省略该参数，而不省略它后面的参数，除非显式输入`undefined`。  
如果传入`undefined`，将触发该参数等于默认值，`null`则没有这个效果。  

```javascript
function foo(x = 5, y = 6) {
  console.log(x, y);
}

foo(undefined, null) //5 null
```  

## 函数的length属性  

指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真。  

```javascript
(function (a) {}).length //   1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```  

上面代码中，`length`属性的返回值，等于函数的参数个数减去指定了默认值的参数个数。比如，上面最后一个函数，定义了3个参数，其中有一个参数`c`指定了默认值，因此`length`属性等于`3`减去`1`,最后得到`2`。  
这是因为`length`属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。同理，后文的rest参数也不会计入`length`属性。  

```javascript
(function (...args) {}).length // 0
```  

如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数了。  

```javascript
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```  

## 作用域  

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。  

```javascript
vat x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) //2
```  

上面的代码中，参数`y`的默认值等于变量`x`。调用函数`f`时，参数形成一个单独的作用域。在这个作用域里面，默认值变量`y`指向第一个参数`x`，而不是全局变量`x`，所以输出是`2`。  
再看下面的例子。  

```javascript
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```  

上面代码中，函数`f`调用时，参数`y = x`形成一个单独的作用域。这个作用域里面，变量`x`本身没有定义，所以指向外层的全局变量`x`。函数调用时，函数体内部的局部变量`x`影响不到默认值变量`x`。  
如果此时，全局变量`x`不存在，就会报错。  

```javascript
function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // ReferenceError: x is not defined
```  

下面这样写，也会报错。  

```javascript
var x = 1;
function foo(x = x) {
  // ...
}

foo() //ReferenceError: x is not defined
```  

上面代码中，参数`x = x`形成一个单独作用域。实际执行的是`let x = x`，由于暂时性死区的原因，这行代码会报错“X未定义”。  
如果参数的默认值是一个函数，该函数的作用域也遵守这个规则。请看下面的例子。  

```javascript
let foo = 'outer';

function bar(func = () => foo) {
  let foo = 'inner';
  console.log(func());
}

bar() // outer
```  

上面代码中，函数`bar`的参数`func`的默认值是一个匿名函数，返回值变量`foo`。函数参数形成的单独作用域里面，并没有定义变量`foo`，所以`foo`指向外层的全局变量`foo`，因此输出`outer`。  
如果写成下面这样，就会报错。  

```javascript
function bat(func = () => boo) {
  let boo = 'inner';
  console.log(func());
}

bar() //ReferenceError: boo is not defined
```  

上面代码中，匿名函数里面的`foo`指向函数外层，但是函数外层并没有声明变量`foo`所以就报错了。  
下面是一个更复杂的例子。  

```javascript
var x = 1;
function foo(x, y = function(){ x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}

foo() // 3
x // 1
```  

上面代码中，函数`foo`的参数形成一个单独的作用域。这个作用域里面，首先声明了变量`x`，然后声明了变量`y`，`y`的默认值是一个匿名函数。这个匿名函数内部的变量`x`，指向同一个作用域的第一个参数`x`。函数`foo`内部又声明了一个内部变量`x`，该变量与第一个参数`x`由于不是同一个作用域，所以不是同一个变量，因此执行`y`后，内部变量`x`和外部全局变量`x`的值都没变。  
如果将`var x = 3`的`var`去掉，函数`foo`的内部变量`x`就指向第一个参数`x`，与匿名函数内部的`x`是一致的，所以最后输出的就是`2`，而外层的全局变量`x`依然不受影响。  

```javascript
var x = 1;
function foo(x, y = function() {
  x = 2;
}) {
  x = 3;
  y();
  console.log(x);
}

foo() // 2
x // 1
```  

## 应用  

利用函数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。  

```javascript
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo()
// Error: Missing parameter
```  

上面的`foo`函数，如果调用的时候没有参数，就会调用默认值`throwIfMissing`函数，从而抛出一个错误。  
从上面代码还可以看到，参数`mustBeProvided`的默认值就等于`throwIfMissing`函数的运行结果（注意函数名`throwIfMissing`之后有一对圆括号），这表明参数的默认值不是在定义时执行，而是在运行时执行。如果参数已经赋值，默认值中的函数就不会运行。  
另外，可以将参数默认值设为`undefined`，表明这个参数是可以省略的。  

```javascript
function foo(optional = undefined) {
  //...
}
```  

----------------------------------------------------  

# 2.rest参数  

ES6引入rest参数（形式为`...变量名`），用于获取函数的多余参数，这样就不需要使用`arguments`对象了。rest参数搭配的变量是一个数组，该变量将多余的参数放入数组中。  

```javascript
function add(...values) {
  let sum = 0;
  
  for(var val of values){
      sum += val;
  }
  
  return sum;
}

add(2, 5, 3) //10
```  

上面代码的`add`函数是一个求和函数，利用rest参数，可以向该函数传入任意数目的参数。  
下面是一个rest参数代替`arguments`变量的例子。  

```javascript
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

//rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```  

上面代码的两种写法，比较后可以发现，rest参数的写法更自然也更简洁。  
注意，rest参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。  
函数的`length`属性，不包括rest参数。  

---------------------------------------  


# 3.严格模式  

从ES5开始，函数内部可以设定为严格模式。  

```javascript
function doSomething(a, b) {
  'use strict';
  //code
}
```  

ES6做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。  
这样规定的原因是，函数内部的严格模式，同时适用于函数体和函数参数。但是，函数执行的时候，先执行函数参数，然后再执行函数体。这样就有一个不合理的地方。只有从函数体之中，才能知道参数是否应该以严格模式执行，但是参数却应该先于函数体执行。  
两种方法可以规避这种限制。第一种是设定全局性的严格模式，这是合法的。  

```javascript
'use script'

function doSomething(a, b = a) {
  // code
}
```  

第二种是把函数包在一个无参数的立即执行函数里面。  

```javascript
const doSomething = (function() {
  'use script';
  return function(value = 42) {
    return value;
  }
}());
```  

------------------------------------------  


# 4.箭头函数  

## 基本用法  

ES6允许用“箭头”（`=>`）定义函数。  

```javascript
var f = v => v;
```  

上面的箭头函数等同于：  

```javascript
var f = function(v) {
  return v;
}
```  

