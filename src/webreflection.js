!function (window) {
  function findPosts() {
    var tagName = 'div',
        className = 'post-body',
        parentNode = 'parentNode',
        querySelectorAll = 'querySelectorAll',
        getElementsByClassName = 'getElementsByClassName',
        getElementsByTagName = 'getElementsByTagName',
        div, list, i, length, tmp, when;
    if (querySelectorAll in document) {
      list = document[querySelectorAll]([tagName, className].join('.'));
    } else if (getElementsByClassName in document) {
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
      if (
        re.test((findHeader(list[i][parentNode][parentNode][parentNode]) || {}).innerHTML) &&
        ignoreSince < (when = new Date(+RegExp.$3, months[RegExp.$1], +RegExp.$2)) &&
        when < ignoreAfter
      ) {
        timeout(function (node) {
          tmp = normalized(tinydown(trim.call(node.textContent || node.innerText)));
          //if (window.console) console.log(tmp);
          node.innerHTML = tmp;
          opacity(node);
        }, i * 300, list[i]);
      } else {
        timeout(opacity, i * 300, list[i]);
      }
      list[i].style.whiteSpace = 'normal';
    }
  }
  function opacity(node) {
    node.style.opacity = 1;
  }
  function findHeader(previousSibling) {
    while(previousSibling && previousSibling.nodeName !== "H2") {
      previousSibling = previousSibling.previousSibling;
    }
    return previousSibling;
  }
  var Date = window.Date,
      RegExp = window.RegExp,
      document = window.document,
      addEventListener = 'addEventListener',
      normalized = addEventListener in window ? function (text) {
        return text.replace(pre, '<pre class="code">$1</pre>');
      } : String,
      ignoreSince = new Date(2013, 3, 11).getTime(),
      ignoreAfter = new Date(2013, 3, 18).getTime(),
      trim = ''.trim || function () {
        return this.replace(trimRE);
      },
      trimRE = /^[\s\xA0]+|[\s\xA0]+$/g,
      pre = /<pre><code(?: class="[^"]+?")>([^\x00]+?)<\/code><\/pre>/g,
      br = /<br\/>/g,
      preplace = function (m, $1) {
        return '<pre class="code">' + trim.call($1.replace(br, '\n')) + '</pre>';
      },
      months = {
        'January':0,
        'February':1,
        'March':2,
        'April':3,
        'May':4,
        'June':5,
        'July':6,
        'August':7,
        'September':8,
        'October':9,
        'November':10,
        'December':11
      },
      re = '',
      done = false,
      add = window[addEventListener] || window.attachEvent,
      parsePosts = function () {
        if (!done) {
          done = true;
          findPosts();
        }
      },
      timeout = setTimeout,
      key;
  for (key in months) {
    re += "|" + key;
  }
  re = new RegExp("(" + re.slice(1) + ")\\s+(\\d+),\\s+(\\d+)");
  timeout(function(one){
    if (!one) timeout = function (callback, delay) {
      var args = [].slice.call(arguments, 2);
      return setTimeout(function () {
        callback.apply(this, args);
      }, delay);
    };
  },0,1);
  add('DOMContentLoaded', parsePosts);
  add('onload', parsePosts);
  add('load', parsePosts);
}(this);