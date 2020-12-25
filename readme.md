## V8引擎的原理

- V8引擎本身的源码非常复杂，大概有超过100w行C++代码，
- Parse模块会将JavaScript代码转换成AST(抽象语法树)， 
    - 如果函数没有被调用，那么是不会被转成AST的;
    - Parse的V8官方文档：  https://v8.dev/blog/scanner 和 https://v8.dev/blog/preparser

- Ignition是一个解释器，会将AST转换成ByteCode(字节码)
    - 同时会收集TurboFan优化所需要的信息(比如函数参数的类型信息，有了类型才能进行真实的运算);
    - 如果函数只调用一次，Ignition会执行解释执行ByteCode
    Ignition官方文档 :  https://v8.dev/blog/ignition-interpreter 和 https://v8.dev/blog/launching-ignition-and-turbofan
                        

- TurboFan是一个编译器，可以将字节码编译为CPU可以直接执行的机器码;
    - 如果一个函数被多次调用，那么就会被标记为热点函数，那么就会经过TurboFan转换成优化的机器码，提高代码的执行性能
    - 但是，机器码实际上也会被还原成ByteCode, 这是因为如果后续执行函数的过程中，类型发生了变化(比如sum函数原来执行的是number类型，后来执行变成了string类型)，之前优化的机器码并不能正确的处理运算，就会逆向的转换成字节码。
    TurboFan官方文档： https://v8.dev/blog/turbofan-jit

- 上面是javaScript代码的执行过程，事实上V8的内存回收也是其强大的另外一个原因
    - Orinoco模块，负责垃圾回收，将程序中不需要的内存回收
    - Orinoco官方文档： https://v8.dev/blog/trash-talk

libuv (Unicorn Velociraptor  独角伶盗龙)

```
C:\Users\michaelhee>nvm list available

|   CURRENT    |     LTS      |  OLD STABLE  | OLD UNSTABLE |
|--------------|--------------|--------------|--------------|
|    15.5.0    |   14.15.3    |   0.12.18    |   0.11.16    |
|    15.4.0    |   14.15.2    |   0.12.17    |   0.11.15    |
|    15.3.0    |   14.15.1    |   0.12.16    |   0.11.14    |
|    15.2.1    |   14.15.0    |   0.12.15    |   0.11.13    |
|    15.2.0    |   12.20.0    |   0.12.14    |   0.11.12    |
|    15.1.0    |   12.19.1    |   0.12.13    |   0.11.11    |
|    15.0.1    |   12.19.0    |   0.12.12    |   0.11.10    |
|    15.0.0    |   12.18.4    |   0.12.11    |    0.11.9    |
|   14.14.0    |   12.18.3    |   0.12.10    |    0.11.8    |
|   14.13.1    |   12.18.2    |    0.12.9    |    0.11.7    |
|   14.13.0    |   12.18.1    |    0.12.8    |    0.11.6    |
|   14.12.0    |   12.18.0    |    0.12.7    |    0.11.5    |
|   14.11.0    |   12.17.0    |    0.12.6    |    0.11.4    |
|   14.10.1    |   12.16.3    |    0.12.5    |    0.11.3    |
|   14.10.0    |   12.16.2    |    0.12.4    |    0.11.2    |
|    14.9.0    |   12.16.1    |    0.12.3    |    0.11.1    |
|    14.8.0    |   12.16.0    |    0.12.2    |    0.11.0    |
|    14.7.0    |   12.15.0    |    0.12.1    |    0.9.12    |
|    14.6.0    |   12.14.1    |    0.12.0    |    0.9.11    |
|    14.5.0    |   12.14.0    |   0.10.48    |    0.9.10    |

This is a partial list. For a complete list, visit https://nodejs.org/download/release

C:\Users\michaelhee>nvm ls

    15.3.0
  * 14.15.0 (Currently using 64-bit executable)
    12.16.2

C:\Users\michaelhee>nvm uninstall 15.3.0
Uninstalling node v15.3.0... done
C:\Users\michaelhee>nvm install 15.5.0
```

```
$ nvm -h //查看nvm的指令
$ nvm list //查看本地已经安装的node版本列表
$ nvm list available //查看可以安装的node版本
$ nvm install latest //安装最新版本的node
$ nvm install [version][arch] //安装指定版本的node 例如：nvm install 10.16.3 安装node v10.16.3 arch表示电脑的位数 如果电脑需要安装32位的， 则运行：nvm install 10.16.3 32
$ nvm use [version] //使用node 例如：nvm use 10.16.3
$ nvm uninstall [version] //卸载node
```

```
global.  按两次tab
```

- 浅拷贝就是引用赋值

## module.exports

- CommonJS中

## 情况一: X是一个核心模块，比如path、http
    - 直接返回核心模块，并且停止查找

## 情况二: X是以./或../或/(根目录) 开头的
    第一步： 将X作为一个文件在对应的目录下查找;
    - 1. 如果有后缀名，按照后缀名的格式查找对应的文件
    - 2. 如果没有后缀名，会按照如下顺序:
        1> 直接查找文件X
        2> 查找X.js文件
        3> 查找X.json文件
        4> 查找X.node文件
    第二步：没有找到对应的文件，将X作为工业目录
        查找目录下面的index文件
            1>  查找X/index.js文件
            2>  查找X/index.json文件
            3>  查找X/index.node文件

    如果没有找到，那么报错： not found

## 情况三： 直接是一个X (没有路径) ,并且X不是一个核心模块
    - node_modules 中递归查找
    /Users/michaelhee/Desktop/Node/TestCode/04_learn_node/05_javascript_module/02_commonjs/main.js中编写
    require('michael')
    - 查找路径依次为：
    paths: [
        '/Users/michaelhee/Desktop/Node/TestCode/04_learn_node/05_javascript_module/02_commonjs/node_modules',
        '/Users/michaelhee/Desktop/Node/TestCode/04_learn_node/05_javascript_module/node_modules',
        '/Users/michaelhee/Desktop/Node/TestCode/04_learn_node/node_modules',
        '/Users/michaelhee/Desktop/Node/TestCode/node_modules',
        '/Users/michaelhee/Desktop/node_modules',
        '/Users/michaelhee/node_modules',
        '/Users/node_modules',
        'node_modules',
    ]
    - 如果上面的路径中都没有找到，那么报错 not found
```
console.log(module)
```

```
Module {
  id: '.',
  path: 'e:\\code\\node\\04-JavaScript-module\\02',
  exports: {},
  filename: 'e:\\code\\node\\04-JavaScript-module\\02\\test.js',
  loaded: false,
  children: [],
  paths: [
    'e:\\code\\node\\04-JavaScript-module\\02\\node_modules',
    'e:\\code\\node\\04-JavaScript-module\\node_modules',
    'e:\\code\\node\\node_modules',
    'e:\\code\\node_modules',
    'e:\\node_modules'
  ]
}
```

## 模块的加载过程

- 结论一： 