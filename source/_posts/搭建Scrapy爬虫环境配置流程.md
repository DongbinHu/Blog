---
title: 搭建Scrapy爬虫环境配置流程
date: 2017-11-18 14:49:16
categories: 技术
tags:
description:
---
  

`前段时间，公司因业务需求，需要写一些爬虫项目，我被强行学了一波Python，昨天让我整理一篇环境搭建的文档，又因为之前搭环境的时候着实费了不少劲，所以就发到这里来吧，以后自己再搞Python的时候可以来看看这篇靠谱教程。本教程系统环境为win7 64位`  
  

## 1、安装python-2.7.14 win64位  

1.1. 双击执行附件中Python安装文件“python-2.7.14.amd64.msi”,按提示安装即可，如果安装期间更改了默认的安装位置，一定要记住，因为配置path时要用到。  
1.2. 默认路径是C:\Python27，以默认配置为例将 C:\Python27;C:\Python27\Scripts;两个路径加入电脑的环境变量，这样打开cmd，输入命令 python，如下图显示即为安装成功：
![Python测试](http://oyzg3m24h.bkt.clouddn.com/Python-test.png)  

--------------------------------------  

## 2、安装lxml  

打开cmd，执行命令`pip install lxml`，等待自动安装完成，出现下图即为安装成功：  
![lxml测试](http://oyzg3m24h.bkt.clouddn.com/lxml-test.png)  

---------------------------------------  

## 3、安装zope.interface  

继续执行命令`pip install zope.interface`，等待自动安装完成，出现下图即为安装成功：  
![lxml测试](http://oyzg3m24h.bkt.clouddn.com/zope.interface-test.png)  

----------------------------------------  

## 4、安装pyOpenSSL  

4.1 双击执行附件中pyOpenSSL安装文件“pyOpenSSL-0.13.1.win-amd64-py2.7.exe”，按提示安装即可。  
4.2 验证的命令`import OpenSSL`。(cmd下先运行命令`python`,在执行验证命令)  

-----------------------------------------  

## 5、安装Twisted  

5.1 双击执行附件中Twisted 安装文件“Twisted-15.0.0.win-amd64-py2.7.msi”，按提示安装即可。
5.2 .验证的命令`from twisted.internet import reactor`。(cmd下先运行命令`python`,在执行验证命令)  

-----------------------------------------  

## 6、安装pywin32  

6.1 双击执行附件中pywin32安装文件“pyOpenSSL-0.13.1.win-amd64-py2.7.exe”，按提示安装即可。
6.2 验证的命令`import win32api`。(cmd下先运行命令`python`,在执行验证命令)  

------------------------------------------  

## 7、安装Scrapy  

打开cmd，执行命令pip install Scrapy，等待自动安装完成，出现下图即为安装成功：  
![lxml测试](http://oyzg3m24h.bkt.clouddn.com/zope.interface-test.png)  

------------------------------------------  

## 8、安装Python IDE  

安装PyCharm,安装文件及破解汉化教程在附件“pycharm2016-2企业版.zip”中。  

------------------------------------------  

## 9、安装依赖模块  

9.1 打开cmd，执行命令`pip install pika`，等待自动安装完成  
9.2 执行命令`pip install demjson`，等待自动安装完成  
9.3 双击执行附件中MySQL-Python安装文件“MySQL-python-1.2.3.win-amd64-py2.7.exe”，按提示安装即可。  

------------------------------------------  

<a href="http://pan.baidu.com/s/1jHTvYzc" target="_blank">附件下载</a>
