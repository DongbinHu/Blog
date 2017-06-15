---
title: gulp学习记录
date: 2017-06-14 16:56:19
categories: 前端学习笔记
tags:
description: 前端构建工具gulp.js的使用介绍及技巧
---

`gulp.js是一个前端构建工具，之前见同事用过，今天就来学一学`

# 1、gulp的安装
首先全局方式安装gulp
`npm install -g gulp`
全局安装完后在当前项目目录下再安装一次，如果想在安装的时候把gulp写进项目package.json文件的依赖中，就加上参数 `--save-dev`，如下：
`npm install --save-dev gulp`
至于为什么在全局安装gulp后，还需在项目本地安装一次，有兴趣的可以看下stackoverflow上有人做出的回答：  
[why-do-we-need-to-install-gulp-globally-and-locally](https://stackoverflow.com/questions/22115400/why-do-we-need-to-install-gulp-globally-and-locally)，[what-is-the-point-of-double-install-in-gulp](https://stackoverflow.com/questions/25713618/what-is-the-point-of-double-install-in-gulp)（*反正我是没兴趣，所以没看*）
**特别说明：**我在本地安装完gulp后报错，提示没有找到package.json文件，试了几次都不行，后来自己引导创建了一个package.json文件，命令：`npm init -y`  

----------
# 2、开始使用gulp.js
## 2.1 建立gulpfile.js
需要在项目根目录下建立一个`gulpfile.js`，所有我们自定义的任务都写在这个文件里。下面是一个简单的`gulpfile.js`文件的示例，它定义了一个默认的任务。
```javascript
var gulp = require('gulp');
gulp.task('default',function(){
    console.log('hello world')
})
```
此时我们的目录结构是这样的：
├── gulpfile.js
├── node_modules
│ └── gulp
└── package.json  
----------
## 2.2 运行gulp任务
要运行gulp任务，需要命令行模式下切换到`gulpfile.js`文件的目录，然后执行`gulp`命令就可以了，`gulp`后面跟着任务的名称，例如`gulp six`,如果没有指定任务名，就会执行任务名为`default`的默认任务 
 
----------
# 3、gulp的API介绍
我看的教程上写的是，只需要知道4个API，分别是`gulp.src()`,`gulp.task()`,`gulp.dest()`,`gulp.watch()`。下面对每个API进行说明
## 3.1 gulp.src()
Gulp使用的是Nodejs中的stream(流)来进行工作的，首先获取到需要的stream，然后可以通过stream的`pipe()`方法把流导入到你想要的地方，比如Gulp的插件中，经过插件处理后的流又可以继续导入到其他插件中，当然也可以把流导入到其他文件中。所以Gulp是以stream为媒介的，它不需要频繁的生成临时文件，因此处理速度比较快。
`gulp.src()`方法正是用来获取流的，但要注意这个流里的内容不是原始的文件流，而是一个虚拟文件对象流([Viny| files](https://github.com/gulpjs/vinyl-fs))，这个虚拟文件对象中存储着原始文件的路径、文件名、内容等信息，这个我们暂时不用去深入理解，只需简单的理解可以用这个方法来读取你需要操作的文件就行了。
### 3.1.1 其语法为：
`gulp.src(globs{, options})`
**globs**参数是文件匹配模式，（类似正则表达式），用来匹配文件路径（包括文件名），当然这里也可以直接指定某个具体的文件路径。当有多个文件匹配时，该参数可以为一个数组。
**options**为可选参数。通常情况下用不到（*事实是我根本没研究到底这个参数是干什么用的*）
Gulp内部使用了[node-glob](https://github.com/isaacs/node-glob)模块来实现其文件匹配功能。我们可以使用下面这些特殊的字符来匹配我们想要的文件：
 + `*`  匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
 + `**`  匹配路径中0个或多个目录及其子目录，需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
 + `?`  匹配文件路径中的一个字符（不会匹配路径分隔符）
 + `[...]`  匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为`^`或`!`时，则表示不匹配方括号中出现的其他字符中的任意一个。
 + `!(pattern|pattern|pattern)` 匹配任何与括号中给定的任一模式都不匹配的
 + `?(pattern|pattern|pattern)` 匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?
 + `+(pattern|pattern|pattern)`     匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+
 + `*(pattern|pattern|pattern)` 匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*
 + `@(pattern|pattern|pattern)` 匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)@
----------
### 3.1.2 当有多种匹配模式时可以使用数组：
```javascript
//使用数组的方式来匹配多种文件
gulp.src(['js/*.js','css/*.css','*.html'])
```  
----------
### 3.1.3 使用数组的方式还有一个好处就是可以排除某些文件，要注意的是，不能在数组的第一个元素中使用排除模式，排除模式就是在匹配模式前面加上`!`
```javascript
gulp.src(['*.js','!b*.js'])  //匹配所有js文件，但是排除以b开头的js文件
gulp.src(['!b*.js','*.js'])  //buhui排除任何文件，因为排除模式不能写在数组中的第一个元素上
```  
----------
### 3.1.4 此外，还可以使用展开模式。展开模式以花括号作为定界符，根据它里面的内容，会展开为多个模式，最后匹配的结果为所有展开模式相加起来的结果，展开的例子如下:
+ `a{b,c}d`会展开为`abd`，`acd`
+ `a{b,}c`会展开为`abc`，`ac`
+ `a{0..3}b`会展开为`a0b`，`a1b`，`a2b`，`a3b`
+ `a{b,c{d,e}f}g`会展开为`abg`，`acdfg`，`acefg`
+  `a{b,c}d{e,f}g`会展开为`abdeg`，`acdeg`，`abdfg`，`acdfg`  
----------
## 3.2 gulp.dest()  
### 3.2.1 gulp.dest()方法是用来写文件的，其语法为：  

```javascript 
gulp.dest(path[, options])
```  

**path**为写入文件的路径  
**options**同[**3.1.1**](#3-1-1-其语法为：)  

----------------  

### 3.2.2 gulp.dest()方法path参数解释  
要想使用好`gulp.dest()`这个方法，就要理解给它传入的路径参数和最终生成文件的关系。  
> gulp的使用流程一般是这样子的：首先通过`gulp.src()`方法获取到我们想要处理的文件流，然后把文件流通过pipe方法导入到gulp插件中，最后把经过插件处理后的流再通过pipe方法导入到`gulp.dest()`中，`gulp.dest()`方法则把流中的内容写入到文件中，这里首先需要弄清楚的一点是，我们给`gulp.dest()`传入的路径参数，只能用来指定要生成文件的目录，而不能生成文件的文件名，它生成文件的文件名使用的是导入到它的文件流自身的文件名，所以**生成的文件名是由导入到它的文件流决定的**，即使我们给它传入一个带有文件名的路径参数，然后它也会把这个文件名当做是目录名，例如：  

```javascript
var gulp = require('gulp');
gulp.src('script/jquery.js')
    .pipe(gulp.dest('six/foo.js'));
//最终生成的文件路径为 six/foo.js/jquery.js，而不是 six/foo.js
```  

其他例子：
```javascript
gulp.src('script/avalon/avalon.js') //没有通配符出现的情况
    .pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/avalon.js
    
//有通配符开始出现的那部分路径为 **/underscore.js
gulp.src('script/**/underscore.js')
    //假设匹配到的文件为script/util/underscore.js
    .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/util/underscore.js

gulp.src('script/*') //有通配符出现的那部分路径为 *
    //假设匹配到的文件为script/zepto.js    
    .pipe(gulp.dest('dist')); //则最后生成的文件路径为 dist/zepto.js
```  
----------
### 3.2.3 base属性
通过指定`gulp.src()`方法配置中的`base`属性，我们可以更灵活的改变`gulp.dest()`生成的文件路径。  
当我们没有在`gulp.src()`方法中配置`base`属性时，`base`的默认值为通配符开始之前的那部分路径，例如：  
```javascript
gulp.src('app/src/**/*.css') //此时base的值为 app/src
```  
上面我们所说的`gulp.dest()`所生成的文件路径的规则，其实可以理解为，`gulp.dest()`中的参数替换掉了`gulp.src()`中的`base`路径，最终得到生成文件的路径。  
```javascript
gulp.src('six/lib/**/*.js') //此时的base值为 six/lib,也就是说它的base路径为 six/lib
    //假设该模式匹配到了文件 six/lib/src/seven.js
    .pipe(gulp.dest('cloud'))  //用cloud替换掉base路径，最终得到cloud/src/seven.js
```  
所以改变base路径后,`gulp.dest()`生成的文件路径也会改变。  
```javascript
gulp.src('six/lib/**/*.js',{base:'six'})  //配置了base参数，此时的base路径为 six
    //假设该模式匹配到了文件 six/lib/src/seven.js
    .pipe(gulp.dest('cloud'))  //用cloud替换掉base路径，最终得到cloud/lib/src/seven.js
```  
> 用`gulp.dest()`把文件写入到文件后，文件流仍然可以继续使用。  
----------
## 3.3 gulp.task()  
### 3.3.1 gulp.task()用法及参数介绍  
> `gulp.task()`方法用来定义任务，内部使用的是[Orchestrator](https://github.com/robrich/orchestrator)，其语法为：  

```javascript
gulp.task(name,[deps], fn)
```  
**name** 为任务名  
**deps** 是当前定义的任务需要依赖的其他任务，为一个数组。当前定义的任务会在所有依赖的任务执行完毕后才开始执行。如果没有依赖，则可以省略这个参数。  
**fn** 为任务函数，我们把任务需要执行的代码写到里面。该参数也是可选的。  
```javascript
gulp.task('six',['array','of','task','sass'], function(){
//Do something
});
```  
`gulp.task()`这个API没有什么好讲的，但需要知道执行多个任务时怎么控制任务执行的顺序。  
----------
### 3.3.2 gulp.task()执行多个任务
gulp中执行多个任务，可以通过任务依赖来实现。例如我想要执行`one`，`two`，`three`这三个任务，那我们就可以定义一个空的任务，然后把这三个任务当做这个空的任务的依赖就行了：  
```javascript
//只要执行default任务，就相当于把one，two，three这三个任务都执行了
gulp.task('default',['one','two','three']);
```  
----------
### 3.3.3 依赖任务为异步任务
如果任务相互之间没有依赖，任务会按你书写的任务来执行，如果有依赖的话则会先执行依赖的任务。  
但是如果某个任务所依赖的任务是异步的，就要注意了，gulp不会等待那个所依赖的异步任务完成，而是会接着执行后续的任务。例如：  
```javascript
gulp.task('one', function(){
    //one是一个异步执行的任务
    setTimeout(function(){
        console.log('one');
    },2000);
});
//two任务虽然依赖one任务，但不会等待one任务执行完成后再执行
gulp.task('two',['one'],function(){
    console.log('two');
});
```  
上面的例子执行two任务时，会先执行one任务，但不会等one任务执行完成后再执行two任务，而是紧接着执行two任务，这样two任务就会在one任务前执行完了。  
**想要等待异步任务执行完成后再执行后续的任务，有三种方法：**  
#### 第一、在异步操作完成后执行一个回调函数来通知gulp这个异步任务已经完成，这个回调函数就是任务函数的第一个参数。  
```javascript
gulp.task('one', function(six){ //six为任务函数提供的回调，用来通知任务已经完成
    //one是一个异步执行的任务
    setTimeout(function(){
        console.log('one');
        six(); //执行回调，表示这个异步任务已经完成
    },2000);
});
//这是two任务会在one任务中的异步操作完成后再执行
gulp.task('two',['one'],function(){
    console.log('two');
});
```  
#### 第二、定义任务时返回一个流对象。适用于任务就是操作`gulp.src()`获取到流的情况。  
```javascript
gulp.task('one',function(six){
    var stream = gulp.src('six/js/*.js')
        .pipe(do something)
        .pipe(gulp.dest('seven'));
    return stream;
});
gulp.task('two',['one'],function(){
    console.log('two');
});
```  
####第三、返回一个promise对象，例如：  
```javascript
var Q = require('q');  //一个著名的异步处理的库 https://github.com/kriskowal/q
gulp.task('one',function(six){
    var deferred = Q.defer();
    //做一些异步操作
    setTimeout(function(){
        deferred.resolve()
    },5000);
    return deferred.promise;
});
gulp.task('two',['one'],function(){
    console.log('two');
});
```  
> `gulp.task()`就这些了，主要是要知道当依赖是异步任务时的处理  
----------
## 3.4 gulp.watch()  
`gulp.watch()`用来监视文件的变化，当文件发生变化后，我们可以利用它来执行相应的任务，例如文件压缩等。其语法为  
```javascript
gulp.watch(glob,[opts], tasks)
```  
**glob** 为要监视的文件匹配模式，规则和用法与`gulp.sec()`方法中的`glob`一样  
**opts** 为一个可选的配置对象，通常不需要用到  
**tasks** 为文件变化后要执行的任务，为一个数组  
```javascript
gulp.task('uglify', function(){
    //do something
});
gulp.watch('six/lib/*.html',['uglify','reload']);
```  
`gulp.watch()`还有另外一种使用方式：  
```javascript
gulp.watch(glob,[opts,cb])
```  
**glob**和**opots**参数与第一种用法相同  
**cb**参数为一个函数。每当监视的文件发生变化时，就会调用这个函数，并且会给它传入一个对象，该对象包含了文件变化的一些信息，`type`属性为变化的类型，可以是`added`，`changed`，`deleted`；`path`属性为发生变化的文件的路径  
```javascript
gulp.watch('six/seven/*.js',function(event){
    console.log(event.type);    //变化类型 added为新增，changed为修改，deleted为删除
    console.log(event.path);    //变化文件的路径
});
```  
如下：  
![刚试了一下，还真管用](/img/1.png)
----------