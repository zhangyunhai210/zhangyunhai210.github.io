---
title: AJAX
date: 2018-06-14 06:32:57
tags:
- web
- http
- js
- 跨域
- AJAX
- ajax
---
# **AJAX和XMLHttpRequest**
___
ajax是一项伟大的技术，其很好的解决了传统浏览器一言不合就重新发送整个页面，速度慢，用户体验差的问题。它是一个获取资源的手段，可以在不进行整体刷新的情况下进行局部dom修改，速度快，用户体验好。实现的原理主要是基于一个类，`XMLHttpRequest`
<!-- more -->
`XMLHttpRequest`是一个提供在客户端的情况下客户端和服务器之间传输数据的API.它提供了一个通过URL来获取数据的简单方式,并且不会使整个页面刷新

```flow
ev=>operation: EventTarget|past
xe=>operation: XMLHttpRequestEventTarget
xr=>operation: XMLHttpRequest

xr(right)->xe(right)->ev

```
尽管名字里有XML,但`XMLHTTPRequest`可以取回所以类型的数据资源,并不仅限于XML.而且除了HTTP,它还支持`file`和`ftp`协议
___
## **XMLHttpRequest**
___
### **构造函数**
`XMLHttpRequest()`
    构造函数初始化了一个`XMLHTTPRequest`对象.必须在所以其他方法调用前调用构造函数
___
### **属性**
此接口继承了`XMLHTTPRequestEventTarget`和`EventTarget`的属性

<table>
   <tr>
      <td>属性</td>
      <td>类型</td>
      <td>描述</td>
   </tr>
   <tr>
      <td>onreadystatechange</td>
      <td>Function</td>
      <td>一个js函数对象,当readyState属性该表是会调用它.回调函数会在user interface线程中调用(一般用于判断没阶段的回调函数)</td>
   </tr>
   <tr>
      <td>readyState</td>
      <td>unsigned short</td>
      <td>表示请求的五种状态
        <table>
            <tr>
                <td>值</td><td>状态</td><td>描述</td>
            </tr>
            <tr>
                <td>
                0
                </td>
                <td>
                UNSENT (未打开)
                </td>
                <td>
                open()方法还未被调用.
                </td>
            </tr>
            <tr>
                <td>
                1
                </td>
                <td>
                OPEND
                </td>
                <td>
                open()方法已经被调用.
                </td>
            </tr>
            <tr>
                <td>
                2
                </td>
                <td>
                HEADERS_RECEIVED (已获取响应头)
                </td>
                <td>
                send()方法已经被调用, 响应头和响应状态已经返回.
                </td>
            </tr>
            <tr>
                <td>
                3
                </td>
                <td>
                LOADING (正在下载响应体)
                </td>
                <td>
                响应体下载中; responseText中已经获取了部分数据.
                </td>
            </tr>
            <tr>
                <td>
                4
                </td>
                <td>
                DONE (请求完成)
                </td>
                <td>
                整个请求过程已经完毕.
                </td>
            </tr>
        </table>
      </td>
            <tr>
                <td>
                response
                </td>
                <td>
                	varies
                </td>
                <td>
                响应实体的类型由 responseType 来指定， 可以是 ArrayBuffer， Blob， Document， JavaScript 对象 (即 "json")， 或者是字符串。如果请求未完成或失败，则该值为 null。
                </td>
            </tr>
            <tr>
                <td>
                responseText
                </td>
                <td>
                DOMString
                </td>
                <td>
                此次请求的响应为文本，或是当请求未成功或还未发送时为 null。只读。
                </td>
            </tr>
            <tr>
                <td>
                responseType
                </td>
                <td>
                XMLHttpRequestResponseType
                </td>
                <td>
                设置该值能够改变响应类型。就是告诉服务器你期望的响应格式。
                "" (空字符串)	字符串(默认值);
                "arraybuffer"	ArrayBuffer;
                "blob"	Blob;
                "document"	Document;
                "json"	JavaScript 对象，解析自服务器传递回来的JSON 字符串。;
                "text"	字符串;
                </td>
            </tr>
            <tr>
                <td>
                responseXML	
                </td>
                <td>
                Document
                </td>
                <td>
                本次请求的响应是一个 Document 对象，如果是以下情况则值为 null：请求未成功，请求未发送，或响应无法被解析成 XML 或 HTML。当响应为text/xml 流时会被解析。当 responseType 设置为"document"，并且请求为异步的，则响应会被当做 text/html 流来解析。只读.
                </td>
            </tr>
            <tr>
                <td>
                status
                </td>
                <td>
                unsigned short	
                </td>
                <td>
                该请求的响应状态码 (例如, 状态码200 表示一个成功的请求).只读.
                </td>
            </tr>
            <tr>
                <td>
                statusText
                </td>
                <td>
                DOMString	
                </td>
                <td>
                该请求的响应状态信息,包含一个状态码和原因短语 (例如 "200 OK"). 只读.
                </td>
            </tr>
            <tr>
                <td>
                upload
                </td>
                <td>
                XMLHttpRequestUpload	
                </td>
                <td>
                可以在 upload 上添加一个事件监听来跟踪上传过程。
                </td>
            </tr>
            <tr>
                <td>
                withCredentials
                </td>
                <td>
                boolean
                </td>
                <td>
                表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。
                </td>
            </tr>
   </tr>
   
</table>
___

### **方法**
<span style="background-color:#333;color:#fff;">abort()</span>
如果请求已经被发送,则立刻中止请求
<span style="background-color:#333;color:#fff;">getAllResponseHeaders()</span>
`DOMString getAllResponseHeaders()`
返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回null. 
<span style="background-color:#333;color:#fff;">getResponseHeader()</span>
`DOMString? getResponseHeader(DOMString header);`
返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回null.
<span style="background-color:#333;color:#fff;">open()</span>
初始化一个请求. 该方法用于JavaScript代码中;如果是本地代码, 使用 openRequest()方法代替.

<p style="color:red">注意: 在一个已经激活的request下（已经调用open()或者openRequest()方法的request）再次调用这个方法相当于调用了abort（）方法。</p>

```
void open(
   DOMString method,
   DOMString url,
   optional boolean async,
   optional DOMString user,
   optional DOMString password
);
```
参数
`method`
请求所使用的HTTP方法; 例如 "GET", "POST", "PUT", "DELETE"等. 如果下个参数是非HTTP(S)的URL,则忽略该参数.
`url`
该请求所要访问的URL
`async`
一个可选的布尔值参数，默认为true,意味着是否执行异步操作，如果值为false,则send()方法不会返回任何东西，直到接受到了服务器的返回数据。如果为值为true，一个对开发者透明的通知会发送到相关的事件监听者。这个值必须是true,如果multipart 属性是true，否则将会出现一个意外。
`user`
用户名,可选参数,为授权使用;默认参数为空string.
`password`
密码,可选参数,为授权使用;默认参数为空string.
<span style="background-color:#333;color:#fff;">overrideMimeType()</span>
重写由服务器返回的MIME type。这个可用于, 例如，强制把一个响应流当作“text/xml”来处理和解析,即使服务器没有指明数据是这个类型。注意，这个方法必须在send()之前被调用。
`void overrideMimeType(DOMString mimetype);`
<span style="background-color:#333;color:#fff;">send()</span>
发送请求. 如果该请求是异步模式(默认),该方法会立刻返回. 相反,如果请求是同步模式,则直到请求的响应完全接受以后,该方法才会返回.
```
void send();
void send(ArrayBuffer data);
void send(Blob data);
void send(Document data);
void send(DOMString? data);
void send(FormData data);
```
<span style="background-color:#333;color:#fff;">setRequestHeader()</span>
给指定的HTTP请求头赋值.在这之前,你必须确认已经调用 open() 方法打开了一个url.
```
void setRequestHeader(
   DOMString header,
   DOMString value
);
```
参数
`header`
将要被赋值的请求头名称.
`value`
给指定的请求头赋的值.
### **原生AJAX方式**
```
let xmlHttp = new XMLHttpRequest();
//GET
function doGet(url){//注意在传参数值的时候最好使用encodeURI处理一下，防止乱码
	createxmlHttpRequest();
	xmlHttp.open("GET",url);
	xmlHttp.send(null);
	xmlHttp.onreadystatechange=function(){
		if(xmlHttp.readyState==4&&xmlHttp.status==200){
			alert('success');
		}else{
			alert('fail');
		}
	}
}
//post
function doPost(url,data){//注意在传参数值的时候最好使用encodeURI处理一下，防止乱码
	createxmlHttpRequest();
	xmlHttp.open("POST",url);
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xmlHttp.send(data);
	xmlHttp.onreadystatechange=function(){
		if(xmlHttp.readyState==4&&xmlHttp.status==200){
			alert('success');
		}else{
			alert('fail');
		}
	}
}
```
___
## **AJAX实现原理**
大概的原理分为以下3步
1. 新建XMLHttpRequest对象,`var xhr = new XMLHttpRequest()`
2. 通信需要一个回调函数,这个函数可以通过`xhr.onreadystatechange = callback;`来进行回调.对方的回信状态(200,404等)存储在`xhr.responseText`.当通信状态`xhr.readyState === 4`的时候,`xhr.responseText`数据就是完整的了.
3. 收到回信,进行相应的dom操作,实现局部刷新
<br/>
可以看到,可以看到，其实一个ajax的请求，是很简单简洁的，只要开发者提供，method（get还是post）,data(要传递的数据，ajax本身是用来通信的嘛)，url(通信的对象)，callback(收到回信后的处理)就可以完成一次通信，别的地方是重复性的劳动，不必每次都繁琐的写一遍。所以我建了一个类，提供send方法，实现信息的发送（ajax重复性的工作），上述四个数据存储在每个实例中，只要实例调用send方法，就会进行一次ajax通信。大概的代码思路是这样：
```
function Ajax(obj){
  //根据obj对method,data,url等进行初始化
};
Ajax.prototype.send = function(){
  var xhr = null;  
  // 实例化XMLHttpRequest对象 
  if(window.XMLHttpRequest) { 
   xhr = new XMLHttpRequest(); 
  } else { 
   // IE6及其以下版本 
   xhr = new ActiveXObjcet('Microsoft.XMLHTTP'); 
  };
  xhr.onreadystatechange = function(){//注册回调函数
    if(xhr.readyState === 4){
        if(xhr.status === 200)//请求成功
            callback(xhr.responseText);
        if(xhr.status === 404)//请求失败
            error();
     }else{
        console.log("请求中");
    }
  }
  if(method === 'get'){//如果是get方法，需要把data中的数据转化作为url传递给服务器
    xhr.open(method,url+'?'+data,true);
    xhr.send(null);
  }else if(method === 'post'){//如果是post，需要在头中添加content-type说明
      xhr.open(method,url,true);
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
      xhr.send(JSON.stringify(data));//发送的数据需要转化成JSON格式
  }else {
    console.log('不识别的方法:'+method);
    return fasle;
  }
}
```
有了这个类,只需要执行下面代码
```
var ajax = new Ajax({
  method:'get',//设置ajax方法
  url:'http://localhost:3000',//设置通讯地址
  callback:function(res){//设置回调函数
     alert(res)
  },
  error:function(){console.log("失败")},
  data: data//需要传递的数据
})
ajax.send();
```
