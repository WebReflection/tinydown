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
    // constants
    PRE_CODE = "<pre><code",
    CODE_PRE = "</code></pre>",
    BLOCKQUOTE = "blockquote>",
    TRIPLETICK = "```",
    LIST = "",
    c0 = "\x00",
    c1 = "\x01",
    // some common RegExp shortcut
    re0 = /\x00/g,
    re1 = /\x01/g,
    N = "\n",
    LF = "\\r\\n|\\r|\\n",
    SL = "(?:^|" + LF + ")",
    NL = "(?:$|" + LF + ")",
    NOT_AFTER = "(?:" + LF + "(?!\\1)|$)",
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
    num = /^\d/,
    s = /  +/g,
    sl = new RegExp("(?:^" + LF + ")", GM),
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
      SL + "( *)(\\* |\\+ |- |\\d+. )" + ALL + "(?=" + LF + "(?!\\1  )|$)", G,
      SL + "(\\t| {4})" + ALL + NOT_AFTER, G,
      "(`{1,2})([^\\r\\n]+?)\\1", GM,
      "^(#{1,6})\\s+" + ANYTHING, GM,
      "  +" + NL, G,
      "([_*]{1,2})([^\\2]+?)(\\1)", G,
      "!?" + LINK, GM,
      SL + "(&gt; )" + ALL + NOT_AFTER, G
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
      "<hr/>" + N,
      function(m, $1, $2, $3, $4, $5) {
        tmp = "<li>" + tinydown($3.replace(s, "")).replace(sl, "<br/>" + N) + "</li>" + N;
        if ($4 === 0) {
          LIST = num.test($2) ? '<ol>' : '<ul>';
          tmp = LIST + N + tmp;
        } else if ($5.length - ($4 + m.length) < 2) {
          tmp += LIST.replace("<", "</");
        }
        return tmp;
      },
      null,
      "<code>$2</code>",
      function (m, c, s, t) {
        return "<h" + (t = c.length) + ">" + s.replace(header, "") + "</h" + t + ">";
      },
      "<br/>" + N,
      function (m, c, s, t) {
        return "<" + (t = c.length == 2 ? "strong>" : "em>") + s + "</" + t;
      },
      function (m, $1, $2, $3, $4) {
        return m.charAt(0) === '!' ?
          '<img src="' + $2 + '" alt="' + $1 + '" title="' + $4 + '"/>' :
          '<a href="' + $2 + '" title="' + $4 + '">' + $1 + '</a>'
        ;
      },
      function(m, $1, $2) {
        return "<" + BLOCKQUOTE + tinydown($2.replace(commonBlocks[$1], '')) + "</" + BLOCKQUOTE;
      }
    ],
    tmp,
    i = 0; i < find.length; re.push(new RegExp(find[i++], find[i++]))
  );
  function tinydown(string) {
    for (var
      zero = [],
      one = [],
      special = {
        "5": function (m, $1, $2) {
          return ($1.length ? zero.push(c0, $1, $2 + N) : zero.push($2 + N)) && c0;
        },
        "10": function (m, $1, $2) {
          return one.push($2.replace(commonBlocks[$1], '') + N) && c1;
        }
      },
      i = 0; i < re.length; i++
    ) {
      //console.log(re[i], string, place[i]);
      string = string.replace(re[i], place[i] || special[i]);
    }
    return string.
      replace(re0, function(s){
        s = zero.shift();
        return N + (
          s === c0 ?
            PRE_CODE + ' class="' + zero.shift() + '">' + zero.shift() :
            PRE_CODE + ">" + s
          ) + CODE_PRE + N;
        }).
        replace(re1, function(s){
          return N + PRE_CODE + ">" + one.shift() + CODE_PRE + N;
        })
      ;
  }
  return tinydown;
}();