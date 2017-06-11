---
title: 用Markdown画流程图
date: 2017-06-10 14:58:34
categories: "Hexo教程"
tags:
---

```flow
st=>start: 开始:>http://www.google.com[blank]
e1=>end: 完成:>https://twitter.com/SixHu[blank]
e2=>end: 撒有哪啦:>http://baike.baidu.com/link?url=HeIUMXvJKDyUn1Wb1PUlrKIlSHn-RmACMjx2jVGW-eQbCJE3f3xSpGLyyYv9zDdx0m5BPk5cB76EskfA7ftin-nLS6fUzRoJGqxPo65-FdK[blank]
op1=>operation: 我是码农|past
sub1=>subroutine: go out!|invalid
c1=>condition: 是或否?|approved
c2=>condition: 你笑了吗|current
c3=>condition: 你哭了吗|past
io=>inputoutput: 厉害了，我的哥|request

st->op1->c1
c1(yes)->c2
c1(no,right)->sub1(right)->e2
c2(yes)->c3
c2(no)->op1
c3(yes)->io->e1
c3(no, right)->sub1->e2
```

***

 标签&#124;            | 备注  
 -:        | :- 
start&#124;          |  开始 
end&#124;            |  结束 
operation&#124;      | 处理  
subroutine&#124;     |子程序  
condition&#124;      |  条件  
inputoutput&#124;    |   输出 

<font color=green ><small>因为这个hexo主题对表格支持的不是很好，所以样子比较丑</small> </font>

---
用法：变量名=>标签名: 自定义内容:>https://www.baidu.com(可选)  
变量名(right或者left 默认是往下走)->变量名  
条件有两个流程，一个是yes，一个是no

<npm install --save hexo-filter-flowchart>
