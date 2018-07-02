---
layout: jasmine
title: 单元测试
date: 2018-07-02 06:54:16
tags:
- web
- http
- js
- 测试
- 前端测试
- Jasmine
---
# **Suites and Specs**
____
`describe` 函数包含两个参数

 - `string` name 一个测试套件的名称
 - `function` fn 实现测试套件的代码块

`it` 函数定义两个参数

 - `string` name spec的标题
 - `function` fn spec的函数
`expect` 函数 接收一个 `value`, 返回一个链式匹配对象
拥有以下匹配规则函数

 - `toBe` // 引用全等
 - `toEqual` // 深度遍历，值全等
 - `toMatch` // 正则匹配， 支持字符串和正则表达式
 - `toContain` (字符串， 数组)
 - `toBeNull` // === null
 - `toBeTruthy` // Boolean(expect) === true
 - `toBeLessThan` // expect < value
 - `toBeDefined` // expect !== undefined
 - `toBeUndefined` // expect === undefined
 - `toBeFalsy` // Boolean(expect) === false
 - `toBeGreaterThan` // expect > value
 - `toBeCloseTo` // value - precision <= expect < value + precision
 - `toThrow` // expect throw 'xx'
 - `toThrowError` expect throw type or match error message

`fail` 函数, 直接指定spec的错误原因
```javascript
describe("A spec using the fail function", function() {
  var foo = function(x, callBack) {
    if (x) {
      callBack();
    }
  };

  it("should not call the callBack", function() {
    foo(false, function() {
      fail("Callback has been called");
    });
  });
});
```
**一个suite 可以有多个 `describe`, 一个 `describe` 可以有多个 `it`, 一个`it` 可以有多个 `expect`**

任何匹配表达式都可以有`not`前缀对象， 表示与期待的相反. 如
```javascript
describe('a suite', function () {
    it('should not equal false if expect is true', function () {
        expect(true).not.toBe(false);
    });
});
```

# **Setup and Teardown**
____
在一个`describe`中, 单元测试中的的 多个`it`， 有共同的需要初始化的情况。集中初始化和卸载

 - `beforeEach` (`describe` 执行后，`it` 执行前调用)
 - `afterEach` (每一个 `it` 执行后调用)
 - `beforeAll` (`describe` 执行后，`it` 执行前调用，只调用一次)
 - `afterAll` (所有 `it` 执行完成后调用)

# **this**
____
在 `beforeEach`, `it`, `afterEach`, 共享独立的空 `this` 对象

# **嵌套 `describe` 块**
___
`beforeEach`, `afterEach` 只针对同级 `describe` 函数作用域
```javascript
describe("A spec", function() {
  var foo;

  beforeEach(function() {
    foo = 0;
    foo += 1;
  });

  afterEach(function() {
    foo = 0;
  });

  it("is just a function, so it can contain any code", function() {
    expect(foo).toEqual(1);
  });

  it("can have more than one expectation", function() {
    expect(foo).toEqual(1);
    expect(true).toEqual(true);
  });

  describe("nested inside a second describe", function() {
    var bar;

    beforeEach(function() {
      bar = 1;
    });

    it("can reference both scopes as needed", function() {
      expect(foo).toEqual(bar);
    });
  });
});
```

# **Disabling Suites**
_____
使用 `xdescribe` 函数 可以跳过当前的测试套件

# **Pending Specs**
_____
使用 `xit` 表示 该行为测试待规范，跳过测试

# **Spies**
___
`spyOn` 函数具有监控对象的函数是否调用的功能, spy 化的对象函数, 允许有以下的匹配函数

 - `toHaveBeenCalled` // 匹配是否调用
 - `toHaveBeenCalledTimes` // 匹配调用次数
 - `toHaveBeenCalledWith` // 匹配被调用的函数参数是否与预订的一致

spy化后的函数，可以指定执行的返回值
```javascript
  var foo = {
    setBar: function(value) {
      bar = value;
    },
    getBar: function() {
      return bar;
    }
  };
  spyOn(foo, "getBar").and.returnValue(745);
  fetchedBar = foo.getBar(); // fetchBar is 745
```
spy化的函数

 - `and.returnValue` (返回值)
 - `and.throwError` (抛出异常)
 - `and.callThrough` (直接返回调用结果)
 - `and.returnValues` (返回一个数组)
 - `and.callFake` (通过回调篡改返回值)
 - `and.stub` (冻结spy化的函数执行)
 - `and.identity` (返回一个name)

spy其它跟踪属性

 - `calls.any()` (return true表示被调用过, return false 表示从未调用过)
 - `calls.count()` (返回调用的次数)
 - `calls.argsFor(index)` （数组的形式返回某一次调用的入参）
 - `calls.allArgs()` (二维数组的形式返回所有调用的入参)
 - `calls.all()` (返回一个或多个{object: xx, args: [], returnValue: xx}的对象，多个由数组表示)
 - `calls.mostRecent()` (返回最近的一个调用上下文对象)
 - `calls.first()` (返回第一次调用的上下文对象)
 - `calls.reset()` (清空跟踪数据)

## createSpy 与 createSpyObj
`spyOn` 是基于操作对象的函数调用进行`tracking`， 而`jasmine.createSpy`则是创建一个空的`tracking`函数， `jasmine.createSpyObj` 可以为创建一个对象，拥有多个`tracking`的函数

## 封装匹配 `value` 的函数
 - `jasmine.any` (匹配相同class)
 - `jasmine.anything` (匹配 非 null, undefined 的所有值)
 - `jasmine.objectContaining` (匹配对象局部的key, value)
 - `jasmine.arrayContaining` (匹配数组的某些项)
 - `jasmine.stringMatching` (匹配局部字符串)

## Custom asymmetric equality tester
自定义匹配规则, 传入一个对象, 对象中的 `asymmetricMatch` 是一个函数,其中入参表示姚培培的`value`

## Jasmine Clock
`jasmine.clock().install` 时间记录启动, `jasmine.clock().tick(millsecond)` 多少毫秒后，调用后续的`expect`

## Mocking the Date
Clock也可以用来当做时钟模拟当前日期
如果没有使用`mockDate`来指定基准时间,它将使用默认当前时间
```javascript
  describe("Mocking the Date object", function(){
    it("mocks the Date object and sets it to a given time", function() {
      var baseTime = new Date(2013, 9, 23);

      jasmine.clock().mockDate(baseTime);

      jasmine.clock().tick(50);
      expect(new Date().getTime()).toEqual(baseTime.getTime() + 50);
    });
  });
```
## 异步支持 Asynchronous Support
`beforeAll` `afterAll` `beforeEach` `afterEach` `it` 支持函数第一个参数 `done` 进行回调
```javascript
describe("A spec using done.fail", function() {
    var foo = function(x, callBack1, callBack2) {
      if (x) {
        setTimeout(callBack1, 0);
      } else {
        setTimeout(callBack2, 0);
      }
    };
    
    it("should not call the second callBack", function(done) {
      foo(true,
        done,
        function() {
          done.fail("Second callback has been called");
        }
      );
    });
  });
```
`done.fail` 返回错误的执行