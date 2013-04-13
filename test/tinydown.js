//remove:
var tinydown = require('../build/tinydown.node.js');
//:remove

wru.test([
  {
    name: "input/output",
    test: function () {
      wru.assert(typeof tinydown == "function");
      for (var test = [
        '-h2', 'hello\n---\n', '<h2>hello</h2>\n',
        '- hr', '- - -', '<hr/>\n',
        '* hr', '* * *', '<hr/>\n',
        'escape HTML', '<>"\'&', '&lt;&gt;&quot;&apos;&amp;',
        'do not double escape', '&lt;&gt;&quot;&apos;&amp;', '&lt;&gt;&quot;&apos;&amp;',
        'leave entities intact', '&#039;', '&#039;',
        'block code tick', '\n```\nalert(123);\n```\n', '\n<pre><code>alert(123);\n</code></pre>\n',
        'block code tick with language', '\n```javascript\nalert(123);\n```\n', '\n<pre><code class="javascript">alert(123);\n</code></pre>\n',
        'inline block code', '`hello there`', '<code>hello there</code>',
        'inline block code with tick', '``hello ` there``', '<code>hello ` there</code>',
        'just tick', '`````', '<code>`</code>',
        'block code spaces', '\n    alert(123);\n', '\n<pre><code>alert(123);\n</code></pre>\n',
        'block code tab', '\n\talert(123);\n\t\talert(456);\n', '\n<pre><code>alert(123);\n\talert(456);\n</code></pre>\n',
        'many blocks', '\n\ta\n.\n```\nb\n```', '\n<pre><code>a\n</code></pre>\n.\n<pre><code>b\n</code></pre>\n',
        '=h1', 'hello\n===\n', '<h1>hello</h1>\n',
        '# h1', '# hello\n', '<h1>hello</h1>\n',
        '# h2', '## hello\n', '<h2>hello</h2>\n',
        '# h3', '### hello\n', '<h3>hello</h3>\n',
        '# h4', '#### hello\n', '<h4>hello</h4>\n',
        '# h5', '##### hello\n', '<h5>hello</h5>\n',
        '# h6', '###### hello\n', '<h6>hello</h6>\n',
        'no h7', '####### hello\n', '####### hello\n',
        '-- hr', '---', '<hr/>\n',
        '** hr', '***', '<hr/>\n',
        'ol', ' 1. a\n    b\n 2. c\n', '<ol>\n<li>a<br/>\nb</li>\n<li>c</li>\n</ol>\n',
        'strong', 'this **is** strong', 'this <strong>is</strong> strong',
        'em', 'this _is_ em', 'this <em>is</em> em',
        'em and strong', 'this *is* em __and strong__', 'this <em>is</em> em <strong>and strong</strong>',
        'image quoted', '![$alt]($src "$title")', '<img src="$src" alt="$alt" title="$title"/>',
        'image', '![$alt]($src $title)', '<img src="$src" alt="$alt" title="$title"/>',
        'link quoted', '[$text]($href "$title")', '<a href="$href" title="$title">$text</a>',
        'link', '[$text]($href $title)', '<a href="$href" title="$title">$text</a>',
        'blockquote', '> here a blockuote', '<blockquote>here a blockuote</blockquote>',
        'nested blockquote', '> here a blockuote\n> > with a block quote', '<blockquote>here a blockuote<blockquote>with a block quote</blockquote></blockquote>'
        //*/
      ], i = 0; i < test.length; i += 3) {
        //wru.log(tinydown(test[i + 1]));
        wru.assert(test[i], tinydown(test[i + 1]) === test[i + 2]);
      }
    }
  }
]);
