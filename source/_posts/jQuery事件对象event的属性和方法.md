---
title: jQuery事件对象event的属性和方法
date: 2017-08-09 11:05:20
categories: 技术
tags:
description: jQuery事件对象event的学习总结
---
  
`之前一直没有把事件对象event搞清楚，今天学习Vue.js事件处理器的时候就懵逼了，于是趁现在总结一下`  

# 1. 事件对象常用的属性  
* `event.type`：获取事件的类型，触发元素的事件类型  

```javascript
$('#six').click(function(event){
    console.log(event.type);
});
//click
```  

* `event.pageX`和`event.pageY`：获取鼠标当前相对于页面的坐标，可以确定元素在当前页面的坐标值，是以页面为参考点，不随滚动条移动而变化。  

```javascript
$('#six').click(function(event) {
  console.log('位置：X：' + event.pageX + '，Y：' + event.pageY);
});
//位置：X：37，Y：12
```  

* `event.target`：获取触发事件的元素  

> __this__和__event.target__的区别：  
> js中事件是会冒泡的，所以this是可以变化的，但event.target不会变化，它永远是直接接受事件的目标DOM元素；this和event.target都是DOM对象，可以转换为jquery对象：`$(this)`和`$(event.target)`  

```javascript
$('#six').click(function(event){
    console.log(event.target.id);
})
//six
```  

* `event.which`：获取在鼠标单击事件中鼠标的左、中、右键（左键1，中间键2，右键3），在键盘事件中键盘的键码值。  
```javascript
$('#six').mousedown(function(event) {
  console.log(event.which);
})
//1
```  

* `event.currentTarget`：获取冒泡前的当前触发事件的DOM对象，等同于 __this__  

----------------------------------------------

# 2. 事件对象常用的方法  

* `event.preventDefault()`：阻止默认行为，可以用`event.isDefaultPrevent()`来确定 __preventDefault__ 是否被调用过了  
* `event.stopPropagation()`：阻止事件冒泡，事件是可以冒泡的，为防止事件冒泡到DOM树上，不触发任何前辈元素上的事件处理函数，可以用`event.isPropagationStopped()`来确定 __stopPropagation__ 是否被调用过了。  

---------------------------------------------  
等有时间了，把js事件冒泡整理一下。