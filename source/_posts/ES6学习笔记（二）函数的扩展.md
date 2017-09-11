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
function log(x,y='World') {
    console.log(x,y);
}
log('Hello') //Hello World
log('Hello','China') //Hello China
log('Hello','') //Hello
```  

可以看到，ES6的写法比ES5简洁多了，而且非常自然。下面是另一个例子。  

```javascript
function Point(x=0,y=0) {
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
function foo(x,x,y=1) {
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

```
对于m1来说，没有传参数的情况下，m1的参数默认是一个空对象，然后进行解构赋值，才有的x,y的默认值。也就是说，m1不但有函数参数值得默认值，而且还有解构赋值。在传值的情况向，我测试的结果是，只有传null的时候，会报错，其他情况只要没有覆盖解构赋值中的想x,y的值，都会打印出[0,0]
而对于m2来说，在没有传参数的情况下，函数会将它的默认值也就是{x:0,y:0}打印出来，传值之后，就覆盖了函数的参数默认值，而m2没有解构赋值，所以，如果穿的对象中没有x，y的值，就会打印出undefined。（传null同样会报错）
```  

