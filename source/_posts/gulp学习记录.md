---
title: gulp学习记录
date: 2017-06-14 16:56:19
categories: 前端学习笔记
tags:
description: 前端构建工具gulp.js的使用介绍及技巧
---

`gulp.js是一个前端构建工具，之前见同事用过，今天就来学一学`

# 1.gulp的安装
首先全局方式安装gulp
`npm install -g gulp`
全局安装完后在当前项目目录下再安装一次，如果想在安装的时候把gulp写进项目package.json文件的依赖中，就加上参数 --save-dev，如下：
`npm install --save-dev gulp`
至于为什么在全局安装gulp后，还需在项目本地安装一次，有兴趣的可以看下stackoverflow上有人做出的回答：[why-do-we-need-to-install-gulp-globally-and-locally](https://stackoverflow.com/questions/22115400/why-do-we-need-to-install-gulp-globally-and-locally)，[what-is-the-point-of-double-install-in-gulp](https://stackoverflow.com/questions/25713618/what-is-the-point-of-double-install-in-gulp)（*反正我是没兴趣，所以没看*）
**特别说明：**我在本地安装完gulp后报错，提示没有找到package.json文件，试了几次都不行，后来自己引导创建了一个package.json文件，命令：`npm init -y`  

----------
# 2.开始使用gulp.js
## 2.1建立gulpfile.js
需要在项目根目录下建立一个`gulpfile.js`，所有我们自定义的任务都卸载这个文件里。下面是一个简单的`gulpfile.js`文件的示例，它定义了一个默认的任务。
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
## 2.2运行gulp任务
要运行gulp任务，需要命令行模式下切换到`gulpfile.js`文件的目录，然后执行`gulp`命令就可以了，`gulp`后面跟着任务的名称，例如`gulp six`,如果没有指定任务名，就会执行任务名为`default`的默认任务 
 
----------
# 3.gulp的API介绍
我看的教程上写的是，只需要知道4个API，分别是`gulp.src()`,`gulp.task()`,`gulp.dest()`,`gulp.watch()`。下面对每个API进行说明
## 3.1 gulp.src()
Gulp使用的是Nodejs中的stream(流)来进行工作的，首先获取到需要的stream，然后可以通过stream的`pipe()`方法把流导入到你想要的地方，比如Gulp的插件中，经过插件处理后的流又可以继续导入到其他插件中，当然也可以把流导入到其他文件中。所以Gulp是以stream为媒介的，它不需要频繁的生成临时文件，因此处理速度比较快。
`gulp.src()`方法正是用来获取流的，但要注意这个流里的内容不是原始的文件流，而是一个虚拟文件对象流([Viny| files](https://github.com/gulpjs/vinyl-fs))，这个虚拟文件对象中存储着原始文件的路径、文件名、内容等信息，这个我们暂时不用去深入理解，只需简单的理解可以用这个方法来读取你需要操作的文件就行了。
### 3.1.1其语法为：
`gulp.src(globs{, options})`
**globs**参数是文件匹配模式，（类似正则表达式），用来匹配文件路径（包括文件名），当然这里也可以直接指定某个具体的文件路径。当有多个文件匹配时，该参数可以为一个数组。
**options**为可选参数。通常情况下用不到（*事实是我根本没研究到底这个参数是干什么用的*）
Gulp内部使用了[node-glob](https://github.com/isaacs/node-glob)模块来实现其文件匹配功能。我们可以使用下面这些特殊的字符来匹配我们想要的文件：
 + `*`  匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
 + `**`  匹配路径中0个或多个目录及其子目录，需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
 + `?`  匹配文件路径中的一个字符（不会匹配路径分隔符）
 + `[...]`  匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为`^`或`!`时，则表示不匹配方括号中出现的其他字符中的任意一个。
 + `!(pattern|pattern|pattern)` 匹配任何与括号中给定的任一模式都不匹配的
 + `(pattern|pattern|pattern)` 匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?
 + `(pattern|pattern|pattern)`     匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+
 + `(pattern|pattern|pattern)` 匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*
 + `(pattern|pattern|pattern)` 匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)

### 3.1.2当有多种匹配模式时可以使用数组：
```
//使用数组的方式来匹配多种文件
gulp.src(['js/*.js','css/*.css','*.html'])
```
### 3.1.3使用数组的方式还有一个好处就是可以排除某些文件，要注意的是，不能在数组的第一个元素中使用排除模式，排除模式就是在匹配模式前面加上`!`
```
gulp.src(['*.js','!b*.js'])  //匹配所有js文件，但是排除以b开头的js文件
gulp.src(['!b*.js','*.js'])  //buhui排除任何文件，因为排除模式不能写在数组中的第一个元素上
```

### 3.1.4 此外，还可以使用展开模式。展开模式以花括号作为定界符，根据它里面的内容，会展开为多个模式，最后匹配的结果为所有展开模式相加起来的结果，展开的例子如下:
+ `a{b,c}d`会展开为`abd`，`acd`
+ `a{b,}c`会展开为`abc`，`ac`
+ `a{0..3}b`会展开为`a0b`，`a1b`，`a2b`，`a3b`
+ `a{b,c{d,e}f}g`会展开为`abg`，`acdfg`，`acefg`
+  `a{b,c}d{e,f}g`会展开为`abdeg`，`acdeg`，`abdfg`，`acdfg`