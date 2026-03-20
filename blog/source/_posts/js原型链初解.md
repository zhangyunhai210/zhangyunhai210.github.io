---
title: js原型链初解
date: 2018-06-12 04:40:45
tags:
- web
- js
- 原型链
---

# **摘自JavaScript高级程序设计**
继承是OO语言中的一个最为人津津乐道的概念.许多OO语言都支持两种继承方式: 接口继承 和 实现继承 .接口继承只继承方法签名,而实现继承则继承实际的方法.由于js中方法没有签名,在ECMAScript中无法实现接口继承.ECMAScript只支持实现继承,而且其`实现继承`主要是依靠原型链来实现的.
<!-- more -->
<p style="color:red">在任何情况下,不要在object.prototye等原型上添加或改写任何函数!!!</p>

<a style="color:red" href="https://www.zhihu.com/question/26924011">为什么不要直接在Object.prototype上定义方法？</a>

实例的\__proto__属性实际上是一个指向实例原型的constructor属性的指针.
来看一下传统的原型继承
```javascript
       let People = function(name){
		if(name){this.name = name}
        this.fun = ()=>{
            console.log(this.name+' is a '+this.age+' of '+this.sex)
        }
    };
	People.prototype = {
        name : name || 'li',
        sex : "man",
        age : 22
	}
	let Health = function(hair,height,weight){
		this.hair = hair;
		this.height = height;
		this.weight = weight;
		this.getBMR = function(){
			let Bmr;
			//此时需要获取年龄性别等
			if(this.age == 'women'){
				Bmr = 655 + this.weight*9.6 + 1.8 * this.height - 4.7*this.age;
			}else{
				Bmr = 66 + this.weight*13.7  + 5 * this.height- 6.8*this.age;
			}
			return Bmr;
		}
	};
	let zhang = new People('zhang');
	zhang.fun();  
	//zhang is a 22 of man
    Health.prototype = zhang;
    //Health的原型指向实例zhang
	let zhangHealth = new Health('black',175,80);
	let zhangBMR = zhangHealth.getBMR();
	console.log(zhangHealth.name + " BMR is "+zhangBMR);
	//zhang BMR is 1887.4
    
```
以上方式,我们就手动创建出了一条原型链出来
```flow
Pe=>operation: People
Hh=>operation: Health
zh=>operation: zhang
zp=>operation: zhang.__proto__
hp=>operation: Health.prototype
zhH=>operation: zhangHealth
zhHp=>operation: zhangHealth.\_\_proto__

zhH->zhHp(right)->Hh->hp(right)->zh->zp(right)->Pe
```
再来看另一个例子:
```
<script>
function Father(){
    this.property = true;
}
Father.prototype.getFatherValue = function(){
    return this.property;
}
function Son(){
    this.sonProperty = false;
}
//继承 Father
Son.prototype = new Father();//Son.prototype被重写,导致Son.prototype.constructor也一同被重写
Son.prototype.getSonVaule = function(){
    return this.sonProperty;
}
let instance = new Son();
console.log(instance.getFatherValue());//true

console.log(instance.sonProperty);//false
console.log(instance);
/*Son {
	sonProperty:false
	__proto__:Father
		getSonVaule:ƒ ()
		property:true
		__proto__:Object
	}
*/
console.log(instance.__proto__);
/*
Father{
	getSonVaule:ƒ ()
	property:true
	__proto__:
		getFatherValue:ƒ ()
		constructor:ƒ Father()
		__proto__:Object
}
*/
console.log(instance.constructor);
/*
因为只有Father.prototype上才有constructor函数
ƒ Father(){
    this.property = true;
}
*/
</script>
```
通过把构造函数的原型指向另个构造函数的实例,就完成了手动的原型继承,es6中的class extands实际上只不过是以上手动方式的语法糖,当然有很多便利的方式也被包含在了extands函数中,只不过本质上是没有区别的.
<br/>
构造函数是原型的具体表现,实例是构造函数的现实表现.
# **原型链的问题**
原型链并非十分完美,它包含如下两个问题

> 问题一: 当原型链中包含引用类型值的原型时,该引用类型值会被所有实例共享;
> 问题二: 在创建子类型(例如创建Son的实例)时,不能向超类型(例如Father)的构造函数中传递参数.

有鉴于此, 实践中很少会单独使用原型链.
# **借用构造函数**
为解决原型链中上述两个问题, 我们开始使用一种叫做借用`构造函数(constructor stealing)`的技术(也叫经典继承).

> 基本思想:即在子类型构造函数的内部调用超类型构造函数.

```
function Father(){
    this.colors = ["red","blue","green"];
}
function Son(){
    Father.call(this);//继承了Father,且向父类型传递参数
}
let instance1 = new Son();
instance1.colors.push("black");
console.log(instance1.colors);//"red,blue,green,black"

let instance2 = new Son();
console.log(instance2.colors);//"red,blue,green" 可见引用类型值是独立的
```
很明显,借用构造函数一举解决了原型链的两大问题:
> 其一, 保证了原型链中引用类型值的独立,不再被所有实例共享;
> 其二, 子类型创建时也能够向父类型传递参数.

随之而来的是, 如果仅仅借用构造函数,那么将无法避免构造函数模式存在的问题--方法都在构造函数中定义, 因此函数复用也就不可用了.而且超类型(如Father)中定义的方法,对子类型而言也是不可见的. 考虑此,借用构造函数的技术也很少单独使用.

# **组合继承**
组合继承, 有时候也叫做`伪经典继承`,指的是将原型链和借用构造函数的技术组合到一块,从而发挥两者之长的一种继承模式.

> 基本思路: 使用原型链实现对原型属性和方法的继承,通过借用构造函数来实现对实例属性的继承.

这样,既通过在原型上定义方法实现了函数复用,又能保证每个实例都有它自己的属性. 如下所示.
```JavaScript
function Father(name){
    this.name = name;
    this.colors = ["red","blue","green"];
}
Father.prototype.sayName = function(){
    alert(this.name);
};
function Son(name,age){
    Father.call(this,name);//继承实例属性，第一次调用Father()
    this.age = age;
}
Son.prototype = new Father();//继承父类方法,第二次调用Father()
Son.prototype.sayAge = function(){
    alert(this.age);
}
let instance1 = new Son("louis",5);
instance1.colors.push("black");
console.log(instance1.colors);//"red,blue,green,black"
instance1.sayName();//louis
instance1.sayAge();//5

let instance1 = new Son("zhai",10);
console.log(instance1.colors);//"red,blue,green"
instance1.sayName();//zhai
instance1.sayAge();//10
```
组合继承避免了原型链和借用构造函数的缺陷,融合了它们的优点,成为 JavaScript 中最常用的继承模式. 而且, instanceof 和 isPrototypeOf( )也能用于识别基于组合继承创建的对象.

同时我们还注意到组合继承其实调用了两次父类构造函数, 造成了不必要的消耗, 那么怎样才能避免这种不必要的消耗呢, 这个我们将在后面讲到.
# **原型继承**
该方法最初由道格拉斯·克罗克福德于2006年在一篇题为 《Prototypal Inheritance in JavaScript》(JavaScript中的原型式继承) 的文章中提出. 他的想法是借助原型可以基于已有的对象创建新对象， 同时还不必因此创建自定义类型. 大意如下:

在object()函数内部, 先创建一个临时性的构造函数, 然后将传入的对象作为这个构造函数的原型,最后返回了这个临时类型的一个新实例. 
```JavaScript
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
```
从本质上讲, object() 对传入其中的对象执行了一次浅复制. 下面我们来看看为什么是浅复制.
```JavaScript
let person = {
    friends : ["Van","Louis","Nick"]
};
let anotherPerson = object(person);
anotherPerson.friends.push("Rob");
let yetAnotherPerson = object(person);
yetAnotherPerson.friends.push("Style");
alert(person.friends);//"Van,Louis,Nick,Rob,Style"
```
在这个例子中,可以作为另一个对象基础的是person对象,于是我们把它传入到object()函数中,然后该函数就会返回一个新对象. 这个新对象将person作为原型,因此它的原型中就包含引用类型值属性. 这意味着person.friends不仅属于person所有,而且也会被anotherPerson以及yetAnotherPerson共享.

在 ECMAScript5 中,通过新增 `object.create()`方法规范化了上面的原型式继承.

`object.create()`接收两个参数
- 一个用作新对原型的对象
- (可选的)一个为新对象定义额外属性的对象

```JavaScript
let person = {
    friends : ["van","Louis","Nick"]
};
let anotherPerson = Object.create(person);
anothierPerson.friends.push("Rob");
let yetAnotherPerson = Object.create(person);
yetAnotherPerson.friends.push("Style");
console.log(person.friends);//"van,Louis,Nike,Rob,Style"
```
object.create() 只有一个参数时功能与上述object方法相同, 它的第二个参数与Object.defineProperties()方法的第二个参数格式相同: 每个属性都是通过自己的描述符定义的.以这种方式指定的任何属性都会覆盖原型对象上的同名属性.例如:
```JavaScript
let person = {
    name : "Van"
};
let anotherPerson = Object.create(person, {
    name : {
        value : "Louis"
    }
});
alert(anotherPerson.name);//"Louis"
```
目前支持 Object.create() 的浏览器有 IE9+, Firefox 4+, Safari 5+, Opera 12+ 和 Chrome.

提醒: 这样做实际上是`浅拷贝`,如果想探究深拷贝和浅拷贝,[这份文章](http://jerryzou.com/posts/dive-into-deep-clone-in-javascript/)写的非常好,原型式继承中, 包含引用类型值的属性始终都会共享相应的值, 就像使用原型模式一样.

# **寄生式继承**
寄生式继承是与原型式继承紧密相关的一种思路， 同样是克罗克福德推而广之.

> 寄生式继承的思路与(寄生)构造函数和工厂模式类似,即创建一个仅用于封装继承过程的函数,该函数在内部以某种方式来增强对象,最后再像真的是它做了所有工作一样返回对象. 如下.
```JavaScript
function createAnother(original){
    let clone = object(original);//通过调用object函数创建一个新对象
    clone.sayHi = function(){//以某种方式来增强这个对象
        alert("hi");
    };
    return clone;//返回这个对象
}
```
这个例子中的代码基于person返回了一个新对象--anotherPerson. 新对象不仅具有 person 的所有属性和方法, 而且还被增强了, 拥有了sayH()方法. 

注意: 使用寄生式继承来为对象添加函数, 会由于不能做到函数复用而降低效率;这一点与构造函数模式类似.

# **寄生组合式继承**
前面讲过,组合继承是 JavaScript 最常用的继承模式; 不过, 它也有自己的不足. 组合继承最大的问题就是无论什么情况下,都会调用两次父类构造函数: 一次是在创建子类型原型的时候, 另一次是在子类型构造函数内部. **寄生组合式继承就是为了降低调用父类构造函数的开销而出现的** .

> 其背后的基本思路是: 不必为了指定子类型的原型而调用超类型的构造函数

```Javascript
function extend(subClass,superClass){
    let prototype = object(superClass.prototype);//创建对象
    prototype.constructor = subClass;//增强对象
    subClass.prototype = prototype;//指定对象
}
```
extend的高效率体现在它没有调用superClass构造函数,因此避免了在subClass.prototype上面创建不必要,多余的属性. 于此同时,原型链还能保持不变; 因此还能正常使用 instanceof 和 isPrototypeOf() 方法.
以上,寄生组合式继承,集寄生式继承和组合继承的优点于一身,是实现基于类型继承的最有效方法.

----------


下面我们来看下extend的另一种更为有效的扩展.
```javascript
function extend(subClass, superClass) {
  let F = function() {};
  F.prototype = superClass.prototype;
  subClass.prototype = new F(); 
  subClass.prototype.constructor = subClass;

  subClass.superclass = superClass.prototype;
  if(superClass.prototype.constructor == Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
}
```
我一直不太明白的是为什么要 "**new F()**", 既然extend的目的是将子类型的 prototype 指向超类型的 prototype,为什么不直接做如下操作呢?
> subClass.prototype = superClass.prototype;//直接指向超类型prototype

显然, 基于如上操作, 子类型原型将与超类型原型共用, 根本就没有继承关系.在回顾一下文章开头的话

# **new 运算符**
为了追本溯源, 我顺便研究了new运算符具体干了什么?发现其实很简单，就干了三件事情.
```
let obj  = {};
obj.__proto__ = F.prototype;
F.call(obj);
```
第一行，我们创建了一个空对象obj;
<br/>
第二行，我们将这个空对象的proto成员指向了F函数对象prototype成员对象;
<br/>
第三行，我们将F函数对象的this指针替换成obj，然后再调用F函数.
<br/>
我们可以这么理解: 以 new 操作符调用构造函数的时候，函数内部实际上发生以下变化：
  1. 创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。
  2. 属性和方法被加入到 this 引用的对象中。
  3. 新创建的对象由 this 所引用，并且最后隐式的返回 this.

# **\_\_proto__属性是指定原型的关键**
以上, 通过设置 \_\_proto__ 属性继承了父类, 如果去掉new 操作, 直接参考如下写法

> subClass.prototype = superClass.prototype;//直接指向超类型prototype

那么, 使用 instanceof 方法判断对象是否是构造器的实例时, 将会出现紊乱.
假如参考如上写法, 那么`extend`代码应该为
```
function extend(subClass, superClass) {
  subClass.prototype = superClass.prototype;

  subClass.superclass = superClass.prototype;
  if(superClass.prototype.constructor == Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
}
```
此时, 请看如下测试:
```
function a(){}
function b(){}
extend(b,a);
let c = new a(){};
console.log(c instanceof a);//true
console.log(c instanceof b);//truec
```
被认为是a的实例可以理解, 也是对的; 但c却被认为也是b的实例, 这就不对了. 究其原因, instanceof 操作符比较的应该是 c.\_\_proto__ 与 构造器.prototype(即 b.prototype 或 a.prototype) 这两者是否相等, 又extend(b,a); 则b.prototype === a.prototype, 故这才打印出上述不合理的输出.

---------------
那么最终,原型链继承可以这么实现,例如:
```
function Father(name){
    this.name = name;
    this.colors = ["red","blue","green"];
}
Father.prototype.sayName = function(){
    alert(this.name);
};
function Son(name,age){
    Father.call(this,name);//继承实例属性，第一次调用Father()
    this.age = age;
}
extend(Son,Father)//继承父类方法,此处并不会第二次调用Father()
Son.prototype.sayAge = function(){
    alert(this.age);
}
let instance1 = new Son("louis",5);
instance1.colors.push("black");
console.log(instance1.colors);//"red,blue,green,black"
instance1.sayName();//louis
instance1.sayAge();//5

let instance1 = new Son("zhai",10);
console.log(instance1.colors);//"red,blue,green"
instance1.sayName();//zhai
instance1.sayAge();//10
```
