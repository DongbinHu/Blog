---
title: ES6学习笔记（一）
date: 2017-06-17 09:56:44
categories: 技术
tags:
description: ES6学习笔记 不定时更新
---
  
`本篇是写我在学习ES6过程中碰到的一些问题，不定时更新`  

## 注：
`因为考虑到没有目录选项，所以这篇文章不再更新，后期会分模块写到博客中。`
# 1、let  
学习let的时候，在阮一峰老师的《**ECMAScript 6 入门**》中，有这么一段，如下：  
> ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。  
下面的代码如果使用var，最后输出的是9。  
```javascript
var a = [];
for (var i = 0; i < 10; i++) {
    var c = i;
    a[i] = function () {
    console.log(c);
    };
}
a[6](); // 9
```  
> 如果使用let，声明的变量仅在块级作用域内有效，最后输出的是6。  
```javascript
var a = [];
for (var i = 0; i < 10; i++) {
    let c = i;
    a[i] = function () {
    console.log(c);
    };
}
a[6](); // 6
```  
  
我在[codepen](https://codepen.io/)中验证了一下，结果是没错的。但是不明白这和块级作用域有什么关系，大家都知道for循环的闭包问题，用`var`声明变量，就像上文中第一段代码那样，`var c = i;`中的`c`，它保存的就是`i`的值，它最后一次被赋值的时候`i`的值为`9`，所以`c`最后保存的值是`9`，而最后的`console.log(c)`中其实是没有`c`这个变量的，所以要去父级作用域去找，找到`c`时，它已经是`9`了。  
  
我理解的for循环是这样，如果循环体中嵌套了函数，就像上文中第一段代码，其实是循环生成了`i-1`个不同的函数，`a[0] = function(){...}`、`a[1] = function(){...}`等，当你每次去调用这些函数中的某一个时，都会先循环生成所有的函数，然后再去执行你调用的那个函数，而这些函数中都没有声明变量`c`，所以都是找的`var c = i;`中的`c`，其实就这么一个变量，它最后值为`9`,那么所有的函数中的`c`都是9。  
  
对于第一段代码，Bable解析的结果是下面这样：  
```javascript
var a = [];for (var i = 0; i < 10; i++) {if (window.CP.shouldStopExecution(1)){break;}
  var c = i;a[i] = function () {
    console.log(c);
  };
}
```  
第二段代码，Bable解析出来的结果是下面这样：  
```javascript
var a = [];
var _loop = function _loop() {
  var c = i;
  a[i] = function () {
    console.log(c);
  };
};
for (var i = 0; i < 10; i++) {if (window.CP.shouldStopExecution(1)){break;}
  _loop();
}
window.CP.exitedLoop(1);
```  
for循环肯定是创建了10个函数`a[0]`,`a[1]`…`a[9]`，不同的是，使用var创建变量，只有一个`c`，每循环一次，`c`就被覆盖 一次，`a[i]`函数中的c指向的是只是这一个`c`，所以输出`9`，而使用let创建变量，实际上是创建了十个变量，每个`a[i]`方法都指向不同的`c`，也就是说，用`let`声明的变量，只在它被声明的块级作用域有效，当重新用`let`声明同样名称的变量时，它和之前声明的是不冲突的。如下例：  
```javascript
{
    let six = 6;
    {
        let six = 7; //这里声明的six变量和它的父级声明的six没有任何关系
        //但是如果把let去掉，下面就会输出7了
    }
    console.log(six);   //6
}
```  
> 另外，`for`循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
```  
上面代码正确运行，输出了3次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域。  
  
我试着将循环体内的`let`去掉后，只输出1次abc，这是因为循环体内的`i`的值覆盖了父作用域的`i`，将代码改成下面这样，同样只输出一次abc  
```javascript
for (var i = 0; i < 3; i++) {
  var i = 'abc';
  console.log(i);
}
```  
道理一样，`var`声明的变量会覆盖本函数的局部变量，也就是说它们都是同一个变量，只不过在不同的作用域。但是`var`声明的变量是没有块级作用域一说的。  
这里还要说的一点是，在[codepen](https://codepen.io/)里输入下面这段代码  
```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
```  
控制台只会输出一次`abc`，这是因为Bable会把上面这段代码解析成下面这样  
```javascript
for (var i = 0; i < 3; i++) {
  var i = 'abc';
  console.log(i);
}
```  
这是错的。直接在chrome控制台输入是不会出现这种情况的，chrome支持ES6，所以只能说是Bable解析错了。  
## **补充**:  
> 基本类型值与引用类型值
JS中的变量可以保存两种不同类型的值：基本类型值和引用类型值。
在将一个值赋给变量时，解析器必须确定这个值是基本类型值还是引用类型值。
基本数据类型：Number、String、Boolean、Null、Undefiend；这5种基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。
对于基本类型值，在复制变量的时候，会在新的变量上创建一个新值，这个新值是原值的一个副本，它们相互独立。
基本类型值之间的比较，只是单纯的值的比较。
引用类型值是保存在变量中的对象；引用类型值就是指对象。
保存引用类型值的变量，实际上保存的是一个指向该对象的指针。
当复制保存着对象的某个变量时，复制的其实是指针；复制操作结束后，两个变量指向同一个对象。
对于引用类型值，可以为其添加属性和方法，也可以修改或者删除其属性和方法。
在为对象添加属性和方法时，操作的是实际的对象，因此，改变任何一个变量，都会影响另外一个变量。
```javascript
var person1 = {
    name : "CC"
};
var person2 = person1;
console.log(person2.name);    //"CC"
person2.name = "VV";
console.log(person1.name);    //"VV"
```  
> 引用类型值的比较并非值的比较：即使两个对象包含相同的属性和值，它们也是不相等的；各个索引元素完全相等的两个数组也不相等。 
引用类型值的比较是引用的比较，当且仅当它们引用同一个对象时，它们才相等。
示例1：
```javascript
var person1 = {
    name : "CC"
};
var person2 = {
    name : "CC"
};
console.log(person1==person2);    //false
```  
> 示例2：
```javascript
var person1 = {
     name : "CC"
};
var person2 = person1;
console.log(person1 == person2);    //true
```  

--------------------------  

*<p style="float:right">2017-07-25</p>*  
# 2、字符串的扩展
## 2.1 字符串的遍历器接口
> ES6为字符串添加了遍历器接口（详见《Iterator》一章），使得字符串可以被for...of循环遍历。  
  
```javascript
var six = '胡东斌';
for (let i of six){
    console.log(i);
}
//胡
//东
//斌
```  

## 2.2 includes(), startsWith(), endsWith()  
> 传统上，JavaScript只有indexof方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6又提供了三种新方法。 
 
* includes():返回布尔值，表示是否找到了字符串。
* startsWith():返回布尔值，表示参数字符串是否在源字符串的头部。
* endsWith():返回布尔值，表示参数字符串是否在源字符串的尾部。  

```javascript
var s = 'Hello world!';
s.includes('o');  //true
s.startsWith('Hello');  //true
s.endsWith('!');  //true
```  

这三个方法都支持第二个参数，表示开始搜索的位置  
```javascript
var s = 'Hello world';
s.includes('o',2);   //true
s.startsWith('world',6);  //true
s.endsWith('Hello',5)  //true
```  

上面代码表示，使用第二个参数`n`时，`endsWith`的行为与其他两个方法有所不同。它针对前`n`个字符，而其他两个方法针对从第`n`个位置开始，直到字符串结束