var a = 10;
function outer() {
  var b = 20;
  var inner = function() {
    console.log(a);
    console.log(b);
  }
  return inner;
}

var innerFn = outer();

innerFn();
