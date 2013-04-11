!function (window) {
  function findPosts(document) {
    var tagName = 'div',
        className = 'post-body',
        querySelectorAll = 'querySelectorAll',
        getElementsByClassName = 'getElementsByClassName',
        getElementsByTagName = 'getElementsByTagName',
        div, list, i, length;
    if (document[querySelectorAll]) {
      list = document[querySelectorAll]([tagName, className].join('.'));
    } else if (document[getElementsByClassName]) {
      list = document[getElementsByClassName](className);
    } else {
      for(
        div = document[getElementsByTagName]('div'),
        list = [],
        i = 0,
        length = div.length;
        i < length; i++
      ) {
        if (~div[i].className.indexOf(className)) {
          list.push(div[i]);
        }
      }
    }
    for(
      i = 0,
      length = list.length;
      i < length; i++
    ) {
      list[i].innerHTML = tinydown(list[i].textContent || list[i].innerText);
    }
  }
  var done = false,
      add = window.addEventListener || window.attachEvent,
      parsePosts = function () {
        if (!done) {
          done = true;
          findPosts(window.document);
        }
      };
  add('DOMContentLoaded', parsePosts);
  add('onload', parsePosts);
  add('load', parsePosts);
}(this);