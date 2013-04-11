//remove:
var tinydown = require('../build/tinydown.node.js');
//:remove

wru.test([
  {
    name: "main",
    test: function () {
      wru.assert(typeof tinydown == "function");
    }
  }
]);
