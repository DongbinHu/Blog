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
明天再写