/**
 * Created by 胡东斌 on 2017/7/31.
 */

var poemObj = {
   wutiSushi:{
      title:'无题',
       author:'苏轼',
       content:'十八新娘八十郎、苍苍白发对红妆、鸳鸯被里成双夜、一树梨花压海棠'
   }
}

$(function() {
   $('#sushi-wuti').click(function() {
       modalBuild(poemObj.wutiSushi);
   });
});

function modalBuild(poemContent) {
    $('#poemTitle').text('');
    $('#poemContent').text('');
    var title = poemContent.title + '&nbsp;' + '<small>'+ poemContent.author +'</small>';
    var content = '<p>' + poemContent.content.replace(/、/g,'<br>') + '</p>';
    $('#poemTitle').html(title);
    $('#poemContent').html(content);
    $('#poemInfo').modal('show');
}