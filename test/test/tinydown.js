//remove:
var tinydown = require('../build/tinydown.node.js');
//:remove

wru.test([
  {
    name: "input/output",
    test: function () {
      wru.assert(typeof tinydown == "function");
      for (var test = [
        //'ol', 'this\n * is\n * a\ntest', ''
        //*
        '-h2', 'hello\n---\n', '<h2>hello</h2>',
        '- hr', '- - -', '<hr/>',
        '* hr', '* * *', '<hr/>',
        'escape HTML', '<>"\'&', '<p>&lt;&gt;&quot;&apos;&amp;</p>',
        'do not double escape', '&lt;&gt;&quot;&apos;&amp;', '<p>&lt;&gt;&quot;&apos;&amp;</p>',
        'leave entities intact', '&#039;', '<p>&#039;</p>',
        'block code tick', '\n```\nalert(123);\n```\n', '<pre><code>alert(123);\n</code></pre>',
        'block code tick with language', '\n```javascript\nalert(123);\n```\n', '<pre><code class="javascript">alert(123);\n</code></pre>',
        'inline block code', '`hello there`', '<code>hello there</code>',
        'inline block code with tick', '``hello ` there``', '<code>hello ` there</code>',
        'just tick', '`````', '<code>`</code>',
        'block code spaces', '\n    alert(123);\n', '<pre><code>alert(123);\n</code></pre>',
        'block code tab', '\n\talert(123);\n\t\talert(456);\n', '<pre><code>alert(123);\n\talert(456);\n</code></pre>',
        'many blocks', '\n\ta\n.\n```\nb\n```', '<pre><code>a\n</code></pre>\n.<pre><code>b\n</code></pre>',
        '=h1', 'hello\n===\n', '<h1>hello</h1>',
        '# h1', '# hello\n', '<h1>hello</h1>',
        '# h2', '## hello\n', '<h2>hello</h2>',
        '# h3', '### hello\n', '<h3>hello</h3>',
        '# h4', '#### hello\n', '<h4>hello</h4>',
        '# h5', '##### hello\n', '<h5>hello</h5>',
        '# h6', '###### hello\n', '<h6>hello</h6>',
        'no h7', '####### hello\n', '<p>####### hello</p>',
        '-- hr', '---', '<hr/>',
        '** hr', '***', '<hr/>',
        'ol', ' 1. a\n    b\n 2. c\n', '<ol><li><p>a<br/>b</p></li><li><p>c</p></li></ol>',
        'strong', 'this **is** strong', '<p>this <strong>is</strong> strong</p>',
        'em', 'this _is_ em', '<p>this <em>is</em> em</p>',
        'em and strong', 'this *is* em __and strong__', '<p>this <em>is</em> em <strong>and strong</strong></p>',
        'image quoted', '![$alt]($src "$title")', '<img src="$src" alt="$alt" title="$title"/>',
        'image', '![$alt]($src $title)', '<img src="$src" alt="$alt" title="$title"/>',
        'link quoted', '[$text]($href "$title")', '<a href="$href" title="$title">$text</a>',
        'link', '[$text]($href $title)', '<a href="$href" title="$title">$text</a>',
        'blockquote', '> here a blockuote', '<blockquote><p>here a blockuote</p></blockquote>',
        // TODO: fix this .. maybe ... 
        'nested blockquote', '> here a blockuote\n> > with a block quote', '<blockquote><p>here a blockuote<blockquote><p>with a block quote</p></blockquote></p></blockquote>'
        //*/
      ], i = 0; i < test.length; i += 3) {
        wru.log(tinydown(test[i + 1]));
        wru.assert(test[i], tinydown(test[i + 1]) === test[i + 2]);
      }
    }
  }
]);
