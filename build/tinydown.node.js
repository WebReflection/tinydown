/*!
Copyright (C) 2013 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var tinydown = function(){
  /* jshint loopfunc: true */
  for(var
    lastList = 0,
    uniqueId = 0,
    WEB = typeof document !== 'undefined',
    documentElement = WEB && document.documentElement,
    WRITE = "write",
    // constants
    PRE_CODE = "<pre><code",
    CODE_PRE = "</code></pre>",
    BLOCKQUOTE = "blockquote>",
    TRIPLETICK = "```",
    LIST = "",
    c0 = "\x00",
    c1 = "\x01",
    c2 = "\x02",
    c3 = "<blockquote/>",
    c4 = "\x04",
    c5 = "\x05",
    // some common RegExp shortcut
    re0 = /\x00/g,
    re1 = /\x01/g,
    re2 = /\x02([^\x00]*?)\x02/g,
    re3 = /<blockquote\/>/g,
    re4 = /\x04/g,
    re5 = /\x05/g,
    loadedComplete = /^loaded|complete$/,
    // youtube, gist
    youtube = /^https?:\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?(\w+).*$/,
    gist = /https?:\/\/gist\.github\.com\/[^\x00]+?\/(\d+)(\.js)?$/,
    N = "\n",
    LF = "\\r\\n|\\r|\\n",
    SL = "(?:^|" + LF + ")",
    NL = "(?:$|" + LF + ")",
    NOT_AFTER = "(?=" + LF + "(?!\\1)|$)",
    ALL = "([^\\x00]*?)",
    LINK = "\\[(.*?)\\]\\((.+?)(?: (&(?:quot|apos);)?(.+?)(\\3))?\\)",
    ANYTHING = "(.+?)" + NL,
    // flags
    G = "g",
    GM = G + "m",
    // reused common blocks regexp
    commonBlocks = {
      "\t":   /^\t/gm,
      "    ": /^    /gm,
      "&gt; ":   /^&gt; /gm
    },
    header = /^#+$/,
    trim = /^\s+|\s+$/g,
    num = /^\d/,
    s = /  +/g,
    sl = new RegExp("(?:^" + LF + ")", GM),
    strim = ''.trim || function () {
      return this.replace(trim, '');
    },
    // find strings
    find = [
      "&(?!#?[a-z0-9]+;)", G,
      "<", G,
      ">", G,
      '"', G,
      "'", G,
      SL + TRIPLETICK + "([a-zA-Z]*)(?:" + LF + ")" + ALL + "(?:" + LF + ")" + TRIPLETICK + NL, G,
      "^" + ANYTHING + "=+" + NL, GM,
      "^" + ANYTHING + "-+" + NL, GM,
      "^(?:\\* \\* |- - |\\*\\*|--)[-*][-* ]*" + NL, GM,
      SL + "( {0,3})(\\* |\\+ |- |\\d+. )" + ALL + "(?=" + LF + "(?!\\1  )|$)", G,
      SL + "(\\t| {4})" + ALL + NOT_AFTER, G,
      "(`{1,2})([^\\r\\n]+?)\\1", GM,
      "^(#{1,6})\\s+" + ANYTHING, GM,
      "  +" + N, G,
      "([_*]{1,2})(?!\\s)([^\\2]+?)(\\1)", G,
      "!?" + LINK, GM,
      "(^|\\s)@([_a-zA-Z]+)(\\s|$)", GM,
      "(^|\\s)(#[^#&\\s]+)(\\s|$)", GM,
      SL + "(&gt; )" + ALL + NOT_AFTER, G,
      SL + "(?!<|\\x00|\\x01|\\x02|\\x03|\\x04)([^\\x00]*?)(?=" + NL + "{2,})", G
    ],
    // the list of RegExp objects
    re = [],
    // what to replace
    place = [
      "&amp;",
      "&lt;",
      "&gt;",
      "&quot;",
      "&apos;",
      null,
      "<h1>$1</h1>",
      "<h2>$1</h2>",
      "<hr/>",
      null,
      null,
      null,
      function (m, c, s, t) {
        return "<h" + (t = c.length) + ">" + s.replace(header, "") + "</h" + t + ">";
      },
      "<br/>",
      function (m, c, s, t) {
        return "<" + (t = c.length == 2 ? "strong>" : "em>") + s + "</" + t;
      },
      function (m, $1, $2, $3, $4) {
        if (m.charAt(0) === '!') {
          if (youtube.test($2)) {
            m = '<iframe width="560" height="315" src="' + $2.replace(
              youtube, 'http://www.youtube.com/embed/$1'
            ) + '" frameborder="0" allowfullscreen>' + $1 + '</iframe>';
          } else if(gist.test($2)) {
            if (WEB) {
              var
                id = 'tinydown' + uniqueId++,
                script = documentElement.insertBefore(
                  document.createElement("script"),
                  documentElement.lastChild
                );
              script.type = "text/javascript";
              script.id = id;
              script.onload = onload;
              script.onerror = onerror;
              script.onreadystatechange = onreadystatechange;
              script.src = $2.replace(RegExp.$1 + RegExp.$2, RegExp.$1 + ".js");
              m = '<br id="_' + id + '"/>';
              document[WRITE] = replaceContentAndWrite(document[WRITE], id, []);
            } else {
              m = '<script src="' + $2 + '"><!-- ' + $1 + ' --></script>';
            }
          } else {
            m = '<img src="' + $2 + '" alt="' + $1 + '" title="' + $4 + '"/>';
          }
        } else {
          m = '<a href="' + $2 + '" title="' + $4 + '">' + $1 + '</a>';
        }
        return m;
      },
      '$1<a href="https://twitter.com/$2">@$2</a>$3',
      function (m, $1, $2, $3) {
        return $1 + '<a href="https://twitter.com/search?src=hash&q=' + encodeURIComponent($2) + '">' + $2 + '</a>' + $3;
      },
      null,
      c2 + "$1" + c2
    ],
    tmp,
    i = 0; i < find.length; re.push(new RegExp(find[i++], find[i++]))
  );
  function onload() {
    this.loaded = true;
  }
  function onerror() {
    this.error = true;
  }
  function onreadystatechange() {
    if (loadedComplete.test(this.readyState)) {
      onload.call(this);
    }
  }
  function replaceContentAndWrite(write, id, out){
    var calls = 0, node, div;
    return function (content) {
      out.push(content);
      if (++calls === 2) {
        (function seekAndDestroy(){
          if (
            node || (node = document.getElementById(id)) && (
              node.loaded || node.error
          )) {
            node.parentNode.removeChild(node);
            node = document.getElementById("_" + id);
            if (node) {
              div = document.createElement('div');
              div.innerHTML = out.join(N);
              node.parentNode.replaceChild(div, node);
            }
          } else {
            setTimeout(seekAndDestroy, 1000);
          }
        }());
        document[WRITE] = write;
      }
    };
  }
  function paragraphs(m, $1) {
    $1 = strim.call($1);
    return $1.length ? ($1.charAt(0) === "<" ? $1 : "<p>" + $1 + "</p>") : "";
  }
  function tinydown(string) {
    for (var
      zero = [],
      one = [],
      bquote = [],
      four = [],
      list = [],
      special = {
        "5": function (m, $1, $2) {
          strim.call($2);
          return ($1.length ? zero.push(c0, $1, $2) : zero.push($2)) && c0;
        },
        "9": function(m, $1, $2, $3, $4, $5) {
          list.push(tinydown($3.replace(s, "")).replace(sl, "<br/>"));
          tmp = "<li>" + c5 + "</li>";
          if (LIST === "") {
            LIST = num.test($2) ? '<ol>' : '<ul>';
            tmp = LIST + tmp;
          }
          if (!re[9].test($5.slice($4 + m.length))) {
            tmp += LIST.replace("<", "</");
            LIST = "";
          }
          return tmp;
        },
        "10": function (m, $1, $2) {
          return one.push(strim.call($2.replace(commonBlocks[$1], ''))) && c1;
        },
        "11": function (m, $1, $2) {
          return four.push($2) && c4;
        },
        "18": function(m, $1, $2) {
          return bquote.push(strim.call($2.charAt(0) + $2.slice(1).replace(commonBlocks[$1], ''))) && c3;
        }
      },
      i = 0; i < re.length; i++
    ) {
      string = string.replace(re[i], place[i] || special[i]);
    }
    return string.
      replace(re0, function(s){
        s = zero.shift();
        return (
          s === c0 ?
            PRE_CODE + ' class="' + zero.shift() + '">' + zero.shift() :
            PRE_CODE + ">" + s
        ) + CODE_PRE;
      }).
      replace(re1, function(s){
        return PRE_CODE + ">" + one.shift() + CODE_PRE;
      }).
      replace(re2, paragraphs).
      replace(re3, function () {
        return "<" + BLOCKQUOTE + tinydown(bquote.shift()) + "</" + BLOCKQUOTE;
      }).
      replace(re4, function () {
        return "<code>" + four.shift() + "</code>";
      }).
      replace(re5, function () {
        return list.shift();
      })
    ;
  }
  return tinydown;
}();
module.exports = tinydown.tinydown = tinydown;
