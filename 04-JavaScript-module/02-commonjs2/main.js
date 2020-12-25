/* const bar = require('./bar')
//const {name, age, sayHello } = require('./bar')
//console.log(bar)
//console.log(name, age, sayHello)

const sayHello = bar.sayHello;

sayHello('Jack')
setTimeout(() => {
    console.log(bar.name)
}, 2000);

 */

 let test = require('./test')

 console.log(test)