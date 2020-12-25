const name = "Michael he";
const age = 18;

let message = ", my name is Michael";

function sayHello(name) {
  console.log("Hello " + name + message);
}

setTimeout(() => {
    module.exports.name = 'lilei';
}, 1000);
exports.name = name;
exports.age = age;

exports.sayHello = sayHello;
