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

/**
 * Just a tiny markdown like parser.
 * @example tinydown(node.textContent || textarea.value || genericString)
 * @param   {string} input the generic text to parse via markdown
 * @return  {string} the input as html
 */
function tinydown(input) {"use strict";
  /* jshint loopfunc: true */
  for(var
    // some common RegExp shortcut
    CODE_PRE = "</code></pre>",
    BLOCKQUOTE = "blockquote>",
    NL = "(?:\\r\\n|\\r|\\n|$)",
    LINK = "\\[(.*?)\\]\\((.+?)(?: (&(?:quot|apos);)(.+?)(\\3))?\\)",
    ANYTHING = "(.+?)" + NL,
    // temporary container for code blocks ... these won't be parsed
    L = [],
    // list of search, replacement for the given input
    re = [
      // make HTML safe
      "&(?!#?[a-z0-9]+;)", "&amp;",
      "<", "&lt;",
      ">", "&gt;",
      '"', "&quot;",
      "'", "&apos;",
      // drop code blocks from the input, no parsing required
      "^(?:\\t| {4})" + ANYTHING, function(m, s){return L.push(s + "\n") && "\0";},
      // parse H1 and H2
      "^" + ANYTHING + "=+" + NL, "<h1>$1</h1>\n",
      "^" + ANYTHING + "-+" + NL, "<h2>$1</h2>\n",
      // parse H1, H2, H3, H4, H5, H6 with other notation
      "^(#+)\\s*" + ANYTHING, function(m, c, s, t){
        return "<h" + (t = c.length) + ">" + s.replace(/#+$/, "") + "</h" + t + ">\n";
      },
      // parse HR lines
      "(?:\\* \\* |- - |\\*\\*|--)[-*][-* ]*" + NL, "<hr/>\n",
      // parse manual br
      "  +" + NL, "<br/>",
      // parse ordered and unordered lists
      "^ *(\\* |\\+ |- |\\d+. )" + ANYTHING, function(m, c, s, t){
        return "<" + (t = /^\d/.test(c) ? "ol>" : "ul>") + "<li>" + tinydown(s) + "</li></" + t;
      },
      // remove superflous parsing
      "</(ul|ol)>\\s*<\\1>", "",
      // parse strong and em
      "([_*]{1,2})([^\\2]+?)(\\1)", function(m, c, s, t){
        return "<" + (t = c.length == 2 ? "strong>" : "em>") + s + "</" + t;
      },
      // parse images
      "!" + LINK, '<img src="$2" alt="$1" title="$4"/>',
      // parse links
      LINK, '<a href="$2" title="$4">$1</a>',
      // parse blockquotes
      "^&gt; " + ANYTHING, function(m, s){
        return "<" + BLOCKQUOTE + tinydown(s)+ "</" + BLOCKQUOTE;
      },
      // remove superflous parsing
      "</" + BLOCKQUOTE + "\\s*<" + BLOCKQUOTE, "",
      // parse backtick for inline code
      "(`{1,2})([^\\r\\n]+?)\\1", "<code>$2</code>",
      // put back blocks of code
      "\\0", function(s){
        return "<pre><code>" + L.shift() + CODE_PRE;
      },
      // clean up superflous parsing
      CODE_PRE + "\\s*<pre><code>", ""
    ],
    i = 0; i < re.length;
  ) input = input.replace(new RegExp(re[i++], "gm"), re[i++]);
  return input;
}
module.exports = tinydown.tinydown = tinydown;
