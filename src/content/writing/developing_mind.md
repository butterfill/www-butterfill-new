---
title: The Developing Mind
authors: Unknown
year: 2020
isForthcoming: false
bibtex: |
    @book{butterfill:2020_developing,
      address = {London},
      author = {Butterfill, Stephen A.},
      year = {2020},
      publisher = {Routledge},
      title = {The {Developing} {Mind}: A {Philosophical} {Introduction}},
    }
---


<html>
  <head>
    <style type="text/css">
    #page-container { /* PDF container */
      position:absolute; /* required for calculating relative positions of pages in pdf2htmlEX.js */
      top:0;
      left:0px;
      margin:0; 
      padding:0;
      border:0; /* required for lazy page loading in pdf2htmlEX.js (page visibility test) */
    }
    @media screen {
      #page-container {
        /* `bottom' and `right' are required for lazy page loading in pdf2htmlEX.js (page visibility test)
        * alternatively you may set width and height
        */
        bottom:0;
        right:0;
        overflow:auto;
      }
    }
    @media print { 
      @page { margin:0; }
      html { margin:0; }
      body { 
        margin:0; 
        -webkit-print-color-adjust:exact; /* enable printing background images for WebKit */
      }
      #sidebar { display:none; }
      #page-container {
        width:auto;
        height:auto;
        overflow:visible;
        background-color:transparent;
      }
      .d { display:none; }
    }
    /* Part 2: Page Elements: Modify with caution
    * The followings are base classes, some of which are meant to be override by PDF specific classes
    * So do not increase the specificity (e.g. ".classname" -> "#page-container .classname")
    */
    .pf { /* page */
      position:relative;
      background-color:white;
      overflow: hidden;
      margin:0; 
      border:0; /* required by pdf2htmlEX.js for page visibility test */
    }
    .pc { /* content of a page */
      position:absolute;
      border:0;
      padding:0;
      margin:0;
      top:0;
      left:0;
      width:100%;
      height:100%;
      overflow:hidden;
      display:block;
      /* set transform-origin for scaling */
      transform-origin:0% 0%;
      -ms-transform-origin:0% 0%;
      -webkit-transform-origin:0% 0%;
    }
    .pc.opened { /* used by pdf2htmlEX.js, to show/hide pages */
      display:block;
    }
    .bf { /* images that occupies the whole page */
      position:absolute;
      border:0;
      margin:0;
      top:0;
      bottom:0;
      width:100%;
      height:100%;
      -ms-user-select:none;
      -moz-user-select:none;
      -webkit-user-select:none;
      user-select:none;
    }
    .bi { /* images that cover only a part of the page */
      position:absolute;
      border:0;
      margin:0;
      -ms-user-select:none;
      -moz-user-select:none;
      -webkit-user-select:none;
      user-select:none;
    }
    @media print {
      .pf {
        margin:0;
        box-shadow:none;
        page-break-after:always;
        page-break-inside:avoid;
      }
      @-moz-document url-prefix() {
        /* fix page truncation for FireFox */
        .pf {
          overflow:visible;
          border:1px solid #FFFFFF;
        }
        .pc {overflow:visible;}
      }
    }
    .c { /* clip box */
      position:absolute;
      border:0;
      padding:0;
      margin:0;
      overflow:hidden;
      display:block;
    }
    .t { /* text line */
      position:absolute;
      white-space:pre;
      font-size:1px;
      transform-origin:0% 100%;
      -ms-transform-origin:0% 100%;
      -webkit-transform-origin:0% 100%;
      unicode-bidi:bidi-override;/* For rtl languages, e.g. Hebrew, we don't want the default Unicode behaviour */
      -moz-font-feature-settings:"liga" 0;/* We don't want Firefox to recognize ligatures */
    }
    .t:after { /* webkit #35443 */
      content: '';
    }
    .t:before { /* Workaround Blink(up to 41)/Webkit bug of word-spacing with leading spaces (chromium #404444 and pdf2htmlEX #412) */
      content: '';
      display: inline-block;
    }
    .t span { /* text blocks within a line */
      /* Blink(up to 41)/Webkit have bug with negative word-spacing and inline-block (pdf2htmlEX #416), so keep normal span inline. */
      position:relative;
      unicode-bidi:bidi-override; /* For rtl languages, e.g. Hebrew, we don't want the default Unicode behaviour */
    }
    ._ { /* text shift */
      /* Blink(up to 41)/Webkit have bug with inline element, continuous spaces and word-spacing. Workaround by inline-block. */
      display: inline-block;
      color: transparent;
      z-index: -1;
    }
    /* selection background should not be opaque, for fallback mode */
    ::selection{
      background: rgba(127,255,255,0.4);
    }
    ::-moz-selection{
      background: rgba(127,255,255,0.4);
    }
    .pi { /* info for Javascript */
      display:none;
    }
    .l { /* annotation links */
    }
    /* transparent color - WebKit */
    .d { /* css drawing */
      position:absolute;
      transform-origin:0% 100%;
      -ms-transform-origin:0% 100%;
      -webkit-transform-origin:0% 100%;
    }
    /* for the forms */
    .it {
      border: none;
      background-color: rgba(255, 255, 255, 0.0);
    }
    
    .ir:hover {
      cursor: pointer;
    }
    
    /* Base CSS END */
    </style>
    <style type="text/css">
    /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab filetype=css: */
    /*! 
    * Fancy styles for pdf2htmlEX
    * Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> 
    * https://github.com/coolwanglu/pdf2htmlEX/blob/master/share/LICENSE
    */
    @keyframes fadein { from { opacity:0;} to { opacity:1;} }
    @-webkit-keyframes fadein { from { opacity:0;} to { opacity:1;} }
    @keyframes swing {
      0%  { transform: rotate(0deg); }
      10% { transform: rotate(0deg); }
      90% { transform: rotate(720deg); }
      100%{ transform: rotate(720deg); }
    }
    @-webkit-keyframes swing {
      0%  { -webkit-transform: rotate(0deg); }
      10% { -webkit-transform: rotate(0deg); }
      90% { -webkit-transform: rotate(720deg); }
      100%{ -webkit-transform: rotate(720deg); }
    }
    @media screen { 
      #sidebar {
        background-color:#2f3236;
        /* modified from http://philbit.com/svgpatterns/#crossstripes */
        background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjNDAzYzNmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiMxZTI5MmQiPjwvcGF0aD4KPC9zdmc+");
      }
      #outline {
        font-family:Georgia,Times,"Times New Roman",serif;
        font-size:13px;
        margin:2em 1em;
      }
      #outline ul {
        padding:0;
      }
      #outline li {
        list-style-type:none;
        margin:1em 0;
      }
      #outline li > ul {
        margin-left: 1em;
      }
      #outline a,
      #outline a:visited,
      #outline a:hover,
      #outline a:active {
        line-height:1.2;
        color:#e8e8e8;
        text-overflow:ellipsis;
        white-space:nowrap;
        text-decoration:none;
        display:block;
        overflow:hidden;
        outline:0;
      }
      #outline a:hover {
        color:rgb(0,204,255);
      }
      .pf {
        margin: 13px auto;
        box-shadow: 1px 1px 3px 1px #333;
        /* Needed by IE to make box-shadow works * https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow */
        border-collapse: separate;
      }
      .pc.opened { /* used by pdf2htmlEX.js, to show/hide pages */
        -webkit-animation: fadein 100ms;
        animation: fadein 100ms; 
      }
      .loading-indicator.active {
        /* 
        * use 0.01s instead of 0s,
        * since YUI Compressor will change 0s to 0,
        * which is not recognized by Firefox
        */
        -webkit-animation: swing 1.5s ease-in-out 0.01s infinite alternate none;
        animation: swing 1.5s ease-in-out 0.01s infinite alternate none;
      }
      .checked {
        background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3goQDSYgDiGofgAAAslJREFUOMvtlM9LFGEYx7/vvOPM6ywuuyPFihWFBUsdNnA6KLIh+QPx4KWExULdHQ/9A9EfUodYmATDYg/iRewQzklFWxcEBcGgEplDkDtI6sw4PzrIbrOuedBb9MALD7zv+3m+z4/3Bf7bZS2bzQIAcrmcMDExcTeXy10DAFVVAQDksgFUVZ1ljD3yfd+0LOuFpmnvVVW9GHhkZAQcxwkNDQ2FSCQyRMgJxnVdy7KstKZpn7nwha6urqqfTqfPBAJAuVymlNLXoigOhfd5nmeiKL5TVTV+lmIKwAOA7u5u6Lped2BsbOwjY6yf4zgQQkAIAcedaPR9H67r3uYBQFEUFItFtLe332lpaVkUBOHK3t5eRtf1DwAwODiIubk5DA8PM8bYW1EU+wEgCIJqsCAIQAiB7/u253k2BQDDMJBKpa4mEon5eDx+UxAESJL0uK2t7XosFlvSdf0QAEmlUnlRFJ9Waho2Qghc1/U9z3uWz+eX+Wr+lL6SZfleEAQIggA8z6OpqSknimIvYyybSCReMsZ6TislhCAIAti2Dc/zejVNWwCAavN8339j27YbTg0AGGM3WltbP4WhlRWq6Q/btrs1TVsYHx+vNgqKoqBUKn2NRqPFxsbGJzzP05puUlpt0ukyOI6z7zjOwNTU1OLo6CgmJyf/gA3DgKIoWF1d/cIY24/FYgOU0pp0z/Ityzo8Pj5OTk9PbwHA+vp6zWghDC+VSiuRSOQgGo32UErJ38CO42wdHR09LBQK3zKZDDY2NupmFmF4R0cHVlZWlmRZ/iVJUn9FeWWcCCE4ODjYtG27Z2Zm5juAOmgdGAB2d3cBADs7O8uSJN2SZfl+WKlpmpumaT6Yn58vn/fs6XmbhmHMNjc3tzDGFI7jYJrm5vb29sDa2trPC/9aiqJUy5pOp4f6+vqeJ5PJBAB0dnZe/t8NBajx/z37Df5OGX8d13xzAAAAAElFTkSuQmCC);
      }
    }
    /* Fancy CSS END */
    </style>
    <style type="text/css">
    .ff0{font-family:sans-serif;visibility:hidden;}
    @font-face{font-family:ff1;src:url('data:application/font-woff;base64,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')format("woff");}.ff1{font-family:ff1;line-height:1.058000;font-style:normal;font-weight:normal;visibility:visible;}
    @font-face{font-family:ff2;src:url('data:application/font-woff;base64,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')format("woff");}.ff2{font-family:ff2;line-height:0.938000;font-style:normal;font-weight:normal;visibility:visible;}
    @font-face{font-family:ff3;src:url('data:application/font-woff;base64,d09GRgABAAAAAB1sAA0AAAAALhAABQABAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABMAAAABoAAAAcmZPZREdERUYAAAFMAAAAHQAAACAAbAAET1MvMgAAAWwAAABHAAAAVlb2ITxjbWFwAAABtAAAAOEAAAG6WEefuGdhc3AAAAKYAAAACAAAAAj//wADZ2x5ZgAAAqAAABXcAAAiqJRrEBloZWFkAAAYfAAAADYAAAA2IGSXcmhoZWEAABi0AAAAIAAAACQGzAOIaG10eAAAGNQAAADaAAAA/IOABU5sb2NhAAAZsAAAAIAAAACA8zb8HG1heHAAABowAAAAHgAAACAAhgBjbmFtZQAAGlAAAAKQAAAFjtPnCH9wb3N0AAAc4AAAAIkAAACsWEocL3icY2BgYGQAgjsJ82RB9L2ZcyfDaABI5gdHAAB4nGNgZGBg4ANiCQYQYGJgBEI7IGYB8xgABvQAcQAAAHicY2BknMe0h4GVgYGpC0gzMPRAaMYHDIaMTEBRBg5mBjBoAAo6QJgKICIgzTUFyFL4/5dpz38hoMo9DO+AwowgOQAzBQ2eAHicY2BgYGaAYBkGRgYQ2ALkMYL5LAwzgLQSgwKQxQQkdRmsGOwZHBlcGNwZfBkCGEIYwhgiGKoUJH8z/v/7/z9QLUiNAViNM4MbgyeDP0MQWE0iTM3/x/+v/7/6/+L/C//P/z/3/+z/M/9P/z/1/+T/gw+UWW2A+iBuIAAY2RjgChmZgAQTugKIl+CAhYGBlY2dg5OLm4eXjx8kIsAgyCAkzCAiyiAmLiEpxSAtwyArJw/0gCJMj5KyiqqauoamlraOrp6+gaGRsYmpmbmFpZU1MU4kD9jAGLYElQIA2NEz0AAAAAAAAAH//wACeJyVWQmUW1d51n2rdunt0tPT9iQ9LaORNNqeRqPZ7fF4PLbH9nhsZ7zEju0k4MQhzYaTNMZJSBySQExp0jSAWRpKUiikFEJIfaBAAoetJOVwCjTQNi2cAzntSUOa9mBN//s00ix2OK2Pj0bvzZ13v3/7/u+/z0bb4B96g3jeRthom93msvlsNoETyDhpKhwrxEkuzpWfehDNPxV56ltPtf9iDhYfaBO2pfbf25b6l1D7JdvSxVuI5y9usCGbYfsxGkMGPMWWSui1an0IlSWRQdwLqajvW8nYjyVvXnIXYEvCFll6E71KHLF5bRFAoHNihKqUuWoBkboBf1kpRwhJ9BKI2oMoFx8WF9SEeu1tZ45mZzZk+6ZmiUb7l5H0hkIpgNLz78pfvPDMmXNPRsbvmN/9no06PNC2f6mNXoHnJwGLGCEUWWSNBGtUzRGyxlWNhM4a6RFkwkYSI6GTPl1T7fZPkp+221VN99ld/UMiEX4sERU4+6lIiqMRFaQJglIpRHOpCBpMCEGf5m75fdxgDe+Xho/vwn5V8B+Gr8gAn/Ehhq2U62ZZYdg47DeKRlCtmobtGUnES5iEbpRvPLI42EfTgjPJ1bxDWfqMXvArsodv/yFFmHt2p0Q1HI2XGTqhqHH0gnmsnpnkw0rYr3MlTz1VzVecJxoxecOuHYnJphlPDIhur49RIpYfCuDnlwFXA3DpXsR6EY6MOUJUyrA9y7ARBD/w3XTH74oMgGtV7CC8DuC+JWsxmlajhibpW0r7p3JSZHiqkry+NjsS1yQjFMsak3eKmh1N7SIadFQLaal4SFDkyXy5GPBROxrbhvMDUS7i01K5sdn77A6Rpfy7BzdZeSBDnF4HfKStBHAZtpMyfQCqEzS9gJbDNgwYi6hAYPBmhUN07e5nX/EJznl3WIXYxSYM/gmInhp2f15lfYSdYn337NavQL+d/pnfIWe6QUSoF8UMy1MuhnLJ33l3tn3SKgVbFfz1HeKYrQ/yBqcJw6aFCKqUTYWFWKUZtm45Dn8voBWHoclCKlFoeTL83oB+vyIsBvbXKF91Ys/Vtx/eb/KyGiwHw2qu9Pz0NrdsRznk8HgWGFq5znNk64H7NUfUI2jp/h02yyd5wPCP4BMXVJRNgEyxIgJgTAYixdbNCIlrI6Fz1TpEyJSfRteG04PZ2Gu3TiRKdG2guSvDBUoLjZ/W680z17hR3JX80dzW0o42Uw8fqmsMStZLcmJ6IotsW99fLOdJn2V7a+kN9HPiuC2wnCvpulmtgPFxxUv5UJo3nxVDMWeCJygiJqLtTKrVDI0wx5kPH0OvOzIGedtWEnkc2977vomPck430v8OoqqDLb8AW9y2lK2CKx3MiSIwp0AoIsN2awA8aXYdKpOWuUXkBTMRldea5TTljT05XmzsPnXiyC2bt0j13PGjBxZfzI1EBuqBiJMgRvPwXQ3MC1qMO1KY8sbLx8ZP7Jg151IurZkfW5hpMwNjuYYa5rKQXzd3/NwP2F6x/Iyr10p6QAfhZC23MmyBqlVxpXCi5XgDHeo4Ovob7GjGLBU25zTHak+blqeLO8HT2uF6mEHBZH+KS26ayC5hVw/kKV9n7xZ8fh89Y3PYBIsxrKTSDa73rZVv5Xr/0TvDuUxYy2Xav13+gp+hAv5HiHO2vK0OzxB7rjQ7OeolWC8RRtbNYVTFbGdlEUP2NrnLEVHEVK14xe6jQkZTBVl2S4KHjsfNTCZeYDqbE01nxMsrMTWXT89vVAt9iuCRK3GP6PXzvnBqMjKwsTgavfjrHjKMjVhqE68ANsa2EXxbSSdYRgYfRugOE+tWTROmUDaFiL2ycq88wkDkcd0h7rGd7F7StUgihvbZRbuLomaGxBmgonDc/Q+pzd8nGRftowRSQfCb1mH4DSO4gLspEhGNC7yHQqHXfsEy32U9DoYmCYSg8C0OJ+yRCJTZxW/YvU6WIUmLEjrsjhBJMnYn+wnWadVEaulN4n1gR9hmo2K9DFVkhYGLbr6YcIdItl/aOzj2g8enzzo5WpaU/Qf3njy1cNchu0Q5R3PnZj76bB5dW3azW/d88tZbPnuNl7X8FAA/fZa4z+a3lW02Ez9shIDiIBO6JOirOlaBSMNXTDUd/mGZdtaMDg8m2VD/rsGRA+Ip8XGWDQaCDgd8sOyNGX6f9vm/yaeuvLUUVetXjVfnrhhKb7n4GkHQweUm9ojFiXBJoAsf3HJbbB7sdQIegThrG8Voun1TX2mcGIUSB4uljgv6oKLDCPe4OjQ5aGqMbt19HbMyy87tnJnrwIo2aPpxlFUVirL7Bb5WvYIL7KimCEqHvkrrFJEu7+h0WjqwutN+oBUm8B2KjN5qJ5v1iPDDQIamm1otQdOJMI5RHGJ0AWKEG3FZrnRjwzK4iWBotQ5uHCkZNzsoCsVqeTieZh29b/ohzu3gVem6xQNgxsBiy+gP6HmKuqI5CLBlyVd6bP4j+8rmO64mziXe3ecgpxdnNp6rXbWvzgc+pHEkreH00WhCCt7s9WaLs7kzGz9x6ABgg/iivRDfLK7yXhAtGKTEXeLhGzvRm5uZnlsdzbnprhsJVy9oBO5m2Eftkyt+6wYXXLH03NJG9A7YOwcXHKaDZabF4krpZBq3zjMoyCdCICW0qZzfK9ndJK9xvIvURynq6ET5CEWVwoSzfaCyvR7hm5momHS6RErxDGyZRl9eDpT1gfe38ZBLP4H95y9jexhBxpj11fcIUEuQQILcdYleAyow0tIlXjqx3kv5nbPRbbsoarbYX6Yobaw/dZ078tNokaK2ZUYzNBl/NJL4v3jyr32bR2Nz9q4ZVDIZP+zinYn2xSRjUQSj5b6Ztn/jsv62ajkH9vaDdsAFAaLP6EOXlvAIqnTjX0EHNk9zQd7pXwz/fH0Bp8ZjnTuJ3OQw5dgzd/naRb08uH67xVnM0lvkDYADekyKTJBYq+Af8monIlOod4pZqAid2CsgdNYsIR5ViX9iPF7mm2B7oEBRrbraoqhsmM7QYo2mv/dX9IVv0/SAQkYouULTE32bD9J0mb8Jffziv3s86LX22WKG6lIrBcF8wpRJ7Lb2BvQ8djCp5tqLI8Ee/RIy5kTMuV+EenZhJYKWORb3LsrPrnQ4dGh68eTuLfMnELmw+Cf3/u2Og48+SFzz8CNnz//xH37wYw+1f3bwqs+9/8HDN3R0HY7NNuJh3CmRJc4tOWfUumqXuUwxdkNWTqIrbjC3Tjbv8UqiFB4u32nI67Opcy0igXg4Xli8xiyRnjC5cfu5ZK19/aXZshI+1uoBbxIvADaHbQzQYTAWo5IWTtBIIMEiCOMF+YsSl5bDKpwv3plN9G3ZdQDgbq/dr2RjJCL9C5uGb3YlGm8HOYFePpcuv9hEPkC+YY/0UiLKKLR932cF18d+P3Twawg0yA8gVtC9kCwB8ZKdpggdctnJRsKo1bEN2NFpjHRZoaA/c3FxOxcpRNKF6fRiX3XD8BXbj/GC7vftqxaai65tI1J8fGiPeR1x6+Kw1xHJFQOlnLFJLBYHR+eGTHHsmIOZmCukxkft+YLWt3m6VlIxJhJi/V7iITxRpMS1WY8JD7csVrfErQzjRqeVJTqtTEIfsrhu4yRw3aguqQPVYa/qEWnq2D0P3QtSxO3S3GNNWRVvB7rrpW24he4aGCg26YUWabeTk7N0o1DGchd00BvEc1CLMPWiTiWuI0JFUKAUC2gNExI7fwTRcfzEHg0FsLY5PkNRMkSLusPvf4CVIwGanhnSoRbVSJyIXvyNAvJDCrA9/kWU3edu/2l/Gh3lJWaFlu3RDj8sEd8CTLvAP9ACYQhk1jhpFNUNnGprOkMURdB6xkbA2DL+xZo/R8/sd3rYzZnABpqey1UApVERPulGvg9o6RhNtQ5NzlFUxsNvdbgcxZo8AauSuRZNpwrifR7C/7jar8OqnbOwKs3u+zBHO4/O5umuDaQYfMnvl76TDq6YpWqn/YzdPLhm1ef8UvBVQ11ZpXVnq7fQ86D4IWNTy+NwfRRZRwJMR0JbLVJiLWWHU0NPQ0g6Qg+lmdBm8c6FA5OZVAbaQVKt3D7yNOH2B3gfOTS9wVeNJxgtovQPICl1bb0ZlvY0FWec4rVyYeQzHzDCXiffeJVzRVVF1ZOAh1z6T/Q74jnQlzCDmFY7Bi+XJaCA5VOEztgJ+SpwgMBS8DNiyU7fMeYntyb399cfXjhY9fIeiTkTzh0opjN3oS9WRMrL05InNf71RmVk7zUfymg+dhBl279MvLBpelnXoifBDyCgUqum/85YYMmnZWWLngwfzB8zR87sn90TLSUJMhTcNtPKDXv25Mzq0NET900YgVhIDOeeXNjb6Gh/zN9JsMmLFVkKZg+jI8Yw1yoJvJvRG55rKxYDA0OxsthWA12J1IFiKFhOO4d5R3A7ny5FEolHDqcSXdODGYbavUNGxCE792ayL7tvfl8owWUFJbRYuuqDrjPYBaLlgvZIX5QSPC6Z43r40AWw3QkzqU2oLE9FUAQAoucJfP7UB8OTBfvz9xPpoDPu4n/nm3nX8cbYg7trMyl/+D/QRGsHUL5Qr/J+9UfRE+Xm0evORuvNRJRwUtObOhoIfQ18YVrqfh0XJXSYy4awJ8y1vsf6qFIGmdqH/i1coumFRnOepkvhcmgLYcTrezZNRKsGyzjddh/vcRwTEwunh+MrdBQfQoQz5BHHdyebJTUajwVljpWSY30Vp2L5gLS5lni0hH4NPUfB+gx1Zl8IEHh/eajBZz8wg1inVWy3Y+JCsAagTmJag7vR+dER0xBT0DfYGKRPRkJTgcgfhH2u0dKCHghOcirFeOwpZmRgYFdZQQ66f8vH1fJXTl5bSg9GNI+nGkrkNpSmRuTglmgohWK3FMw7+95ixMFMS/TUwg30CdntltjK1Ei+z0XyXjbn5/TBbdfGQ9PeDbxDEFXvqCJsMjb3xdxyKuYfsHV16JFODNb3g2FsOCtdpkusqUOJ8HfCYEAY4oEtsWFFh8tkJyrdlLy5dO+aMCSGPrXF+N6QviowrdW1+fL0eVtnjm+jKvRQzZa5NEsA4UqFkN0ahRL6VaBEUQuV2jyI8oCSY6jzvELdl4qHk5loOHGqFSJ7ykttfTUXgBKQWK5RRkIwlQ3KGTyoE0ufXgrYfgN7p/HpjLDabOvMozcwUMvngkZtNYbj3X2zmfhETWsmvXa/y8N4Ee+WYPrrgkHNle1fvvv2mKalImKGol14ZX9If2eIsPdAdeK1H+K1dS0jSlzZmhmM9UMDdCCmc4TApvHpKmTs+oge7cZIGnTFoyLfB121OAkTXqIhBsqM4ybG7WVFCroFPdOaI/z+qntQUiG4Y50Qr+HU9jMCiJGIuOJgTQiZrOdph9dJU6hzm1B5PTkr7BxMkCvht3XzETXAPm29fW8HejUFrEXSaK0ue3i2vNQm7wBum/99mQTiDNcpjiPE+XIV8Xb3pVd5HbIuupJ1mINJ8s7MvuDpyvjw6irZkBihAnFYnTRgdTwwlTRPDWmrs/IrVloAMSuRqc2bt+18Yn31RD25J4YSa+/pPlvHTuJKsPMyvLrezv+XKRR5a/He1VZMaVNvhzqS2Hn+EshFotcDCavHWDNMb4Shu6dzljRG1K4hM14eab9mjt12/ekNoyeO34/OfWbj6U07jt/09avGZk4fva41eBs8j1+SiSg8L4t7qrDKwApm2y4dX0Jkptw9O2alQ71wEUx4o7in3Dp7Y1wPYFuBRSC3AmeikdZgPVHoQ7WujbKmZsutwyfv525eyyh/Gb92846FNAfYkoCtBNiSWHHTlzg7sdJUrdYAmc5yRvfsrI7+ZTUEeoc6XZt79Fij5C84FepMOF0anig4c9ev3f0Bw2ieOvJAyqsApfwPSicPzx7d5evkBToPWGAGF9Z7Y01iVFYO8i158up6Oh29WiJogpqsqhldiXt9Ht4bQO5za3F8JRekeA+rcgORK5NiNOsXOM2q8RJojHcDjhzk56rpB3WnHwUPS933QL1uWpJ531hCTlXUDXJUr+4aND0e1WhIofpsJnpifOOU8xxN1sdDsqm4i4F4Lq9XA4WWgzoQ4E0lDletjXLR2l+C/ReIbZYfKtZRq/Wqy9eVFfi02OJQqav+TKxG6qMa9FWVyQp2kkA32wPHUFBI87x/LjOgR8hxmkfPHPdSrIPgHYVJnYl6Gl8UEjHwjqxr6vBdjzFh3zLHvUmMoy/0em5H1qUZS/KsMDjYjcsTvhrr70uo3dN4xMnG6bAB8SlISSehJ0t5pGZpelsdX97blXdCcPh8jy6cASpX/lQpFHKKX27FqJV7tuUzkjcIN+DDc+vqdsIuD2n2S4YfPBWhBYqqF2MwZwR1n/usM6zZ7ybsJEs77B6fE3rKQHWGpnMMN0pS1HbOj871uEEJau0XFQm1KJnx0y6SIXvH0WQs+QxL0l8yIh1szqU3SBtga8IFpE4d77wGjgWyaB0JpEkjbazDKpuCbMronyegmxFNP5cGYH0ygDaS/tsdatR+5UGHFrSf4p2+FMY8CNNln8M/yNCH1IgbbfkUTVHMR1LpXqKTuWz7B4r03/+F8RddXnoV8qe8HgS5kgfcbuBkA3Bvh5z3ojWnFNgG6/RiHdJ1pjFWN19btUVksF+CGdZrt8PYONWXoemp8H47vS+YitJ0ZuEo3Ii5PP0MU/e5Q7Cklc9Q1FByH8XsNcZhxcErYYXmcpVIdrPDy7JEj7Adxo0O5q5ktGeOOzTrcmyVhd4Kpu8E7by74eqVvDuwSNut/AkQGbB1o82mMOwKw2FGw295YconL5mgZaleM+sFcm0w4c9fF7KKHvC54yFGdIiyK4AIB+0l3yOq0D8zm4YgQDk7dwChq1maFrxuUCkxqQxJ3efecyj457ro5H1BLkwpqmln/CxPo0wxsBK+aOSH0IzQL51+B0OsvAVJBZ791xGwhVu6iJ5GF6wz6ggxhPABZRm/G1YsY/DL6xR+aVw30xgsPjmpDzO85P2ap5RBbv6hA+hKIyN6I06X1D6vOE7fSBw3VUX0IhrmLEh05I386jYykg0zW4ZJt939mQsESRxkHPMmQeF35+iPbD8EPYTfhC2/3GANa/wAwqzWT2ULMbnS9NljY0lfME88N9oKjstlh0u0b5eDdiqZ7O/UDdYEN8Fz5t521qrjYavz2l/BL75xD8YsjN+TVbq69zJNI/FrNYvZp4m7Q7gRKgbcakSrHtsxKGtJTTWcUsmpRqWfjvgVqtPN+qCbZWQxcffpVnyVAMSDGcdwntpcWqtE3RlfLGGEmr7EbDVPMdDKXlzdXkJDX82oVMc2cqlNHQXbDl12hjHeZoixjrTWy8pLzsAICPjKqEPxq+VPQTfynVmnBNdZVSweV8Vog6KODvWOyCrDvu4R2ftjm+ZoP3lD7oH1k1A6qf149SikD6EvhD2VSvueSw7SyqXOQZoYJUDjfnvk/P8CFxt3XwABAAAABRmZYBuqwl8PPPUACwPoAAAAAN6ZnZMAAAAA3pmdk/+p/xIEZAK8AAEACAACAAAAAAAAeJxjYGRgYNrzX4iBgaXg/8r/x1hSGIAiKMAeAJfaBlp4nB2PvWpCQRCFz5yVCxobL3i5KAiKP42RCClSaKFgaWuVVgmk0MYHEAsRfJEQ8QHEKlhYhDxAEElhY28hguiJy37L7s43uzN2xH1Y+3/R7KFIIiNeRUlURCCeRVnURE48Sq/ZAinuQX6hwB1CZhHjFlnrI7Thdck/+GwgdGN4/JXTk/Ot2AlpzuC4Uu4PPDvr7QycbeRUUbCDmCg3ige+w7cmUvZy/WBX+xZ8N1VNb6IkX2fWkbc5AvvEk3pIsqO7BDwXVT1VxFnRH2skcFFPIwSRAdwNcSgjNQAAAAAAJgAmACYAJgA8AGwApADwAUABiAHKAgYCMAJ+ArwC3gMsA5ADwAQIBGIEsATuBS4FpgXqBkoGdAbCByAHagewB/oIeAjACPwJKgl6CbAJ/ApyCsILAAtKC7oL6AxcDKwM1A0iDWgNrA3sDiwOfA7KDyYPnBACEEIQZhDUEVR4nGNgZGBgsGdIYGBlAAEmIGZkAIk5gPkMABKxAOoAAHicjVNNa9tAEB1HSmh9CJRCTzkMPZQEbMVWrMTRsQEnB0MMMem1sr2KBcrKSGvs0N/QY+mlx577S/qj+nYkfxCHthI7eszHezO7KyI6pF9UI3lqR3thhWv0xvlS4T1yne8VdqjtUoVdeud+rvA+HbrfKnxAb93fyKy5r1HclSqLa/Te+VThPXrlfK2wQyPnR4Vdarh+hffpyF1U+IA+uD+pTwlpmtOSWPCIFOVkxKvgG9ET7ICm8KRYM7xMN+SJN4MvpQbV6RZ+hRqmHrwaDAxWTRPhYxrK95EK4Ixi2Liqzmghag9SmyPP6t5JlkEsEl/Z3Vg0CtiCQqheo4c+YsdASjrOkZ9Kb3P0nkrN89oTeKymwVRlH7bfJiJLyZrJ/JlME8kMjPl6ldJLkz7n99DblfQdIa6EYaO4qrPfHHMr4Z3CY8Ad0ineVVfxOscDdwxrpzTQqGOPyl6ZfGrhPcNJrHBnCwdb+HwLX2zh7ha+XOM21ga3gUvkE/UTPV9yPxmp3CRa8eiJB9MkTWYzvvF4kKVpo347U5p7mTY81xOV81DljwVnMccIZ4tEP3AvV4rvstgsolyBbqx0oYqwfj3o8/G10iqPUh7MR2kyXkVPeJGYKTi0aarlWM1MkmmO9IRveyjaiK7yvfpVriKjJmWhjfWy/EHx8dSYWXh6aqli6/GK2NPKnNTvwMp+q3XWsLYjNhB7LvZCbFfspbXtlth2A8buzj9+q+HuBsL1UX6JCUCWwr50T3zcgBa+YUX8dxFeU5YVAW65XfYUfXuKm73wvRaHvNMU21YQCJpB02/5/zXaRnV3SC5Hu5eiYv2bBRirjdUBpnuVF/ZIA6/tdXhbcVdv+ExrLTUUoT9pAw9peJxtwzlOAgEAAMDZ3YKWREAObYxBNKgEosZQ2KwLcgmeIBI7km3o/AQf4nlCqJ1khPb+1mr+87AbCEWyDuTkFRwqKimrOHLsxKmqM+cu1F26cq2hqeXGrTv32mKPEh1dT3r6BoZGno1NvHj15t2HT1MzX+a+LWyCMIii5U+a+V2lSZLEW1aGEt0AAAA=')format("woff");}.ff3{font-family:ff3;line-height:0.938000;font-style:normal;font-weight:normal;visibility:visible;}
    @font-face{font-family:ff4;src:url('data:application/font-woff;base64,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')format("woff");}.ff4{font-family:ff4;line-height:1.058000;font-style:normal;font-weight:normal;visibility:visible;}
    .m0{transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);-ms-transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);-webkit-transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);}
    .m1{transform:none;-ms-transform:none;-webkit-transform:none;}
    .v0{vertical-align:0.000000px;}
    .v1{vertical-align:17.352000px;}
    .ls2{letter-spacing:0.000000px;}
    .ls0{letter-spacing:23.910400px;}
    .ls3{letter-spacing:26.166484px;}
    .ls1{letter-spacing:47.151309px;}
    .sc_{text-shadow:none;}
    .sc0{text-shadow:-0.015em 0 transparent,0 0.015em transparent,0.015em 0 transparent,0 -0.015em  transparent;}
    @media screen and (-webkit-min-device-pixel-ratio:0){
    .sc_{-webkit-text-stroke:0px transparent;}
    .sc0{-webkit-text-stroke:0.015em transparent;text-shadow:none;}
    }
    .wse{word-spacing:-15.111373px;}
    .wsb{word-spacing:-7.460045px;}
    .wsc{word-spacing:-5.834061px;}
    .wsf{word-spacing:-5.260288px;}
    .wsa{word-spacing:-4.734061px;}
    .ws6{word-spacing:-4.208230px;}
    .ws7{word-spacing:0.000000px;}
    .ws2{word-spacing:7.125299px;}
    .ws5{word-spacing:11.907379px;}
    .ws4{word-spacing:14.288815px;}
    .ws8{word-spacing:16.402339px;}
    .ws9{word-spacing:17.502403px;}
    .wsd{word-spacing:22.523597px;}
    .ws3{word-spacing:23.862579px;}
    .ws1{word-spacing:47.103488px;}
    .ws10{word-spacing:1088.933965px;}
    .ws11{word-spacing:1211.683430px;}
    .ws0{word-spacing:1270.837760px;}
    ._2{margin-left:-26.253619px;}
    ._1{margin-left:-23.910400px;}
    ._3{margin-left:-12.337766px;}
    ._b{margin-left:-11.285709px;}
    ._19{margin-left:-9.994547px;}
    ._29{margin-left:-6.647091px;}
    ._1f{margin-left:-4.208230px;}
    ._a{margin-left:-2.630144px;}
    ._d{margin-left:-1.099878px;}
    ._11{width:1.090311px;}
    ._4{width:4.016947px;}
    ._23{width:5.164646px;}
    ._3c{width:10.520576px;}
    ._7{width:11.955200px;}
    ._40{width:13.437645px;}
    ._1b{width:14.537523px;}
    ._34{width:15.924326px;}
    ._17{width:17.024205px;}
    ._26{width:18.554470px;}
    ._37{width:20.276019px;}
    ._2c{width:21.375898px;}
    ._33{width:22.858342px;}
    ._22{width:23.910400px;}
    ._15{width:25.201562px;}
    ._24{width:28.453376px;}
    ._27{width:29.983642px;}
    ._8{width:31.753011px;}
    ._e{width:32.900710px;}
    ._1d{width:35.148288px;}
    ._28{width:36.152525px;}
    ._3a{width:37.539328px;}
    ._2b{width:38.543565px;}
    ._16{width:39.691069px;}
    ._1a{width:41.412739px;}
    ._2f{width:42.417126px;}
    ._35{width:43.421680px;}
    ._20{width:45.907968px;}
    ._13{width:47.151309px;}
    ._6{width:54.993920px;}
    ._10{width:57.384800px;}
    ._5{width:62.597360px;}
    ._c{width:63.697360px;}
    ._1e{width:64.988272px;}
    ._f{width:86.507760px;}
    ._9{width:87.607760px;}
    ._25{width:206.872781px;}
    ._14{width:680.633446px;}
    ._36{width:752.221184px;}
    ._30{width:765.283693px;}
    ._31{width:799.542418px;}
    ._39{width:804.202394px;}
    ._2a{width:855.801037px;}
    ._3e{width:875.551027px;}
    ._2d{width:893.388186px;}
    ._1c{width:896.926925px;}
    ._12{width:912.877398px;}
    ._3b{width:947.186586px;}
    ._38{width:965.884518px;}
    ._18{width:992.616346px;}
    ._21{width:996.250726px;}
    ._3d{width:1064.634470px;}
    ._3f{width:1081.419571px;}
    ._2e{width:1093.709517px;}
    ._0{width:1102.460723px;}
    ._32{width:1184.282112px;}
    .fc0{color:rgb(0,0,0);}
    .fs4{font-size:31.880400px;}
    .fs3{font-size:39.850400px;}
    .fs1{font-size:47.820800px;}
    .fs2{font-size:57.384800px;}
    .fs0{font-size:99.148400px;}
    .y1c{bottom:104.882000px;}
    .y1b{bottom:133.228000px;}
    .y42{bottom:133.229000px;}
    .y1a{bottom:148.033000px;}
    .y87{bottom:148.038000px;}
    .y41{bottom:148.106000px;}
    .y63{bottom:148.901000px;}
    .y19{bottom:162.838000px;}
    .y86{bottom:162.847000px;}
    .y40{bottom:162.983000px;}
    .y62{bottom:164.573000px;}
    .y18{bottom:177.643000px;}
    .y85{bottom:177.656000px;}
    .y3f{bottom:177.860000px;}
    .y61{bottom:180.245000px;}
    .y17{bottom:192.448000px;}
    .y84{bottom:192.465000px;}
    .y3e{bottom:192.737000px;}
    .y60{bottom:195.918000px;}
    .y16{bottom:207.252000px;}
    .y83{bottom:207.274000px;}
    .y3d{bottom:207.614000px;}
    .y5f{bottom:211.590000px;}
    .y15{bottom:222.057000px;}
    .y82{bottom:222.083000px;}
    .y3c{bottom:222.491000px;}
    .y5e{bottom:227.262000px;}
    .y81{bottom:236.892000px;}
    .y5d{bottom:242.935000px;}
    .y14{bottom:249.057000px;}
    .y3b{bottom:249.611000px;}
    .y5c{bottom:258.607000px;}
    .y13{bottom:263.861000px;}
    .y80{bottom:263.898000px;}
    .y3a{bottom:264.488000px;}
    .y12{bottom:278.666000px;}
    .y39{bottom:279.365000px;}
    .y5b{bottom:287.052000px;}
    .y11{bottom:293.471000px;}
    .y38{bottom:294.242000px;}
    .y5a{bottom:302.724000px;}
    .y7f{bottom:305.848000px;}
    .y10{bottom:308.276000px;}
    .y37{bottom:309.119000px;}
    .y59{bottom:318.397000px;}
    .y7e{bottom:320.657000px;}
    .yf{bottom:323.081000px;}
    .y58{bottom:334.069000px;}
    .y7d{bottom:335.466000px;}
    .y36{bottom:336.239000px;}
    .y57{bottom:349.741000px;}
    .ye{bottom:350.080000px;}
    .y7c{bottom:350.275000px;}
    .y35{bottom:351.116000px;}
    .yd{bottom:364.885000px;}
    .y7b{bottom:365.084000px;}
    .y56{bottom:365.414000px;}
    .y34{bottom:365.994000px;}
    .yc{bottom:379.690000px;}
    .y7a{bottom:379.893000px;}
    .y33{bottom:380.871000px;}
    .y55{bottom:381.086000px;}
    .yb{bottom:394.494000px;}
    .y32{bottom:395.748000px;}
    .y79{bottom:406.900000px;}
    .ya{bottom:409.299000px;}
    .y54{bottom:409.531000px;}
    .y31{bottom:410.625000px;}
    .y78{bottom:421.709000px;}
    .y53{bottom:425.203000px;}
    .y30{bottom:425.502000px;}
    .y9{bottom:436.298000px;}
    .y77{bottom:436.518000px;}
    .y2f{bottom:440.379000px;}
    .y52{bottom:440.876000px;}
    .y76{bottom:451.327000px;}
    .y2e{bottom:455.256000px;}
    .y51{bottom:456.548000px;}
    .y75{bottom:466.136000px;}
    .y50{bottom:472.220000px;}
    .y8{bottom:478.242000px;}
    .y74{bottom:480.945000px;}
    .y2d{bottom:482.376000px;}
    .y4f{bottom:487.893000px;}
    .y7{bottom:493.047000px;}
    .y73{bottom:495.754000px;}
    .y2c{bottom:497.253000px;}
    .y4e{bottom:503.565000px;}
    .y6{bottom:507.851000px;}
    .y72{bottom:510.563000px;}
    .y2b{bottom:512.130000px;}
    .y4d{bottom:519.237000px;}
    .y5{bottom:522.656000px;}
    .y71{bottom:525.372000px;}
    .y2a{bottom:527.007000px;}
    .y4{bottom:537.461000px;}
    .y70{bottom:540.181000px;}
    .y29{bottom:541.884000px;}
    .y4c{bottom:547.682000px;}
    .y3{bottom:552.266000px;}
    .y28{bottom:556.762000px;}
    .y4b{bottom:563.355000px;}
    .y2{bottom:567.071000px;}
    .y6f{bottom:567.187000px;}
    .y27{bottom:571.639000px;}
    .y4a{bottom:579.027000px;}
    .y6e{bottom:581.996000px;}
    .y26{bottom:586.516000px;}
    .y1{bottom:594.070000px;}
    .y49{bottom:594.699000px;}
    .y6d{bottom:596.805000px;}
    .y25{bottom:601.393000px;}
    .y48{bottom:610.372000px;}
    .y6c{bottom:611.614000px;}
    .y24{bottom:616.270000px;}
    .y47{bottom:626.044000px;}
    .y6b{bottom:626.423000px;}
    .y6a{bottom:641.232000px;}
    .y46{bottom:641.716000px;}
    .y23{bottom:643.390000px;}
    .y69{bottom:656.041000px;}
    .y45{bottom:657.389000px;}
    .y22{bottom:658.267000px;}
    .y0{bottom:664.895000px;}
    .y68{bottom:670.850000px;}
    .y44{bottom:673.061000px;}
    .y21{bottom:673.144000px;}
    .y67{bottom:685.659000px;}
    .y20{bottom:688.021000px;}
    .y66{bottom:700.468000px;}
    .y43{bottom:701.506000px;}
    .y1f{bottom:702.898000px;}
    .y89{bottom:704.048000px;}
    .y65{bottom:715.277000px;}
    .y1e{bottom:717.775000px;}
    .y64{bottom:730.086000px;}
    .y88{bottom:730.449000px;}
    .y1d{bottom:744.895000px;}
    .h5{height:32.677328px;}
    .h2{height:33.474560px;}
    .h3{height:39.213056px;}
    .h4{height:40.169360px;}
    .h6{height:43.493928px;}
    .h1{height:81.301688px;}
    .h0{height:841.890000px;}
    .w0{width:595.276000px;}
    .x0{left:113.386000px;}
    .x1{left:131.319000px;}
    .x5{left:290.988000px;}
    .x4{left:292.338000px;}
    .x3{left:293.688000px;}
    .x2{left:295.038000px;}
    </style>
    <script>
    /*
    Copyright 2012 Mozilla Foundation 
    Copyright 2013 Lu Wang <coolwanglu@gmail.com>
    Apachine License Version 2.0 
    */
    (function(){function b(a,b,e,f){var c=(a.className||"").split(/\s+/g);""===c[0]&&c.shift();var d=c.indexOf(b);0>d&&e&&c.push(b);0<=d&&f&&c.splice(d,1);a.className=c.join(" ");return 0<=d}if(!("classList"in document.createElement("div"))){var e={add:function(a){b(this.element,a,!0,!1)},contains:function(a){return b(this.element,a,!1,!1)},remove:function(a){b(this.element,a,!1,!0)},toggle:function(a){b(this.element,a,!0,!0)}};Object.defineProperty(HTMLElement.prototype,"classList",{get:function(){if(this._classList)return this._classList;
    var a=Object.create(e,{element:{value:this,writable:!1,enumerable:!0}});Object.defineProperty(this,"_classList",{value:a,writable:!1,enumerable:!1});return a},enumerable:!0})}})();
    </script>
    <script>
    /* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab filetype=javascript : */
    /** 
    * @license pdf2htmlEX.js: Core UI functions for pdf2htmlEX 
    * Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> and other contributors 
    * https://github.com/coolwanglu/pdf2htmlEX/blob/master/share/LICENSE 
    */
    
    /*
    * Attention:
    * This files is to be optimized by closure-compiler, 
    * so pay attention to the forms of property names:
    *
    * string/bracket form is safe, won't be optimized:
    * var obj={ 'a':'b' }; obj['a'] = 'b';
    * name/dot form will be optimized, the name is likely to be modified:
    * var obj={ a:'b' }; obj.a = 'b';
    *
    * Either form can be used for internal objects, 
    * but must be consistent for each one respectively.
    *
    * string/bracket form must be used for external objects
    * e.g. DEFAULT_CONFIG, object stored in page-data
    * property names are part of the `protocol` in these cases.
    *
    */
    
    'use strict';
    
    var pdf2htmlEX = window['pdf2htmlEX'] = window['pdf2htmlEX'] || {};
    
    /** 
    * @const 
    * @struct
    */
    var CSS_CLASS_NAMES = {
      page_frame       : 'pf',
      page_content_box : 'pc',
      page_data        : 'pi',
      background_image : 'bi',
      link             : 'l',
      input_radio      : 'ir',
      __dummy__        : 'no comma'
    };
    
    /** 
    * configurations of Viewer
    * @const 
    * @dict
    */
    var DEFAULT_CONFIG = {
      // id of the element to put the pages in
      'container_id' : 'page-container',
      // id of the element for sidebar (to open and close)
      'sidebar_id' : 'sidebar',
      // id of the element for outline
      'outline_id' : 'outline',
      // class for the loading indicator
      'loading_indicator_cls' : 'loading-indicator',
      // How many page shall we preload that are below the last visible page
      'preload_pages' : 3,
      // how many ms should we wait before actually rendering the pages and after a scroll event
      'render_timeout' : 100,
      // zoom ratio step for each zoom in/out event
      'scale_step' : 0.9,
      // register global key handler, allowing navigation by keyboard
      'key_handler' : true,
      // register hashchange handler, navigate to the location specified by the hash
      'hashchange_handler' : true,
      // register view history handler, allowing going back to the previous location
      'view_history_handler' : true,
    
      '__dummy__'        : 'no comma'
    };
    
    /** @const */
    var EPS = 1e-6;
    
    /************************************/
    /* utility function */
    /**
    * @param{Array.<number>} ctm
    */
    function invert(ctm) {
      var det = ctm[0] * ctm[3] - ctm[1] * ctm[2];
      return [ ctm[3] / det
              ,-ctm[1] / det
              ,-ctm[2] / det
              ,ctm[0] / det
              ,(ctm[2] * ctm[5] - ctm[3] * ctm[4]) / det
              ,(ctm[1] * ctm[4] - ctm[0] * ctm[5]) / det
            ];
    };
    /**
    * @param{Array.<number>} ctm
    * @param{Array.<number>} pos
    */
    function transform(ctm, pos) {
      return [ctm[0] * pos[0] + ctm[2] * pos[1] + ctm[4]
            ,ctm[1] * pos[0] + ctm[3] * pos[1] + ctm[5]];
    };
    
    /**
    * @param{Element} ele
    */
    function get_page_number(ele) {
      return parseInt(ele.getAttribute('data-page-no'), 16);
    };
    
    /**
    * @param{NodeList} eles
    */
    function disable_dragstart(eles) {
      for (var i = 0, l = eles.length; i < l; ++i) {
        eles[i].addEventListener('dragstart', function() {
          return false;
        }, false);
      }
    };
    
    /**
    * @param{...Object} var_args
    */
    function clone_and_extend_objs(var_args) {
      var result_obj = {};
      for (var i = 0, l = arguments.length; i < l; ++i) {
        var cur_obj = arguments[i];
        for (var k in cur_obj) {
          if (cur_obj.hasOwnProperty(k)) {
            result_obj[k] = cur_obj[k];
          }
        }
      }
      return result_obj;
    };
    
    /** 
    * @constructor 
    * @param{Element} page The element for the page
    */
    function Page(page) {
      if (!page) return;
    
      this.loaded = false;
      this.shown = false;
      this.page = page; // page frame element
    
      this.num = get_page_number(page);
    
      // page size
      // Need to make rescale work when page_content_box is not loaded, yet
      this.original_height = page.clientHeight;     
      this.original_width = page.clientWidth;
    
      // content box
      var content_box = page.getElementsByClassName(CSS_CLASS_NAMES.page_content_box)[0];
    
      // if page is loaded
      if (content_box) {
        this.content_box = content_box;
        /*
        * scale ratios
        *
        * original_scale : the first one
        * cur_scale : currently using
        */
        this.original_scale = this.cur_scale = this.original_height / content_box.clientHeight;
        this.page_data = JSON.parse(page.getElementsByClassName(CSS_CLASS_NAMES.page_data)[0].getAttribute('data-data'));
    
        this.ctm = this.page_data['ctm'];
        this.ictm = invert(this.ctm);
    
        this.loaded = true;
      }
    };
    Page.prototype = {
      /* hide & show are for contents, the page frame is still there */
      hide : function(){
        if (this.loaded && this.shown) {
          this.content_box.classList.remove('opened');
          this.shown = false;
        }
      },
      show : function(){
        if (this.loaded && !this.shown) {
          this.content_box.classList.add('opened');
          this.shown = true;
        }
      },
      /**
      * @param{number} ratio
      */
      rescale : function(ratio) {
        if (ratio === 0) {
          // reset scale
          this.cur_scale = this.original_scale;
        } else {
          this.cur_scale = ratio;
        }
    
        // scale the content box
        if (this.loaded) {
          var cbs = this.content_box.style;
          cbs.msTransform = cbs.webkitTransform = cbs.transform = 'scale('+this.cur_scale.toFixed(3)+')';
        }
    
        // stretch the page frame to hold the place
        {
          var ps = this.page.style;
          ps.height = (this.original_height * this.cur_scale) + 'px';
          ps.width = (this.original_width * this.cur_scale) + 'px';
        }
      },
      /*
      * return the coordinate of the top-left corner of container
      * in our coordinate system
      * assuming that p.parentNode === p.offsetParent
      */
      view_position : function () {
        var p = this.page;
        var c = p.parentNode;
        return [c.scrollLeft - p.offsetLeft - p.clientLeft
              ,c.scrollTop - p.offsetTop - p.clientTop];
      },
      height : function () {
        return this.page.clientHeight;
      },
      width : function () {
        return this.page.clientWidth;
      }
    };
    
    /** 
    * @constructor
    * @param{Object=} config
    */
    function Viewer(config) {
      this.config = clone_and_extend_objs(DEFAULT_CONFIG, (arguments.length > 0 ? config : {}));
      this.pages_loading = [];
      this.init_before_loading_content();
    
      var self = this;
      document.addEventListener('DOMContentLoaded', function(){
        self.init_after_loading_content();
      }, false);
    };
    
    Viewer.prototype = {
      scale : 1,
      /* 
      * index of the active page (the one with largest visible area)
      * which estimates the page currently being viewed
      */
      cur_page_idx : 0,
    
      /*
      * index of the first visible page
      * used when determining current view
      */
      first_page_idx : 0,
    
      init_before_loading_content : function() {
        /* hide all pages before loading, will reveal only visible ones later */
        this.pre_hide_pages();
      },
    
      initialize_radio_button : function() {
        var elements = document.getElementsByClassName(CSS_CLASS_NAMES.input_radio);
        
        for(var i = 0; i < elements.length; i++) {
          var r = elements[i];
    
          r.addEventListener('click', function() {
            this.classList.toggle("checked");
          });
        }
      },
    
      init_after_loading_content : function() {
        this.sidebar = document.getElementById(this.config['sidebar_id']);
        this.outline = document.getElementById(this.config['outline_id']);
        this.container = document.getElementById(this.config['container_id']);
        this.loading_indicator = document.getElementsByClassName(this.config['loading_indicator_cls'])[0];
    
        
        {
          // Open the outline if nonempty
          var empty = true;
          var nodes = this.outline.childNodes;
          for (var i = 0, l = nodes.length; i < l; ++i) {
            var cur_node = nodes[i];
            if (cur_node.nodeName.toLowerCase() === 'ul') {
              empty = false;
              break;
            }
          }
          if (!empty)
            this.sidebar.classList.add('opened');
        }
    
        this.find_pages();
        // do nothing if there's nothing
        if(this.pages.length == 0) return;
    
        // disable dragging of background images
        disable_dragstart(document.getElementsByClassName(CSS_CLASS_NAMES.background_image));
    
        if (this.config['key_handler'])
          this.register_key_handler();
    
        var self = this;
    
        if (this.config['hashchange_handler']) {
          window.addEventListener('hashchange', function(e) {
            self.navigate_to_dest(document.location.hash.substring(1));
          }, false);
        }
    
        if (this.config['view_history_handler']) {
          window.addEventListener('popstate', function(e) {
            if(e.state) self.navigate_to_dest(e.state);
          }, false);
        }
    
        // register schedule rendering
        // renew old schedules since scroll() may be called frequently
        this.container.addEventListener('scroll', function() {
          self.update_page_idx();
          self.schedule_render(true);
        }, false);
    
        // handle links
        [this.container, this.outline].forEach(function(ele) {
          ele.addEventListener('click', self.link_handler.bind(self), false);
        });
    
        this.initialize_radio_button();
        this.render();
      },
    
      /*
      * set up this.pages and this.page_map
      * pages is an array holding all the Page objects
      * page-Map maps an original page number (in PDF) to the corresponding index in page
      */
      find_pages : function() {
        var new_pages = [];
        var new_page_map = {};
        var nodes = this.container.childNodes;
        for (var i = 0, l = nodes.length; i < l; ++i) {
          var cur_node = nodes[i];
          if ((cur_node.nodeType === Node.ELEMENT_NODE)
              && cur_node.classList.contains(CSS_CLASS_NAMES.page_frame)) {
            var p = new Page(cur_node);
            new_pages.push(p);
            new_page_map[p.num] = new_pages.length - 1;
          }
        }
        this.pages = new_pages;
        this.page_map = new_page_map;
      },
    
      /**
      * @param{number} idx
      * @param{number=} pages_to_preload
      * @param{function(Page)=} callback
      *
      * TODO: remove callback -> promise ?
      */
      load_page : function(idx, pages_to_preload, callback) {
        var pages = this.pages;
        if (idx >= pages.length)
          return;  // Page does not exist
    
        var cur_page = pages[idx];
        if (cur_page.loaded)
          return;  // Page is loaded
    
        if (this.pages_loading[idx])
          return;  // Page is already loading
    
        var cur_page_ele = cur_page.page;
        var url = cur_page_ele.getAttribute('data-page-url');
        if (url) {
          this.pages_loading[idx] = true;       // set semaphore
    
          // add a copy of the loading indicator if not already present
          var new_loading_indicator = cur_page_ele.getElementsByClassName(this.config['loading_indicator_cls'])[0];
          if (typeof new_loading_indicator === 'undefined'){
            new_loading_indicator = this.loading_indicator.cloneNode(true);
            new_loading_indicator.classList.add('active');
            cur_page_ele.appendChild(new_loading_indicator);
          }
    
          // load data
          {
            var self = this;
            var _idx = idx;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onload = function(){
              if (xhr.status === 200 || xhr.status === 0) {
                // find the page element in the data
                var div = document.createElement('div');
                div.innerHTML = xhr.responseText;
    
                var new_page = null;
                var nodes = div.childNodes;
                for (var i = 0, l = nodes.length; i < l; ++i) {
                  var cur_node = nodes[i];
                  if ((cur_node.nodeType === Node.ELEMENT_NODE)
                      && cur_node.classList.contains(CSS_CLASS_NAMES.page_frame)) {
                    new_page = cur_node;
                    break;
                  }
                }
    
                // replace the old page with loaded data
                // the loading indicator on this page should also be destroyed
                var p = self.pages[_idx];
                self.container.replaceChild(new_page, p.page);
                p = new Page(new_page);
                self.pages[_idx] = p;
    
                p.hide();
                p.rescale(self.scale);
    
                // disable background image dragging
                disable_dragstart(new_page.getElementsByClassName(CSS_CLASS_NAMES.background_image));
    
                self.schedule_render(false);
    
                if (callback){ callback(p); }
              }
    
              // Reset loading token
              delete self.pages_loading[_idx];
            };
            xhr.send(null);
          }
        }
        // Concurrent prefetch of the next pages
        if (pages_to_preload === undefined)
          pages_to_preload = this.config['preload_pages'];
    
        if (--pages_to_preload > 0) {
          var self = this;
          setTimeout(function() {
            self.load_page(idx+1, pages_to_preload);
          },0);
        }
      },
    
      /*
      * Hide all pages that have no 'opened' class
      * The 'opened' class will be added to visible pages by JavaScript
      * We cannot add this in the default CSS because JavaScript may be disabled
      */
      pre_hide_pages : function() {
        /* pages might have not been loaded yet, so add a CSS rule */
        var s = '@media screen{.'+CSS_CLASS_NAMES.page_content_box+'{display:none;}}';
        var n = document.createElement('style');
        if (n.styleSheet) {
          n.styleSheet.cssText = s;
        } else {
          n.appendChild(document.createTextNode(s));
        }
        document.head.appendChild(n);
      },
    
      /*
      * show visible pages and hide invisible pages
      */
      render : function () {
        var container = this.container;
        /* 
        * show the pages that are 'nearly' visible -- it's right above or below the container
        *
        * all the y values are in the all-page element's coordinate system
        */
        var container_min_y = container.scrollTop;
        var container_height = container.clientHeight;
        var container_max_y = container_min_y + container_height;
        var visible_min_y = container_min_y - container_height;
        var visible_max_y = container_max_y + container_height;
    
        var cur_page_fully_visible = false;
        var cur_page_idx = this.cur_page_idx;
        var max_visible_page_idx = cur_page_idx;
        var max_visible_ratio = 0.0;
    
        var pl = this.pages;
        for (var i = 0, l = pl.length; i < l; ++i) {
          var cur_page = pl[i];
          var cur_page_ele = cur_page.page;
          var page_min_y = cur_page_ele.offsetTop + cur_page_ele.clientTop;
          var page_height = cur_page_ele.clientHeight;
          var page_max_y = page_min_y + page_height;
          if ((page_min_y <= visible_max_y) && (page_max_y >= visible_min_y))
          {
            // cur_page is 'nearly' visible, show it or load it
            if (cur_page.loaded) {
              cur_page.show();
            } else {
              this.load_page(i);
            }
          } else {
            cur_page.hide();
          }
        }
      },
      /*
      * update cur_page_idx and first_page_idx
      * normally called upon scrolling
      */
      update_page_idx: function () {
        var pages = this.pages;
        var pages_len = pages.length;
        // there is no chance that cur_page_idx or first_page_idx is modified
        if (pages_len < 2) return;
      
        var container = this.container;
        var container_min_y = container.scrollTop;
        var container_max_y = container_min_y + container.clientHeight;
    
        // binary search for the first page
        // whose bottom border is below the top border of the container
        var first_idx = -1;
        var last_idx = pages_len;
        var rest_len = last_idx - first_idx;
        // TODO: use current first_page_idx as a hint?
        while(rest_len > 1) {
          var idx = first_idx + Math.floor(rest_len / 2);
          var cur_page_ele = pages[idx].page;
          if (cur_page_ele.offsetTop + cur_page_ele.clientTop + cur_page_ele.clientHeight >= container_min_y) {
            last_idx = idx;
          } else {
            first_idx = idx;
          }
          rest_len = last_idx - first_idx;
        }
        
        /*
        * with malformed settings it is possible that no page is visible, e.g.
        * - the container is to thin, which lies in the margin between two pages
        * - all pages are completely above or below the container
        * but we just assume that they won't happen.
        */
        this.first_page_idx = last_idx;
    
        // find the page with largest visible area
        var cur_page_idx = this.cur_page_idx;
        var max_visible_page_idx = cur_page_idx;
        var max_visible_ratio = 0.0;
    
        for(var i = last_idx; i < pages_len; ++i) {
          var cur_page_ele = pages[i].page;
          var page_min_y = cur_page_ele.offsetTop + cur_page_ele.clientTop;
          var page_height = cur_page_ele.clientHeight;
          var page_max_y = page_min_y + page_height;
          if (page_min_y > container_max_y) break;
    
          // check the visible fraction of the page
          var page_visible_ratio = ( Math.min(container_max_y, page_max_y) 
                                    - Math.max(container_min_y, page_min_y)
                                  ) / page_height;
    
          // stay with the current page if it is still fully visible
          if ((i === cur_page_idx) && (Math.abs(page_visible_ratio - 1.0) <= EPS)) {
            max_visible_page_idx = cur_page_idx;
            break;
          }
    
          if (page_visible_ratio > max_visible_ratio) {
            max_visible_ratio = page_visible_ratio;
            max_visible_page_idx = i;
          }
        }
    
        this.cur_page_idx = max_visible_page_idx;
      },
    
      /**
      * @param{boolean} renew renew the existing schedule instead of using the old one
      */
      schedule_render : function(renew) {
        if (this.render_timer !== undefined) {
          if (!renew) return;
          clearTimeout(this.render_timer);
        }
    
        var self = this;
        this.render_timer = setTimeout(function () {
          /*
          * render() may trigger load_page(), which may in turn trigger another render()
          * so delete render_timer first
          */
          delete self.render_timer;
          self.render();
        }, this.config['render_timeout']);
      },
    
      /*
      * Handling key events, zooming, scrolling etc.
      */
      register_key_handler: function () {
        /* 
        * When user try to zoom in/out using ctrl + +/- or mouse wheel
        * handle this and prevent the default behaviours
        *
        * Code credit to PDF.js
        */
        var self = this;
    
        // Firefox specific event, so that we can prevent browser from zooming
        window.addEventListener('DOMMouseScroll', function(e) {
          if (e.ctrlKey) {
            e.preventDefault();
            var container = self.container;
            var rect = container.getBoundingClientRect();
            var fixed_point = [e.clientX - rect['left'] - container.clientLeft
                              ,e.clientY - rect['top'] - container.clientTop];
            self.rescale(Math.pow(self.config['scale_step'], e.detail), true, fixed_point);
          }
        }, false);
    
        window.addEventListener('keydown', function(e) {
          var handled = false;
          /*
          var cmd = (e.ctrlKey ? 1 : 0)
                    | (e.altKey ? 2 : 0)
                    | (e.shiftKey ? 4 : 0)
                    | (e.metaKey ? 8 : 0)
                    ;
                    */
          var with_ctrl = e.ctrlKey || e.metaKey;
          var with_alt = e.altKey;
          switch (e.keyCode) {
            case 61: // FF/Mac '='
            case 107: // FF '+' and '='
            case 187: // Chrome '+'
              if (with_ctrl){
                self.rescale(1.0 / self.config['scale_step'], true);
                handled = true;
              }
              break;
            case 173: // FF/Mac '-'
            case 109: // FF '-'
            case 189: // Chrome '-'
              if (with_ctrl){
                self.rescale(self.config['scale_step'], true);
                handled = true;
              }
              break;
            case 48: // '0'
              if (with_ctrl){
                self.rescale(0, false);
                handled = true;
              }
              break;
            case 33: // Page UP:
              if (with_alt) { // alt-pageup    -> scroll one page up
                self.scroll_to(self.cur_page_idx - 1);
              } else { // pageup        -> scroll one screen up
                self.container.scrollTop -= self.container.clientHeight;
              }
              handled = true;
              break;
            case 34: // Page DOWN
              if (with_alt) { // alt-pagedown  -> scroll one page down
                self.scroll_to(self.cur_page_idx + 1);
              } else { // pagedown      -> scroll one screen down
                self.container.scrollTop += self.container.clientHeight;
              }
              handled = true;
              break;
            case 35: // End
              self.container.scrollTop = self.container.scrollHeight;
              handled = true;
              break;
            case 36: // Home
              self.container.scrollTop = 0;
              handled = true;
              break;
          }
          if (handled) {
            e.preventDefault();
            return;
          }
        }, false);
      },
    
      /**
      * @param{number} ratio
      * @param{boolean} is_relative
      * @param{Array.<number>=} fixed_point preserve the position (relative to the top-left corner of the viewer) after rescaling
      */
      rescale : function (ratio, is_relative, fixed_point) {
        var old_scale = this.scale;
        var new_scale = old_scale;
        // set new scale
        if (ratio === 0) {
          new_scale = 1;
          is_relative = false;
        } else if (is_relative)
          new_scale *= ratio;
        else
          new_scale = ratio;
    
        this.scale = new_scale;
    
        if (!fixed_point)
          fixed_point = [0,0];
    
        // translate fixed_point to the coordinate system of all pages
        var container = this.container;
        fixed_point[0] += container.scrollLeft;
        fixed_point[1] += container.scrollTop;
    
        // find the visible page that contains the fixed point
        // if the fixed point lies between two pages (including their borders), it's contained in the first one
        var pl = this.pages;
        var pl_len = pl.length;
        for (var i = this.first_page_idx; i < pl_len; ++i) {
          var p = pl[i].page;
          if (p.offsetTop + p.clientTop >= fixed_point[1])
            break;
        }
        var fixed_point_page_idx = i - 1;
    
        // determine the new scroll position
        // each-value consists of two parts, one inside the page, which is affected by rescaling,
        // the other is outside, (e.g. borders and margins), which is not affected
    
        // if the fixed_point is above the first page, use the first page as the reference
        if (fixed_point_page_idx < 0) 
          fixed_point_page_idx = 0;
    
        var fp_p = pl[fixed_point_page_idx].page;
        var fp_p_width = fp_p.clientWidth;
        var fp_p_height = fp_p.clientHeight;
    
        var fp_x_ref = fp_p.offsetLeft + fp_p.clientLeft;
        var fp_x_inside = fixed_point[0] - fp_x_ref;
        if (fp_x_inside < 0)
          fp_x_inside = 0;
        else if (fp_x_inside > fp_p_width)
          fp_x_inside = fp_p_width;
    
        var fp_y_ref = fp_p.offsetTop + fp_p.clientTop;
        var fp_y_inside = fixed_point[1] - fp_y_ref;
        if (fp_y_inside < 0)
          fp_y_inside = 0;
        else if (fp_y_inside > fp_p_height)
          fp_y_inside = fp_p_height;
    
        // Rescale pages
        for (var i = 0; i < pl_len; ++i) 
            pl[i].rescale(new_scale);  
    
        // Correct container scroll to keep view aligned while zooming
        container.scrollLeft += fp_x_inside / old_scale * new_scale + fp_p.offsetLeft + fp_p.clientLeft - fp_x_inside - fp_x_ref;
        container.scrollTop += fp_y_inside / old_scale * new_scale + fp_p.offsetTop + fp_p.clientTop - fp_y_inside - fp_y_ref;
    
        // some pages' visibility may be toggled, wait for next render()
        // renew old schedules since rescale() may be called frequently
        this.schedule_render(true);
      },
    
      fit_width : function () {
        var page_idx = this.cur_page_idx;
        this.rescale(this.container.clientWidth / this.pages[page_idx].width(), true);
        this.scroll_to(page_idx);
      },
    
      fit_height : function () {
        var page_idx = this.cur_page_idx;
        this.rescale(this.container.clientHeight / this.pages[page_idx].height(), true);
        this.scroll_to(page_idx);
      },
      /**
      * @param{Node} ele
      */
      get_containing_page : function(ele) {
        /* get the page obj containing obj */
        while(ele) {
          if ((ele.nodeType === Node.ELEMENT_NODE)
              && ele.classList.contains(CSS_CLASS_NAMES.page_frame)) {
            /*
            * Get original page number and map it to index of pages
            * TODO: store the index on the dom element
            */
            var pn = get_page_number(/** @type{Element} */(ele));
            var pm = this.page_map;
            return (pn in pm) ? this.pages[pm[pn]] : null;
          }
          ele = ele.parentNode;
        }
        return null;
      },
    
      /**
      * @param{Event} e
      */
      link_handler : function (e) {
        var target = /** @type{Node} */(e.target);
        var detail_str = /** @type{string} */ (target.getAttribute('data-dest-detail'));
        if (!detail_str) return;
    
        if (this.config['view_history_handler']) {
          try {
            var cur_hash = this.get_current_view_hash();
            window.history.replaceState(cur_hash, '', '#' + cur_hash);
            window.history.pushState(detail_str, '', '#' + detail_str);
          } catch(ex) { }
        }
        this.navigate_to_dest(detail_str, this.get_containing_page(target));
        e.preventDefault();
      },
    
      /**
      * @param{string} detail_str may come from user provided hashtag, need sanitzing
      * @param{Page=} src_page page containing the source event (e.g. link)
      */
      navigate_to_dest : function(detail_str, src_page) {
        try {
          var detail = JSON.parse(detail_str);
        } catch(e) {
          return;
        }
    
        if(!(detail instanceof Array)) return;
    
        var target_page_no = detail[0];
        var page_map = this.page_map;
        if (!(target_page_no in page_map)) return;
        var target_page_idx = page_map[target_page_no];
        var target_page = this.pages[target_page_idx];
    
        for (var i = 2, l = detail.length; i < l; ++i) {
          var d = detail[i];
          if(!((d === null) || (typeof d === 'number')))
            return;
        }
    
        while(detail.length < 6)
          detail.push(null);
    
        // cur_page might be undefined, e.g. from Outline
        var cur_page = src_page || this.pages[this.cur_page_idx];
    
        var cur_pos = cur_page.view_position();
        cur_pos = transform(cur_page.ictm, [cur_pos[0], cur_page.height()-cur_pos[1]]);
    
        var zoom = this.scale;
        var pos = [0,0];
        var upside_down = true;
        var ok = false;
    
        // position specified in `detail` are in the raw coordinate system of the page (unscaled)
        var scale = this.scale;
        // TODO: fitb*
        // TODO: BBox
        switch(detail[1]) {
          case 'XYZ':
            pos = [ (detail[2] === null) ? cur_pos[0] : detail[2] * scale
                  , (detail[3] === null) ? cur_pos[1] : detail[3] * scale ];
            zoom = detail[4];
            if ((zoom === null) || (zoom === 0))
              zoom = this.scale;
            ok = true;
            break;
          case 'Fit':
          case 'FitB':
            pos = [0,0];
            ok = true;
            break;
          case 'FitH':
          case 'FitBH':
            pos = [0, (detail[2] === null) ? cur_pos[1] : detail[2] * scale];
            ok = true;
            break;
          case 'FitV':
          case 'FitBV':
            pos = [(detail[2] === null) ? cur_pos[0] : detail[2] * scale, 0];
            ok = true;
            break;
          case 'FitR':
            /* locate the top-left corner of the rectangle */
            // TODO
            pos = [detail[2] * scale, detail[5] * scale];
            upside_down = false;
            ok = true;
            break;
          default:
            break;
        }
    
        if (!ok) return;
    
        this.rescale(zoom, false);
    
        var self = this;
        /**
        * page should of type Page 
        * @param{Page} page 
        */
        var transform_and_scroll = function(page) {
          pos = transform(page.ctm, pos);
          if (upside_down) {
            pos[1] = page.height() - pos[1];
          }
          self.scroll_to(target_page_idx, pos);
        };
    
        if (target_page.loaded) {
          transform_and_scroll(target_page);
        } else {
          // TODO: scroll_to may finish before load_page
    
          // Scroll to the exact position once loaded.
          this.load_page(target_page_idx, undefined, transform_and_scroll);
    
          // In the meantime page gets loaded, scroll approximately position for maximum responsiveness.
          this.scroll_to(target_page_idx);
        }
      }, 
    
      /**
      * @param{number} page_idx
      * @param{Array.<number>=} pos [x,y] where (0,0) is the top-left corner
      */
      scroll_to : function(page_idx, pos) {
        var pl = this.pages;
        if ((page_idx < 0) || (page_idx >= pl.length)) return;
        var target_page = pl[page_idx];
        var cur_target_pos = target_page.view_position();
    
        if (pos === undefined)
          pos = [0,0];
    
        var container = this.container;
        container.scrollLeft += pos[0] - cur_target_pos[0];
        container.scrollTop += pos[1] - cur_target_pos[1];
      },
    
      /**
      * generate the hash for the current view
      */
      get_current_view_hash : function() {
        var detail = [];
        var cur_page = this.pages[this.cur_page_idx];
    
        detail.push(cur_page.num);
        detail.push('XYZ');
    
        var cur_pos = cur_page.view_position();
        cur_pos = transform(cur_page.ictm, [cur_pos[0], cur_page.height()-cur_pos[1]]);
        detail.push(cur_pos[0] / this.scale);
        detail.push(cur_pos[1] / this.scale);
        
        detail.push(this.scale);
    
        return JSON.stringify(detail);
      }
    };
    
    // export pdf2htmlEX.Viewer
    pdf2htmlEX['Viewer'] = Viewer;
    </script>
    <script>
    try{
    pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
    }catch(e){}
    </script>
    
  </head>
  <body>
    <div class="row">
      <div class="span12">
        <h3><a href="/">Home</a> 
          >> <a href="/#writing">Writing</a> 
          >> 
        </h3>
        <h1>The Developing Mind: A Philosophical Introduction (2020)</h1>
        <p>by Stephen A. Butterfill<br/>--- London: Routledge <a href="https://www.routledge.com/The-Developing-Mind-A-Philosophical-Introduction/Butterfill/p/book/9780415566230" target="_blank">[publisher's page]</a><br/>--- links: <a href="/pdf/developing_mind_contents.pdf">contents [pdf]</a>; <a href="/pdf/developing_mind_introduction.pdf">introduction [pdf]</a></p>
        <div style="position:relative">
          <div id="pf1" class="pf w0 h0" data-page-no="1"><div class="pc pc1 w0 h0"><div class="t m0 x0 h1 y0 ff1 fs0 fc0 sc0 ls2">Contents</div><div class="t m0 x0 h2 y1 ff2 fs1 fc0 sc0 ls2 ws0">Preface xi</div><div class="t m0 x0 h2 y2 ff2 fs1 fc0 sc0 ls2 ws1">1 Introduction<span class="_ _0"> </span>1</div><div class="t m0 x1 h3 y3 ff1 fs1 fc0 sc0 ls0 ws2">1<span class="_ _1"></span>.<span class="_ _1"></span>1 T<span class="_ _2"></span>w<span class="_ _1"></span>o<span class="_ _3"></span>B<span class="_ _1"></span>r<span class="_ _1"></span>e<span class="_ _1"></span>a<span class="_ _1"></span>k<span class="_ _1"></span>t<span class="_ _1"></span>h<span class="_ _1"></span>r<span class="_ _1"></span>o<span class="_ _1"></span>u<span class="_ _1"></span>g<span class="_ _1"></span>h<span class="_ _1"></span>s<span class="_ _4"></span>.......................<span class="_ _5"> </span>2<span class="_ _1"></span></div><div class="t m0 x1 h3 y4 ff1 fs1 fc0 sc0 ls0 ws2">1<span class="_ _1"></span>.<span class="_ _1"></span>2 K<span class="_ _1"></span>n<span class="_ _1"></span>o<span class="_ _1"></span>w<span class="_ _1"></span>l<span class="_ _1"></span>e<span class="_ _1"></span>d<span class="_ _1"></span>g<span class="_ _1"></span>e............................<span class="_ _5"> </span>3<span class="_ _1"></span></div><div class="t m0 x1 h3 y5 ff1 fs1 fc0 sc0 ls2 ws3">1.3<span class="_ _6"> </span>A<span class="_ _7"> </span>Crude<span class="_ _7"> </span>Picture<span class="_ _7"> </span>of<span class="_ _7"> </span>the<span class="_ _7"> </span>Mind<span class="_ _8"> </span>. . . . . . . . . . . . . . . . . .<span class="_ _9"> </span>4</div><div class="t m0 x1 h3 y6 ff1 fs1 fc0 sc0 ls0 ws2">1<span class="_ _1"></span>.<span class="_ _1"></span>4 C<span class="_ _1"></span>o<span class="_ _1"></span>r<span class="_ _1"></span>e<span class="_ _3"></span>K<span class="_ _1"></span>n<span class="_ _1"></span>o<span class="_ _1"></span>w<span class="_ _1"></span>l<span class="_ _1"></span>e<span class="_ _1"></span>d<span class="_ _1"></span>g<span class="_ _1"></span>e<span class="_ _a"></span>.........................<span class="_ _5"> </span>5<span class="_ _1"></span></div><div class="t m0 x1 h3 y7 ff1 fs1 fc0 sc0 ls0 ws2">1<span class="_ _1"></span>.<span class="_ _1"></span>5 T<span class="_ _2"></span>w<span class="_ _1"></span>o<span class="_ _3"></span>S<span class="_ _1"></span>t<span class="_ _1"></span>o<span class="_ _1"></span>r<span class="_ _1"></span>i<span class="_ _1"></span>e<span class="_ _1"></span>s<span class="_ _b"></span>............................<span class="_ _c"> </span>7<span class="_ _1"></span></div><div class="t m0 x1 h3 y8 ff1 fs1 fc0 sc0 ls2 ws3">1.6<span class="_ _6"> </span>Development<span class="_ _7"> </span>Is<span class="_ _7"> </span>Rediscov<span class="_ _d"></span>ery<span class="_ _e"> </span>. . . . . . . . . . . . . . . . . .<span class="_ _f"> </span>8</div><div class="t m0 x0 h4 y9 ff2 fs2 fc0 sc0 ls2 ws4">I<span class="_ _10"> </span>Physical Obje<span class="_ _11"></span>cts<span class="_ _12"> </span>11</div><div class="t m0 x0 h2 ya ff2 fs1 fc0 sc0 ls2 ws5">2<span class="_ _13"> </span>Principles of Object Perception<span class="_ _14"> </span>13</div><div class="t m0 x1 h3 yb ff1 fs1 fc0 sc0 ls2 ws3">2.1<span class="_ _6"> </span>Knowledge<span class="_ _7"> </span>of<span class="_ _7"> </span>Objects<span class="_ _7"> </span>Involves<span class="_ _7"> </span>Three<span class="_ _7"> </span>Abilities<span class="_ _15"> </span>. . . . . . . .<span class="_ _c"> </span>13</div><div class="t m0 x1 h3 yc ff1 fs1 fc0 sc0 ls0 ws6">2<span class="_ _1"></span>.<span class="_ _1"></span>2<span class="_ _8"> </span>S<span class="_ _1"></span>e<span class="_ _1"></span>g<span class="_ _1"></span>m<span class="_ _1"></span>e<span class="_ _1"></span>n<span class="_ _1"></span>t<span class="_ _1"></span>a<span class="_ _1"></span>t<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n ..........................<span class="_ _16"> </span>1<span class="_ _1"></span>5<span class="_ _1"></span></div><div class="t m0 x1 h3 yd ff1 fs1 fc0 sc0 ls2 ws3">2.3<span class="_ _6"> </span>Principles<span class="_ _7"> </span>of<span class="_ _7"> </span>Object<span class="_ _7"> </span>Perception<span class="_ _17"> </span>. . . . . . . . . . . . . . . . .<span class="_ _c"> </span>20</div><div class="t m0 x1 h3 ye ff1 fs1 fc0 sc0 ls0 ws2">2<span class="_ _1"></span>.<span class="_ _1"></span>4 C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>l<span class="_ _1"></span>u<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _d"></span>............................<span class="_ _16"> </span>2<span class="_ _1"></span>3<span class="_ _1"></span></div><div class="t m0 x0 h2 yf ff2 fs1 fc0 sc0 ls1">3<span class="ff3 ls2">�<span class="ff2 ws5">e Simple View<span class="_ _18"> </span>25</span></span></div><div class="t m0 x1 h3 y10 ff1 fs1 fc0 sc0 ls0 ws2">3<span class="_ _1"></span>.<span class="_ _1"></span>1 T<span class="_ _1"></span>h<span class="_ _1"></span>e<span class="_ _3"></span>S<span class="_ _1"></span>i<span class="_ _1"></span>m<span class="_ _1"></span>p<span class="_ _1"></span>l<span class="_ _1"></span>e<span class="_ _3"></span>V<span class="_ _1"></span>i<span class="_ _1"></span>e<span class="_ _1"></span>w<span class="_ _19"></span>.........................<span class="_ _16"> </span>2<span class="_ _1"></span>5<span class="_ _1"></span></div><div class="t m0 x1 h3 y11 ff1 fs1 fc0 sc0 ls0 ws2">3<span class="_ _1"></span>.<span class="_ _1"></span>2 P<span class="_ _1"></span>e<span class="_ _1"></span>r<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>s<span class="_ _1"></span>t<span class="_ _1"></span>e<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>e............................<span class="_ _1a"> </span>2<span class="_ _1"></span>7<span class="_ _1"></span></div><div class="t m0 x1 h3 y12 ff1 fs1 fc0 sc0 ls2 ws3">3.3<span class="_ _6"> </span>Extending<span class="_ _7"> </span>the<span class="_ _7"> </span>Simple<span class="_ _7"> </span>View<span class="_ _7"> </span>to<span class="_ _7"> </span>Persistence<span class="_ _1b"> </span>. . . . . . . . . . .<span class="_ _c"> </span>32</div><div class="t m0 x1 h3 y13 ff1 fs1 fc0 sc0 ls2 ws3">3.4<span class="_ _6"> </span>Causal<span class="_ _7"> </span>Interactions<span class="_ _16"> </span>. . . . . . . . . . . . . . . . . . . . . . .<span class="_ _c"> </span>34</div><div class="t m0 x1 h3 y14 ff1 fs1 fc0 sc0 ls2 ws3">3.5<span class="_ _6"> </span>The<span class="_ _7"> </span>Case<span class="_ _7"> </span>for<span class="_ _7"> </span>the<span class="_ _7"> </span>Simple<span class="_ _7"> </span>View<span class="_ _1a"> </span>. . . . . . . . . . . . . . . . .<span class="_ _c"> </span>36</div><div class="t m0 x0 h2 y15 ff2 fs1 fc0 sc0 ls1">4<span class="ff3 ls2">�<span class="ff2 ws5">e Linking Problem<span class="_ _1c"> </span>41</span></span></div><div class="t m0 x1 h3 y16 ff1 fs1 fc0 sc0 ls2 ws3">4.1<span class="_ _6"> </span>Against<span class="_ _7"> </span>the<span class="_ _7"> </span>Simple<span class="_ _7"> </span>View<span class="_ _1d"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _c"> </span>42</div><div class="t m0 x1 h3 y17 ff1 fs1 fc0 sc0 ls2 ws3">4.2<span class="_ _6"> </span>Further<span class="_ _7"> </span>Evidence<span class="_ _7"> </span>Against<span class="_ _7"> </span>the<span class="_ _7"> </span>Simple<span class="_ _7"> </span>View<span class="_ _8"> </span>. . . . . . . . . .<span class="_ _1e"> </span>46</div><div class="t m0 x1 h3 y18 ff1 fs1 fc0 sc0 ls2 ws3">4.3<span class="_ _6"> </span>Things<span class="_ _7"> </span>Get<span class="_ _7"> </span>Even<span class="_ _7"> </span>W<span class="_ _1f"></span>orse<span class="_ _7"> </span>for<span class="_ _7"> </span>the<span class="_ _7"> </span>Simple<span class="_ _7"> </span>View<span class="_ _1d"> </span>. . . . . . . . .<span class="_ _c"> </span>48</div><div class="t m0 x1 h3 y19 ff1 fs1 fc0 sc0 ls2 ws3">4.4<span class="_ _6"> </span>The<span class="_ _7"> </span>Linking<span class="_ _7"> </span>Problem<span class="_ _1d"> </span>. . . . . . . . . . . . . . . . . . . . . .<span class="_ _1e"> </span>50</div><div class="t m0 x1 h3 y1a ff1 fs1 fc0 sc0 ls2 ws3">4.5<span class="_ _6"> </span>Representation<span class="_ _7"> </span>Not<span class="_ _7"> </span>Knowledge<span class="_ _20"> </span>. . . . . . . . . . . . . . . .<span class="_ _1e"> </span>51</div><div class="t m0 x1 h3 y1b ff1 fs1 fc0 sc0 ls2 ws3">4.6<span class="_ _6"> </span>Graded<span class="_ _7"> </span>Representations?<span class="_ _8"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _5"> </span>53</div><div class="t m0 x2 h5 y1c ff1 fs3 fc0 sc0 ls2">v</div><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:593.008000px;width:42.221000px;height:10.516000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:565.895000px;width:89.038000px;height:10.630000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:548.472000px;width:126.207000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:533.667000px;width:84.412000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:521.516000px;width:168.385000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:504.058000px;width:110.845000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:491.907000px;width:87.185000px;height:10.032000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:474.448000px;width:168.373000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:432.024000px;width:127.908000px;height:15.421000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:405.481000px;width:188.038000px;height:13.273000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:390.701000px;width:256.076000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:375.896000px;width:96.642000px;height:12.686000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:361.091000px;width:180.758000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:348.940000px;width:84.747000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:319.263000px;width:109.971000px;height:13.272000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:304.482000px;width:112.793000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:292.331000px;width:84.376000px;height:10.033000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:274.872000px;width:232.955000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:262.722000px;width:123.661000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:245.263000px;width:174.685000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:218.240000px;width:134.192000px;height:13.272000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:203.459000px;width:150.189000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:188.654000px;width:236.936000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:173.849000px;width:245.017000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:159.044000px;width:132.914000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:144.239000px;width:182.061000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:129.435000px;width:151.480000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
          <div id="pf2" class="pf w0 h0" data-page-no="2"><div class="pc pc2 w0 h0"><div class="t m0 x1 h3 y1d ff1 fs1 fc0 sc0 ls0 ws2">4<span class="_ _1"></span>.<span class="_ _1"></span>7 C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>l<span class="_ _1"></span>u<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _d"></span>............................<span class="_ _16"> </span>5<span class="_ _1"></span>5<span class="_ _1"></span></div><div class="t m0 x0 h2 y1e ff2 fs1 fc0 sc0 ls2 ws5">5<span class="_ _13"> </span>Core Knowledge<span class="_ _21"> </span>57</div><div class="t m0 x1 h3 y1f ff1 fs1 fc0 sc0 ls2 ws3">5.1<span class="_ _6"> </span>What<span class="_ _7"> </span>Is<span class="_ _7"> </span>Core<span class="_ _7"> </span>Knowledge?<span class="_ _1a"> </span>. . . . . . . . . . . . . . . . . . .<span class="_ _c"> </span>58</div><div class="t m0 x1 h3 y20 ff1 fs1 fc0 sc0 ls2 ws5">5.2<span class="_ _6"> </span>Can Core Knowledge Solve the Linking Pr<span class="_ _d"></span>oblem?<span class="_ _1d"> </span>.<span class="_ _22"> </span>.<span class="_ _22"> </span>.<span class="_ _22"> </span>.<span class="_ _22"> </span>.<span class="_ _22"> </span>.<span class="_ _c"> </span>60</div><div class="t m0 x1 h3 y21 ff1 fs1 fc0 sc0 ls2 ws5">5.3<span class="_ _6"> </span>How Not to De<span class="ff4"></span><span class="ls0 ws8">n<span class="_ _1"></span>e<span class="_ _3"></span>S<span class="_ _1"></span>o<span class="_ _1"></span>m<span class="_ _1"></span>e<span class="_ _1"></span>t<span class="_ _1"></span>h<span class="_ _1"></span>i<span class="_ _1"></span>n<span class="_ _1"></span>g<span class="_ _23"></span>................. 6<span class="_ _1"></span>2<span class="_ _1"></span></span></div><div class="t m0 x1 h3 y22 ff1 fs1 fc0 sc0 ls2 ws3">5.4<span class="_ _6"> </span>Will<span class="_ _7"> </span>Invoking<span class="_ _7"> </span>Modularity<span class="_ _7"> </span>Help?<span class="_ _24"> </span>. . . . . . . . . . . . . . . .<span class="_ _c"> </span>63</div><div class="t m0 x1 h3 y23 ff1 fs1 fc0 sc0 ls0 ws2">5<span class="_ _1"></span>.<span class="_ _1"></span>5 C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>l<span class="_ _1"></span>u<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _d"></span>............................<span class="_ _1a"> </span>6<span class="_ _1"></span>4<span class="_ _1"></span></div><div class="t m0 x0 h2 y24 ff2 fs1 fc0 sc0 ls2 ws5">6<span class="_ _13"> </span>Object Indexes and Motor Representations of Objects<span class="_ _25"> </span>67</div><div class="t m0 x1 h3 y25 ff1 fs1 fc0 sc0 ls2 ws3">6.1<span class="_ _6"> </span>Object<span class="_ _7"> </span>Indexes<span class="_ _7"> </span>in<span class="_ _7"> </span>Adult<span class="_ _7"> </span>Humans<span class="_ _26"> </span>. . . . . . . . . . . . . . . .<span class="_ _c"> </span>68</div><div class="t m0 x1 h3 y26 ff1 fs1 fc0 sc0 ls2 ws5">6.2<span class="_ _6"> </span>Object Indexes and the Principles of Object Perception<span class="_ _1a"> </span>.<span class="_ _22"> </span>.<span class="_ _22"> </span>.<span class="_ _c"> </span>70</div><div class="t m0 x1 h3 y27 ff1 fs1 fc0 sc0 ls2 ws3">6.3<span class="_ _6"> </span>The<span class="_ _7"> </span>CLSTX<span class="_ _7"> </span>Conjecture<span class="_ _27"> </span>. . . . . . . . . . . . . . . . . . . . .<span class="_ _1e"> </span>74</div><div class="t m0 x1 h3 y28 ff1 fs1 fc0 sc0 ls0 ws2">6<span class="_ _1"></span>.<span class="_ _1"></span>4 S<span class="_ _1"></span>i<span class="_ _1"></span>g<span class="_ _1"></span>n<span class="_ _1"></span>a<span class="_ _1"></span>t<span class="_ _1"></span>u<span class="_ _1"></span>r<span class="_ _1"></span>e<span class="_ _3"></span>L<span class="_ _1"></span>i<span class="_ _1"></span>m<span class="_ _1"></span>i<span class="_ _1"></span>t<span class="_ _1"></span>s<span class="_ _11"></span>.........................<span class="_ _16"> </span>7<span class="_ _1"></span>5<span class="_ _1"></span></div><div class="t m0 x1 h3 y29 ff1 fs1 fc0 sc0 ls2 ws3">6.5<span class="_ _6"> </span>Knowledge<span class="_ _7"> </span>or<span class="_ _7"> </span>Core<span class="_ _7"> </span>Knowledge<span class="_ _7"> </span>or<span class="_ _7"> </span>…?<span class="_ _15"> </span>. . . . . . . . . . . . .<span class="_ _1e"> </span>79</div><div class="t m0 x1 h3 y2a ff1 fs1 fc0 sc0 ls2 ws3">6.6<span class="_ _6"> </span>Against<span class="_ _7"> </span>the<span class="_ _7"> </span>CLSTX<span class="_ _7"> </span>Conjecture<span class="_ _17"> </span>. . . . . . . . . . . . . . . . .<span class="_ _1e"> </span>80</div><div class="t m0 x1 h3 y2b ff1 fs1 fc0 sc0 ls2 ws3">6.7<span class="_ _6"> </span>Motor<span class="_ _7"> </span>Representations<span class="_ _7"> </span>of<span class="_ _7"> </span>Objects<span class="_ _28"> </span>. . . . . . . . . . . . . . .<span class="_ _1e"> </span>81</div><div class="t m0 x1 h3 y2c ff1 fs1 fc0 sc0 ls0 ws2">6<span class="_ _1"></span>.<span class="_ _1"></span>8 C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>j<span class="_ _1"></span>e<span class="_ _1"></span>c<span class="_ _1"></span>t<span class="_ _1"></span>u<span class="_ _1"></span>r<span class="_ _1"></span>e<span class="_ _3"></span>O<span class="_ _29"></span>...........................<span class="_ _16"> </span>8<span class="_ _1"></span>3<span class="_ _1"></span></div><div class="t m0 x1 h3 y2d ff1 fs1 fc0 sc0 ls2 ws3">6.9<span class="_ _6"> </span>Conclusion:<span class="_ _1b"> </span>Paradox<span class="_ _7"> </span>Lost<span class="_ _17"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _1e"> </span>86</div><div class="t m0 x0 h2 y2e ff2 fs1 fc0 sc0 ls2 ws5">7<span class="_ _13"> </span>Metacognitive Feelings<span class="_ _2a"> </span>89</div><div class="t m0 x1 h3 y2f ff1 fs1 fc0 sc0 ls2 ws3">7.1<span class="_ _6"> </span>Objection<span class="_ _7"> </span>to<span class="_ _7"> </span>Conjecture<span class="_ _7"> </span>O<span class="_ _16"> </span>. . . . . . . . . . . . . . . . . . .<span class="_ _c"> </span>89</div><div class="t m0 x1 h3 y30 ff1 fs1 fc0 sc0 ls2 ws3">7.2<span class="_ _6"> </span>Metacognitive<span class="_ _7"> </span>Feelings:<span class="_ _1b"> </span>A<span class="_ _7"> </span>First<span class="_ _7"> </span>Example<span class="_ _2b"> </span>. . . . . . . . . . .<span class="_ _1e"> </span>91</div><div class="t m0 x1 h3 y31 ff1 fs1 fc0 sc0 ls2 ws3">7.3<span class="_ _6"> </span>More<span class="_ _7"> </span>Metacognitive<span class="_ _7"> </span>Feelings<span class="_ _2c"> </span>. . . . . . . . . . . . . . . . . .<span class="_ _c"> </span>92</div><div class="t m0 x1 h3 y32 ff1 fs1 fc0 sc0 ls2 ws3">7.4<span class="_ _6"> </span>What<span class="_ _7"> </span>Is<span class="_ _7"> </span>a<span class="_ _7"> </span>Metacognitive<span class="_ _7"> </span>Feeling?<span class="_ _2b"> </span>. . . . . . . . . . . . . . .<span class="_ _1e"> </span>94</div><div class="t m0 x1 h3 y33 ff1 fs1 fc0 sc0 ls2 ws3">7.5<span class="_ _6"> </span>A<span class="_ _7"> </span>Metacognitive<span class="_ _7"> </span>Feeling<span class="_ _7"> </span>of<span class="_ _7"> </span>Surprise?<span class="_ _28"> </span>. . . . . . . . . . . . .<span class="_ _1e"> </span>96</div><div class="t m0 x1 h6 y34 ff1 fs1 fc0 sc0 ls2 ws5">7.6<span class="_ _6"> </span>Conjecture O<span class="fs4 ls3 v1">m</span><span class="ls0 ws9">.......................... </span>97</div><div class="t m0 x1 h3 y35 ff1 fs1 fc0 sc0 ls2 ws3">7.7<span class="_ _6"> </span>Metacognitive<span class="_ _7"> </span>Feelings<span class="_ _7"> </span>are<span class="_ _7"> </span>Intentional<span class="_ _7"> </span>Isolators<span class="_ _28"> </span>. . . . . . .<span class="_ _c"> </span>99</div><div class="t m0 x1 h3 y36 ff1 fs1 fc0 sc0 ls0 wsa">7<span class="_ _1"></span>.<span class="_ _1"></span>8<span class="_ _8"> </span>C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>l<span class="_ _1"></span>u<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _a"></span>............................ 1<span class="_ _1"></span>0<span class="_ _1"></span>1<span class="_ _1"></span></div><div class="t m0 x0 h2 y37 ff2 fs1 fc0 sc0 ls2 ws5">8<span class="_ _13"> </span>Conclusion to Part I<span class="_ _2d"> </span>103</div><div class="t m0 x1 h3 y38 ff1 fs1 fc0 sc0 ls2 ws3">8.1<span class="_ _6"> </span>What<span class="_ _7"> </span>Is<span class="_ _7"> </span>an<span class="_ _7"> </span>Expectation?<span class="_ _1a"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>103</div><div class="t m0 x1 h3 y39 ff1 fs1 fc0 sc0 ls2 ws3">8.2<span class="_ _6"> </span>Core<span class="_ _7"> </span>Knowledge:<span class="_ _1b"> </span>A<span class="_ _7"> </span>Lighter<span class="_ _7"> </span>A<span class="_ _d"></span>ccount<span class="_ _20"> </span>. . . . . . . . . . . . .<span class="_ _1a"> </span>105</div><div class="t m0 x1 h3 y3a ff1 fs1 fc0 sc0 ls2 ws3">8.3<span class="_ _6"> </span>Development<span class="_ _7"> </span>Is<span class="_ _7"> </span>Rediscov<span class="_ _d"></span>ery<span class="_ _e"> </span>. . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>106</div><div class="t m0 x1 h3 y3b ff1 fs1 fc0 sc0 ls2 ws3">8.4<span class="_ _6"> </span>How<span class="_ _7"> </span>Does<span class="_ _7"> </span>Rediscovery<span class="_ _7"> </span>Occur?<span class="_ _26"> </span>. . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>108</div><div class="t m0 x0 h2 y3c ff2 fs1 fc0 sc0 ls2 ws1">9 Innateness<span class="_ _2e"> </span>113</div><div class="t m0 x1 h3 y3d ff1 fs1 fc0 sc0 ls0 wsb">9<span class="_ _1"></span>.<span class="_ _1"></span>1<span class="_ _8"> </span>S<span class="_ _1"></span>y<span class="_ _1"></span>n<span class="_ _1"></span>t<span class="_ _1"></span>a<span class="_ _1"></span>x ..............................<span class="_ _26"> </span>1<span class="_ _1"></span>1<span class="_ _1"></span>4<span class="_ _1"></span></div><div class="t m0 x1 h3 y3e ff1 fs1 fc0 sc0 ls2 ws3">9.2<span class="_ _6"> </span>A<span class="_ _7"> </span>Poverty<span class="_ _7"> </span>of<span class="_ _7"> </span>Stimulus<span class="_ _7"> </span>Argument<span class="_ _7"> </span>. . . . . . . . . . . . . . . .<span class="_ _2f"> </span>115</div><div class="t m0 x1 h3 y3f ff1 fs1 fc0 sc0 ls2 ws3">9.3<span class="_ _6"> </span>The<span class="_ _7"> </span>Poverty<span class="_ _7"> </span>of<span class="_ _7"> </span>Po<span class="_ _d"></span>verty<span class="_ _7"> </span>of<span class="_ _7"> </span>Stimulus<span class="_ _7"> </span>Arguments<span class="_ _7"> </span>. . . . . . . .<span class="_ _2f"> </span>118</div><div class="t m0 x1 h3 y40 ff1 fs1 fc0 sc0 ls2 ws3">9.4<span class="_ _6"> </span>Is<span class="_ _7"> </span>Core<span class="_ _7"> </span>Knowledge<span class="_ _7"> </span>Innate?<span class="_ _15"> </span>. . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>119</div><div class="t m0 x1 h3 y41 ff1 fs1 fc0 sc0 ls2 ws3">9.5<span class="_ _6"> </span>Syntax<span class="_ _7"> </span>and<span class="_ _7"> </span>Rediscovery<span class="_ _17"> </span>. . . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>120</div><div class="t m0 x1 h3 y42 ff1 fs1 fc0 sc0 ls0 wsc">9<span class="_ _1"></span>.<span class="_ _1"></span>6<span class="_ _8"> </span>C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>l<span class="_ _1"></span>u<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _a"></span>............................ 1<span class="_ _1"></span>2<span class="_ _1"></span>2<span class="_ _1"></span></div><div class="t m0 x3 h5 y1c ff1 fs3 fc0 sc0 ls2">vi</div><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:743.756000px;width:84.747000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:713.958000px;width:109.361000px;height:13.272000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:699.105000px;width:157.278000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:684.227000px;width:270.912000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:669.350000px;width:177.770000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:654.473000px;width:186.509000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:642.250000px;width:84.747000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:612.452000px;width:306.789000px;height:13.273000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:597.707000px;width:188.852000px;height:13.003000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:582.722000px;width:295.325000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:567.952000px;width:143.088000px;height:13.004000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:552.968000px;width:109.936000px;height:12.686000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:538.091000px;width:212.822000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:523.214000px;width:180.483000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:508.336000px;width:193.192000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:493.567000px;width:94.717000px;height:12.579000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:481.236000px;width:154.513000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:451.438000px;width:144.246000px;height:13.273000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:436.693000px;width:158.103000px;height:13.003000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:421.708000px;width:226.878000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:406.831000px;width:170.967000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:391.954000px;width:192.450000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:377.077000px;width:210.264000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:362.307000px;width:101.512000px;height:12.604000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:347.323000px;width:261.898000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:335.099000px;width:84.747000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:308.057000px;width:128.717000px;height:10.517000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:290.448000px;width:148.970000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:275.571000px;width:208.001000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:260.694000px;width:168.373000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:245.817000px;width:180.603000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:221.429000px;width:78.637000px;height:10.003000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:203.820000px;width:63.024000px;height:12.687000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:188.943000px;width:190.370000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:174.066000px;width:259.328000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:159.189000px;width:161.331000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:144.312000px;width:146.423000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:132.089000px;width:84.747000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
          <div id="pf3" class="pf w0 h0" data-page-no="3"><div class="pc pc3 w0 h0"><div class="t m0 x0 h4 y1d ff2 fs2 fc0 sc0 ls2 ws4">Interlude on Innateness<span class="_ _30"> </span>113</div><div class="t m0 x0 h4 y43 ff2 fs2 fc0 sc0 ls2 ws4">II<span class="_ _10"> </span>Minds and Actions<span class="_ _31"> </span>125</div><div class="t m0 x0 h2 y44 ff2 fs1 fc0 sc0 ls2 wsd">10 Action<span class="_ _32"> </span>127</div><div class="t m0 x1 h3 y45 ff1 fs1 fc0 sc0 ls2 ws3">10.1<span class="_ _e"> </span>T<span class="_ _d"></span>racking<span class="_ _7"> </span>vs<span class="_ _7"> </span>Knowing<span class="_ _27"> </span>. . . . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>127</div><div class="t m0 x1 h3 y46 ff1 fs1 fc0 sc0 ls2 ws3">10.2<span class="_ _e"> </span>Three-month-olds<span class="_ _7"> </span>T<span class="_ _d"></span>rack<span class="_ _7"> </span>the<span class="_ _7"> </span>Goals<span class="_ _7"> </span>of<span class="_ _7"> </span>Actions<span class="_ _2f"> </span>. . . . . . . .<span class="_ _2f"> </span>128</div><div class="t m0 x1 h3 y47 ff1 fs1 fc0 sc0 ls2 ws3">10.3<span class="_ _e"> </span>Pure<span class="_ _7"> </span>Goal<span class="_ _7"> </span>T<span class="_ _d"></span>racking<span class="_ _1d"> </span>. . . . . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>131</div><div class="t m0 x1 h3 y48 ff1 fs1 fc0 sc0 ls2 ws3">10.4<span class="_ _e"> </span>The<span class="_ _7"> </span>T<span class="_ _a"></span>eleological<span class="_ _7"> </span>Stance<span class="_ _33"> </span>. . . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>134</div><div class="t m0 x1 h3 y49 ff1 fs1 fc0 sc0 ls2 ws3">10.5<span class="_ _e"> </span>Statistical<span class="_ _7"> </span>Regularities<span class="_ _34"> </span>. . . . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>137</div><div class="t m0 x1 h3 y4a ff1 fs1 fc0 sc0 ls2 ws3">10.6<span class="_ _e"> </span>A<span class="_ _7"> </span>Methodological<span class="_ _7"> </span>Explanation?<span class="_ _16"> </span>. . . . . . . . . . . . . . . .<span class="_ _35"> </span>141</div><div class="t m0 x1 h3 y4b ff1 fs1 fc0 sc0 ls2 ws3">10.7<span class="_ _e"> </span>A<span class="_ _7"> </span>Second<span class="_ _7"> </span>Puzzle:<span class="_ _1b"> </span>Acting<span class="_ _7"> </span>and<span class="_ _7"> </span>T<span class="_ _a"></span>racking<span class="_ _20"> </span>. . . . . . . . . . . .<span class="_ _1a"> </span>142</div><div class="t m0 x1 h3 y4c ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>0<span class="_ _1"></span>.<span class="_ _1"></span>8 C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>l<span class="_ _1"></span>u<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _d"></span>............................<span class="_ _17"> </span>1<span class="_ _1"></span>4<span class="_ _1"></span>5<span class="_ _1"></span></div><div class="t m0 x0 h2 y4d ff2 fs1 fc0 sc0 ls2 ws5">11<span class="_ _33"> </span>A <span class="ff3">�</span>eory of Goal Tracking<span class="_ _36"> </span>147</div><div class="t m0 x1 h3 y4e ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>1<span class="_ _1"></span>.<span class="_ _1"></span>1 T<span class="_ _1"></span>h<span class="_ _1"></span>e<span class="_ _3"></span>S<span class="_ _1"></span>i<span class="_ _1"></span>m<span class="_ _1"></span>p<span class="_ _1"></span>l<span class="_ _1"></span>e<span class="_ _3"></span>V<span class="_ _1"></span>i<span class="_ _1"></span>e<span class="_ _1"></span>w<span class="_ _19"></span>.........................<span class="_ _26"> </span>1<span class="_ _1"></span>4<span class="_ _1"></span>7<span class="_ _1"></span></div><div class="t m0 x1 h3 y4f ff1 fs1 fc0 sc0 ls2 ws3">11.2<span class="_ _e"> </span>The<span class="_ _7"> </span>Motor<span class="_ _7"> </span>Theory<span class="_ _7"> </span>of<span class="_ _7"> </span>Goal<span class="_ _7"> </span>Tracking<span class="_ _37"> </span>. . . . . . . . . . . . . .<span class="_ _1a"> </span>148</div><div class="t m0 x1 h3 y50 ff1 fs1 fc0 sc0 ls2 ws3">11.3<span class="_ _e"> </span>The<span class="_ _7"> </span>Motor<span class="_ _7"> </span>Theory<span class="_ _7"> </span>and<span class="_ _7"> </span>the<span class="_ _7"> </span>T<span class="_ _a"></span>eleological<span class="_ _7"> </span>Stance<span class="_ _15"> </span>. . . . . . . .<span class="_ _2f"> </span>151</div><div class="t m0 x1 h3 y51 ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>1<span class="_ _1"></span>.<span class="_ _1"></span>4 T<span class="_ _2"></span>a<span class="_ _1"></span>r<span class="_ _1"></span>g<span class="_ _1"></span>e<span class="_ _1"></span>t<span class="_ _3"></span>v<span class="_ _1"></span>s<span class="_ _3"></span>G<span class="_ _1"></span>o<span class="_ _1"></span>a<span class="_ _1"></span>l<span class="_ _23"></span>..........................<span class="_ _26"> </span>1<span class="_ _1"></span>5<span class="_ _1"></span>3<span class="_ _1"></span></div><div class="t m0 x1 h3 y52 ff1 fs1 fc0 sc0 ls2 ws3">11.5<span class="_ _e"> </span>A<span class="_ _7"> </span>Dual<span class="_ _7"> </span>Process<span class="_ _7"> </span>Theory<span class="_ _7"> </span>of<span class="_ _7"> </span>Goal<span class="_ _7"> </span>Tracking<span class="_ _1d"> </span>. . . . . . . . . . .<span class="_ _1a"> </span>155</div><div class="t m0 x1 h3 y53 ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>1<span class="_ _1"></span>.<span class="_ _1"></span>6 P<span class="_ _1"></span>u<span class="_ _1"></span>z<span class="_ _1"></span>z<span class="_ _1"></span>l<span class="_ _1"></span>e<span class="_ _1"></span>s<span class="_ _3"></span>S<span class="_ _1"></span>o<span class="_ _1"></span>l<span class="_ _1"></span>v<span class="_ _1"></span>e<span class="_ _1"></span>d<span class="_ _1"></span>?<span class="_ _34"> </span>.........................<span class="_ _37"> </span>1<span class="_ _1"></span>5<span class="_ _1"></span>7<span class="_ _1"></span></div><div class="t m0 x1 h3 y54 ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>1<span class="_ _1"></span>.<span class="_ _1"></span>7 C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>l<span class="_ _1"></span>u<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _d"></span>............................<span class="_ _17"> </span>1<span class="_ _1"></span>5<span class="_ _1"></span>8<span class="_ _1"></span></div><div class="t m0 x0 h2 y55 ff2 fs1 fc0 sc0 ls2 ws5">12<span class="_ _33"> </span>Mind:<span class="_ _1b"> </span>the Puzzle<span class="_ _38"> </span>161</div><div class="t m0 x1 h3 y56 ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>2<span class="_ _1"></span>.<span class="_ _1"></span>1 A<span class="_ _1"></span>l<span class="_ _1"></span>l<span class="_ _3"></span>A<span class="_ _1"></span>b<span class="_ _1"></span>o<span class="_ _1"></span>u<span class="_ _1"></span>t<span class="_ _b"></span>M<span class="_ _1"></span>a<span class="_ _1"></span>x<span class="_ _1"></span>i<span class="_ _37"> </span>.........................<span class="_ _26"> </span>1<span class="_ _1"></span>6<span class="_ _1"></span>2<span class="_ _1"></span></div><div class="t m0 x1 h3 y57 ff1 fs1 fc0 sc0 ls2 ws3">12.2<span class="_ _e"> </span>Infants<span class="_ _7"> </span>track<span class="_ _7"> </span>false<span class="_ _7"> </span>beliefs<span class="_ _8"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>166</div><div class="t m0 x1 h3 y58 ff1 fs1 fc0 sc0 ls2 ws3">12.3<span class="_ _e"> </span>A<span class="_ _7"> </span>Replication<span class="_ _7"> </span>Challenge<span class="_ _20"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>169</div><div class="t m0 x1 h3 y59 ff1 fs1 fc0 sc0 ls2 ws5">12.4<span class="_ _e"> </span>Methodological Defects or Truly Contradictory Responses?<span class="_ _34"> </span>.<span class="_ _2f"> </span>170</div><div class="t m0 x1 h3 y5a ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>2<span class="_ _1"></span>.<span class="_ _1"></span>5 M<span class="_ _1"></span>o<span class="_ _1"></span>d<span class="_ _1"></span>e<span class="_ _1"></span>l<span class="_ _1"></span>s ..............................<span class="_ _26"> </span>1<span class="_ _1"></span>7<span class="_ _1"></span>3<span class="_ _1"></span></div><div class="t m0 x1 h3 y5b ff1 fs1 fc0 sc0 ls2 ws3">12.6<span class="_ _e"> </span>The<span class="_ _7"> </span>Mindreading<span class="_ _7"> </span>Puzzle<span class="_ _1a"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>175</div><div class="t m0 x0 h2 y5c ff2 fs1 fc0 sc0 ls2 wsd">13 <span class="ff3">�</span><span class="ws5">ree Levels of Analysis<span class="_ _39"> </span>177</span></div><div class="t m0 x1 h3 y5d ff1 fs1 fc0 sc0 ls2 ws3">13.1<span class="_ _e"> </span>T<span class="_ _d"></span>racking<span class="_ _7"> </span>Beliefs<span class="_ _7"> </span>without<span class="_ _7"> </span>Representing<span class="_ _7"> </span>Them?<span class="_ _e"> </span>. . . . . . . .<span class="_ _35"> </span>177</div><div class="t m0 x1 h3 y5e ff1 fs1 fc0 sc0 ls2 ws3">13.2<span class="_ _e"> </span>Altercentric<span class="_ _7"> </span>Interference<span class="_ _1d"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>178</div><div class="t m0 x1 h3 y5f ff1 fs1 fc0 sc0 ls2 ws3">13.3<span class="_ _e"> </span>Mirroring<span class="_ _7"> </span>beliefs?<span class="_ _27"> </span>. . . . . . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>180</div><div class="t m0 x1 h3 y60 ff1 fs1 fc0 sc0 ls2 ws3">13.4<span class="_ _e"> </span>Three<span class="_ _7"> </span>Levels<span class="_ _7"> </span>of<span class="_ _7"> </span>Analysis<span class="_ _3a"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>182</div><div class="t m0 x1 h3 y61 ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>3<span class="_ _1"></span>.<span class="_ _1"></span>5 T<span class="_ _2"></span>a<span class="_ _1"></span>s<span class="_ _1"></span>k<span class="_ _3"></span>A<span class="_ _1"></span>n<span class="_ _1"></span>a<span class="_ _1"></span>l<span class="_ _1"></span>y<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>s<span class="_ _17"> </span>..........................<span class="_ _26"> </span>1<span class="_ _1"></span>8<span class="_ _1"></span>4<span class="_ _1"></span></div><div class="t m0 x1 h3 y62 ff1 fs1 fc0 sc0 ls2 ws3">13.6<span class="_ _e"> </span>Selection<span class="_ _7"> </span>and<span class="_ _7"> </span>Inhibition<span class="_ _17"> </span>. . . . . . . . . . . . . . . . . . . . .<span class="_ _35"> </span>187</div><div class="t m0 x1 h3 y63 ff1 fs1 fc0 sc0 ls2 ws3">13.7<span class="_ _e"> </span>T<span class="_ _a"></span>oo<span class="_ _7"> </span>Much<span class="_ _7"> </span>Mindreading?<span class="_ _28"> </span>. . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>192</div><div class="t m0 x1 h3 y1b ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>3<span class="_ _1"></span>.<span class="_ _1"></span>8 W<span class="_ _1"></span>h<span class="_ _1"></span>a<span class="_ _1"></span>t<span class="_ _3"></span>N<span class="_ _1"></span>o<span class="_ _1"></span>w<span class="_ _1"></span>?<span class="_ _37"> </span>...........................<span class="_ _26"> </span>1<span class="_ _1"></span>9<span class="_ _1"></span>7<span class="_ _1"></span></div><div class="t m0 x4 h5 y1c ff1 fs3 fc0 sc0 ls2">vii</div><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:743.684000px;width:157.060000px;height:12.357000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:700.295000px;width:148.323000px;height:12.357000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:671.885000px;width:56.161000px;height:10.116000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:653.595000px;width:134.480000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:640.577000px;width:251.557000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:622.250000px;width:124.557000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:606.578000px;width:144.833000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:590.906000px;width:137.971000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:575.233000px;width:183.687000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:559.561000px;width:216.907000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:546.543000px;width:84.747000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:515.420000px;width:164.271000px;height:13.272000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:499.771000px;width:112.793000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:484.099000px;width:205.769000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:468.427000px;width:256.446000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:452.754000px;width:100.468000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:437.082000px;width:227.910000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:424.064000px;width:106.098000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:408.391000px;width:84.747000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:379.910000px;width:110.685000px;height:10.630000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:364.274000px;width:105.154000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:348.602000px;width:151.301000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:330.275000px;width:147.918000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:314.603000px;width:318.828000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:301.585000px;width:64.841000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:283.258000px;width:148.539000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:254.879000px;width:151.133000px;height:13.182000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:239.141000px;width:253.984000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:226.123000px;width:150.225000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:207.796000px;width:117.384000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:192.124000px;width:149.591000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:176.452000px;width:97.407000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:163.433000px;width:146.184000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:145.107000px;width:149.818000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:132.089000px;width:87.950000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
          <div id="pf4" class="pf w0 h0" data-page-no="4"><div class="pc pc4 w0 h0"><div class="t m0 x0 h2 y1d ff2 fs1 fc0 sc0 ls2 ws5">14<span class="_ _33"> </span>Mind:<span class="_ _1b"> </span>a Solution?<span class="_ _3b"> </span>199</div><div class="t m0 x1 h3 y64 ff1 fs1 fc0 sc0 ls2 ws3">14.1<span class="_ _e"> </span>Mindreading<span class="_ _7"> </span>Is<span class="_ _7"> </span>Sometimes<span class="_ _7"> </span>A<span class="_ _a"></span>utomatic . . . . . . . . . . . . .<span class="_ _1a"> </span>200</div><div class="t m0 x1 h3 y65 ff1 fs1 fc0 sc0 ls2 ws3">14.2<span class="_ _e"> </span>Mindreading<span class="_ _7"> </span>Is<span class="_ _7"> </span>Not<span class="_ _7"> </span>Always<span class="_ _7"> </span>A<span class="_ _a"></span>utomatic<span class="_ _16"> </span>. . . . . . . . . . . .<span class="_ _2f"> </span>201</div><div class="t m0 x1 h3 y66 ff1 fs1 fc0 sc0 ls2 ws3">14.3<span class="_ _e"> </span>A<span class="_ _7"> </span>Dual<span class="_ _7"> </span>Process<span class="_ _7"> </span>Theory<span class="_ _7"> </span>of<span class="_ _7"> </span>Mindreading<span class="_ _24"> </span>. . . . . . . . . . . .<span class="_ _1a"> </span>202</div><div class="t m0 x1 h3 y67 ff1 fs1 fc0 sc0 ls2 ws5">14.4<span class="_ _e"> </span>Speed–A<span class="_ _d"></span>ccuracy T<span class="_ _d"></span>rade-O<span class="ff4"></span><span class="ls0 wsf">s .................. 2<span class="_ _1"></span>0<span class="_ _1"></span>4<span class="_ _1"></span></span></div><div class="t m0 x1 h3 y68 ff1 fs1 fc0 sc0 ls2 ws3">14.5<span class="_ _e"> </span>What<span class="_ _7"> </span>Is<span class="_ _7"> </span>a<span class="_ _7"> </span>Model<span class="_ _7"> </span>of<span class="_ _7"> </span>Minds<span class="_ _7"> </span>and<span class="_ _7"> </span>Actions?<span class="_ _37"> </span>. . . . . . . . . . . .<span class="_ _2f"> </span>205</div><div class="t m0 x1 h3 y69 ff1 fs1 fc0 sc0 ls2 ws3">14.6<span class="_ _e"> </span>Minimal<span class="_ _7"> </span>Models<span class="_ _7"> </span>of<span class="_ _7"> </span>the<span class="_ _7"> </span>Mental<span class="_ _27"> </span>. . . . . . . . . . . . . . . . .<span class="_ _35"> </span>207</div><div class="t m0 x1 h3 y6a ff1 fs1 fc0 sc0 ls2 ws3">14.7<span class="_ _e"> </span>Signature<span class="_ _7"> </span>Limits<span class="_ _7"> </span>in<span class="_ _7"> </span>Mindreading<span class="_ _37"> </span>. . . . . . . . . . . . . . . .<span class="_ _1a"> </span>210</div><div class="t m0 x1 h3 y6b ff1 fs1 fc0 sc0 ls2 ws3">14.8<span class="_ _e"> </span>A<span class="_ _7"> </span>Developmental<span class="_ _7"> </span>Theory<span class="_ _7"> </span>of<span class="_ _7"> </span>Mindreading<span class="_ _26"> </span>. . . . . . . . . . .<span class="_ _2f"> </span>213</div><div class="t m0 x1 h3 y6c ff1 fs1 fc0 sc0 ls2 ws3">14.9<span class="_ _e"> </span>How<span class="_ _7"> </span>to<span class="_ _7"> </span>Solve<span class="_ _7"> </span>the<span class="_ _7"> </span>Mindr<span class="_ _d"></span>eading<span class="_ _7"> </span>Puzzle<span class="_ _33"> </span>. . . . . . . . . . . . .<span class="_ _1a"> </span>216</div><div class="t m0 x1 h3 y6d ff1 fs1 fc0 sc0 ls2 ws3">14.10<span class="_ _3c"> </span>T<span class="_ _a"></span>ask<span class="_ _7"> </span>Analysis<span class="_ _7"> </span>Revisited<span class="_ _33"> </span>. . . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>218</div><div class="t m0 x1 h3 y6e ff1 fs1 fc0 sc0 ls2 ws3">14.11<span class="_ _3c"> </span>Is<span class="_ _7"> </span>There<span class="_ _7"> </span>Core<span class="_ _3c"> </span>Knowledge<span class="_ _7"> </span>of<span class="_ _7"> </span>Minds? . . . . . . . . . . . . . .<span class="_ _1a"> </span>219</div><div class="t m0 x1 h3 y6f ff1 fs1 fc0 sc0 ls2 ws3">14.12<span class="_ _3c"> </span>Origins<span class="_ _7"> </span>of<span class="_ _7"> </span>Knowledge<span class="_ _7"> </span>of<span class="_ _7"> </span>Mind:<span class="_ _1b"> </span>Rediscovery<span class="_ _16"> </span>. . . . . . . . .<span class="_ _2f"> </span>219</div><div class="t m0 x0 h2 y70 ff2 fs1 fc0 sc0 ls2 ws5">15<span class="_ _33"> </span>Joint Action<span class="_ _3d"> </span>223</div><div class="t m0 x1 h3 y71 ff1 fs1 fc0 sc0 ls2 ws5">15.1<span class="_ _e"> </span>Joint Action vs Parallel but Mer<span class="_ _d"></span>ely Individual Actions<span class="_ _2c"> </span>.<span class="_ _22"> </span>.<span class="_ _22"> </span>.<span class="_ _22"> </span>.<span class="_ _35"> </span>224</div><div class="t m0 x1 h3 y72 ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>5<span class="_ _1"></span>.<span class="_ _1"></span>2 S<span class="_ _1"></span>h<span class="_ _1"></span>a<span class="_ _1"></span>r<span class="_ _1"></span>e<span class="_ _1"></span>d<span class="_ _3"></span>I<span class="_ _1"></span>n<span class="_ _1"></span>t<span class="_ _1"></span>e<span class="_ _1"></span>n<span class="_ _1"></span>t<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1f"></span>.........................<span class="_ _26"> </span>2<span class="_ _1"></span>2<span class="_ _1"></span>6<span class="_ _1"></span></div><div class="t m0 x1 h3 y73 ff1 fs1 fc0 sc0 ls2 ws3">15.3<span class="_ _e"> </span>Bratman<span class="_ _7"> </span>on<span class="_ _7"> </span>Shared<span class="_ _7"> </span>Intention<span class="_ _26"> </span>. . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>227</div><div class="t m0 x1 h3 y74 ff1 fs1 fc0 sc0 ls2 ws3">15.4<span class="_ _e"> </span>An<span class="_ _7"> </span>Inconsistent<span class="_ _7"> </span>T<span class="_ _d"></span>riad . . . . . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>228</div><div class="t m0 x1 h3 y75 ff1 fs1 fc0 sc0 ls2 ws3">15.5<span class="_ _e"> </span>Coordinating<span class="_ _7"> </span>Planning<span class="_ _3a"> </span>. . . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>231</div><div class="t m0 x1 h3 y76 ff1 fs1 fc0 sc0 ls2 ws3">15.6<span class="_ _e"> </span>Joint<span class="_ _7"> </span>Action<span class="_ _3c"> </span>in<span class="_ _7"> </span>the<span class="_ _7"> </span>First<span class="_ _7"> </span>Y<span class="_ _a"></span>ears<span class="_ _7"> </span>of<span class="_ _7"> </span>Life<span class="_ _20"> </span>. . . . . . . . . . . . .<span class="_ _1a"> </span>235</div><div class="t m0 x1 h3 y77 ff1 fs1 fc0 sc0 ls2 ws3">15.7<span class="_ _e"> </span>Collective<span class="_ _7"> </span>Goals<span class="_ _7"> </span>vs<span class="_ _7"> </span>Shared<span class="_ _7"> </span>Intentions<span class="_ _27"> </span>. . . . . . . . . . . . .<span class="_ _2f"> </span>239</div><div class="t m0 x1 h3 y78 ff1 fs1 fc0 sc0 ls2 ws3">15.8<span class="_ _e"> </span>Expectations<span class="_ _7"> </span>ab<span class="_ _11"></span>out<span class="_ _7"> </span>Collective<span class="_ _7"> </span>Goals<span class="_ _33"> </span>. . . . . . . . . . . . . .<span class="_ _1a"> </span>242</div><div class="t m0 x1 h3 y79 ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>5<span class="_ _1"></span>.<span class="_ _1"></span>9 C<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _1"></span>c<span class="_ _1"></span>l<span class="_ _1"></span>u<span class="_ _1"></span>s<span class="_ _1"></span>i<span class="_ _1"></span>o<span class="_ _1"></span>n<span class="_ _d"></span>............................<span class="_ _17"> </span>2<span class="_ _1"></span>4<span class="_ _1"></span>5<span class="_ _1"></span></div><div class="t m0 x0 h2 y7a ff2 fs1 fc0 sc0 ls2 ws5">16<span class="_ _33"> </span>Conclusion to Part II<span class="_ _3e"> </span>249</div><div class="t m0 x1 h3 y7b ff1 fs1 fc0 sc0 ls2 ws3">16.1<span class="_ _e"> </span>Dual<span class="_ _7"> </span>Process<span class="_ _7"> </span>Theories<span class="_ _1b"> </span>. . . . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>250</div><div class="t m0 x1 h3 y7c ff1 fs1 fc0 sc0 ls2 ws3">16.2<span class="_ _e"> </span>Pluralism<span class="_ _7"> </span>about<span class="_ _7"> </span>Mo<span class="_ _11"></span>dels<span class="_ _33"> </span>. . . . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>251</div><div class="t m0 x1 h3 y7d ff1 fs1 fc0 sc0 ls2 ws3">16.3<span class="_ _e"> </span>Goal<span class="_ _7"> </span>T<span class="_ _d"></span>racking<span class="_ _7"> </span>Is<span class="_ _7"> </span>the<span class="_ _7"> </span>Foundation . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>252</div><div class="t m0 x1 h3 y7e ff1 fs1 fc0 sc0 ls2 ws3">16.4<span class="_ _e"> </span>When<span class="_ _7"> </span>Joint<span class="_ _7"> </span>Action<span class="_ _3c"> </span>Enables<span class="_ _7"> </span>Goal<span class="_ _7"> </span>Tracking<span class="_ _2f"> </span>. . . . . . . . . .<span class="_ _2f"> </span>253</div><div class="t m0 x1 h3 y7f ff1 fs1 fc0 sc0 ls2 ws5">16.5<span class="_ _e"> </span>Joint Action and the De<span class="_ _d"></span>velopmental Emergence of Knowledge 255</div><div class="t m0 x0 h4 y80 ff2 fs2 fc0 sc0 ls2 ws10">Conclusion 259</div><div class="t m0 x0 h2 y81 ff2 fs1 fc0 sc0 ls2 wsd">17 Conclusion<span class="_ _3f"> </span>259</div><div class="t m0 x1 h3 y82 ff1 fs1 fc0 sc0 ls2 ws3">17.1<span class="_ _e"> </span>Infants<span class="_ _7"> </span>Rely<span class="_ _7"> </span>on<span class="_ _7"> </span>Minimal<span class="_ _7"> </span>Models<span class="_ _7"> </span>…<span class="_ _34"> </span>. . . . . . . . . . . . . . .<span class="_ _2f"> </span>260</div><div class="t m0 x1 h3 y83 ff1 fs1 fc0 sc0 ls2 ws3">17.2<span class="_ _e"> </span>…<span class="_ _7"> </span>As<span class="_ _3c"> </span>Do<span class="_ _7"> </span>Adults,<span class="_ _7"> </span>Sometimes<span class="_ _35"> </span>. . . . . . . . . . . . . . . . . .<span class="_ _35"> </span>261</div><div class="t m0 x1 h3 y84 ff1 fs1 fc0 sc0 ls0 wse">1<span class="_ _1"></span>7<span class="_ _1"></span>.<span class="_ _1"></span>3 P<span class="_ _1"></span>u<span class="_ _1"></span>z<span class="_ _1"></span>z<span class="_ _1"></span>l<span class="_ _1"></span>e<span class="_ _1"></span>s<span class="_ _3"></span>M<span class="_ _1"></span>a<span class="_ _1"></span>t<span class="_ _1"></span>t<span class="_ _1"></span>e<span class="_ _1"></span>r..........................<span class="_ _26"> </span>2<span class="_ _1"></span>6<span class="_ _1"></span>2<span class="_ _1"></span></div><div class="t m0 x1 h3 y85 ff1 fs1 fc0 sc0 ls2 ws3">17.4<span class="_ _e"> </span>Linking<span class="_ _7"> </span>Problems<span class="_ _3c"> </span>Ab<span class="_ _11"></span>ound<span class="_ _16"> </span>. . . . . . . . . . . . . . . . . . .<span class="_ _1a"> </span>263</div><div class="t m0 x1 h3 y86 ff1 fs1 fc0 sc0 ls2 ws3">17.5<span class="_ _e"> </span>Core<span class="_ _3c"> </span>Knowledge<span class="_ _7"> </span>Isn’t<span class="_ _7"> </span>What<span class="_ _7"> </span>Y<span class="_ _a"></span>ou<span class="_ _7"> </span>Think<span class="_ _7"> </span>It<span class="_ _7"> </span>Is<span class="_ _17"> </span>. . . . . . . . . .<span class="_ _35"> </span>264</div><div class="t m0 x1 h3 y87 ff1 fs1 fc0 sc0 ls2 ws3">17.6<span class="_ _e"> </span>How<span class="_ _3c"> </span>to<span class="_ _7"> </span>Solve<span class="_ _7"> </span>Linking<span class="_ _7"> </span>Problems<span class="_ _3a"> </span>. . . . . . . . . . . . . . . .<span class="_ _1a"> </span>265</div><div class="t m0 x1 h3 y42 ff1 fs1 fc0 sc0 ls2 ws3">17.7<span class="_ _e"> </span>Representation:<span class="_ _40"> </span>Handle<span class="_ _7"> </span>with<span class="_ _7"> </span>Care<span class="_ _15"> </span>. . . . . . . . . . . . . . .<span class="_ _1a"> </span>266</div><div class="t m0 x5 h5 y1c ff1 fs3 fc0 sc0 ls2">viii</div><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:743.720000px;width:115.048000px;height:10.630000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:726.292000px;width:213.551000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:711.483000px;width:218.298000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:696.674000px;width:221.047000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:681.865000px;width:165.767000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:669.710000px;width:222.673000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:654.901000px;width:177.387000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:637.438000px;width:188.338000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:622.629000px;width:231.879000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:607.820000px;width:213.719000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:593.011000px;width:145.012000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:578.202000px;width:205.015000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:563.393000px;width:243.806000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:536.901000px;width:85.690000px;height:12.220000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:521.578000px;width:291.236000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:509.423000px;width:111.155000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:494.614000px;width:171.744000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:479.805000px;width:135.950000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:462.342000px;width:141.282000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:448.268000px;width:208.064000px;height:12.376000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:435.378000px;width:211.698000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:417.915000px;width:205.171000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:405.760000px;width:84.747000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:378.831000px;width:133.104000px;height:10.517000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:363.944000px;width:138.246000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:349.135000px;width:144.977000px;height:10.457000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:331.672000px;width:187.477000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:316.863000px;width:234.473000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:302.054000px;width:332.828000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:262.823000px;width:76.133000px;height:12.221000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:235.716000px;width:81.709000px;height:10.630000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:218.289000px;width:198.093000px;height:13.111000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:204.681000px;width:165.504000px;height:11.910000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:191.325000px;width:101.436000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:173.862000px;width:157.888000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:159.053000px;width:240.845000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:144.244000px;width:184.213000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:129.435000px;width:195.770000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
          <div id="pf5" class="pf w0 h0" data-page-no="5"><div class="pc pc5 w0 h0"><div class="t m0 x1 h3 y1d ff1 fs1 fc0 sc0 ls2 ws3">17.8<span class="_ _e"> </span>Inferential<span class="_ _3c"> </span>and<span class="_ _7"> </span>Intentional<span class="_ _7"> </span>Isolation<span class="_ _27"> </span>. . . . . . . . . . . . . .<span class="_ _35"> </span>267</div><div class="t m0 x1 h3 y88 ff1 fs1 fc0 sc0 ls2 ws3">17.9<span class="_ _e"> </span>Rediscovery<span class="_ _7"> </span>Is<span class="_ _7"> </span>Joint<span class="_ _7"> </span>Action<span class="_ _2c"> </span>. . . . . . . . . . . . . . . . . . .<span class="_ _2f"> </span>268</div><div class="t m0 x0 h2 y89 ff2 fs1 fc0 sc0 ls2 ws11">Glossary 271</div><div class="t m0 x3 h5 y1c ff1 fs3 fc0 sc0 ls2">ix</div><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:743.756000px;width:203.497000px;height:10.456000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" '><div class="d m1" style="border-style:none;position:absolute;left:130.322000px;bottom:726.656000px;width:162.276000px;height:13.110000px;background-color:rgba(255,255,255,0.000001);"></div></span ><span class="l" ><div class="d m1" style="border-style:none;position:absolute;left:112.390000px;bottom:700.320000px;width:49.442000px;height:13.183000px;background-color:rgba(255,255,255,0.000001);"></div></span ></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
        </div>
      </div>
    </div>
  </body>
</html>