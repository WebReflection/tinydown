tinydown
========
a lightweight markdown parser beyond the regular constrains

![build status](https://secure.travis-ci.org/WebReflection/tinydown.png)

What Does tinydown Support
--------------------------

Initially ideated to write markdown on blogger or other online platforms, this fully tested parser can do the following:


  * lists, like this one, both ordered and / or unordered with
    the possibility to go new line preserving the list item
      1. so that this becomes a nested item
      2. and this one too
  * _em_ and __strong__ via single or double * or _
  * paragraphs to keep the semantic right
  * blockquotes and nested block quotes
  * links and images
  * hr, br, h1, h2, h3, h4, h5, and h6
  * code blocks, `inline blocks`, and ``tick`box``
  * basically all you can do with markdown in a sort of simplified way ... **plus** 
  * **twitter** handlers, just `@handler` and a link to the profile will be created, ie @WebReflection
  * **youtube** embedded videos, i.e. `![noniframe cotent](http://www.youtube.com/watch?v=bRt5z880CFY)`
    ![alternative cotent](http://www.youtube.com/watch?v=bRt5z880CFY)
  * __gists__ from github, hacking the `document.write` like a boss so you can do that on the fly regardless
    `![just a gist](https://gist.github.com/WebReflection/5379375)` will produce
    ![just a gist](https://gist.github.com/WebReflection/5379375)


You can also try [the test page](http://webreflection.github.io/tinydown/test/test.html) able to show this own layout on the fly.

### Compatibility
Manually checked and tested over webOS, Android 2.X+, iOS 4+, IE 9+ Mobile, IE 9+ Desktop, Stock WebKit, Chrome and Mobile, Chropera, and all mobile are just OK.

IE8 has a RegExp bug I don't care much and it appears only if you use tab or spaces for code instead of triple back ticks.

If layout generation is a major concern, you need node.js or any other way to pre compile and serve the already parsed output.

- - -

enjoy

&copy; Mit Style WebReflection