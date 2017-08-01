/**
 * Created by 胡东斌 on 2017/7/31.
 */

var poemObj = {
    wutiSushi: {
        title: '无题',
        author: '苏轼',
        content: '十八新娘八十郎、苍苍白发对红妆、鸳鸯被里成双夜、一树梨花压海棠',
        size:'sm'
    },
    yijianmeiTangyin: {
        title: '一剪梅·雨打梨花深闭门',
        author: '唐寅',
        content: '红满苔阶绿满枝，杜宇声声，杜宇声悲！交欢未久又分离，彩凤孤飞，彩凤孤栖、别后相思是几时？后会难知？后会难期？此情何以表相思？一首情词，一首情诗、雨打梨花深闭门，忘了青春，误了青春。赏心乐事共谁论？花下销魂，月下销魂、愁聚眉峰尽日颦，千点啼痕，万点啼痕。晓看天色暮看云，行也思君，坐也思君',
        size:'lg'
    }
}

$(function() {
    
    for(prop in poemObj) {
        var html = tableBuild(prop,poemObj[prop]);
        $('.poem-tbody').append(html);
    }
    
    $('body').on('click','.check-info',function() {
        var idName = $(this).attr('id')
        var modalSize = 'modal-' + poemObj[idName].size;
        $('.modal-dialog').removeClass('modal-lg modal-sm').addClass(modalSize);
        modalBuild(poemObj[idName]);
    });
});

function modalBuild(poemContent) {
    $('#poemTitle').text('');
    $('#poemContent').text('');
    var title = poemContent.title + '&nbsp;' + '<small>' + poemContent.author + '</small>';
    var content = '<p>' + poemContent.content.replace(/、/g, '<br>') + '</p>';
    $('#poemTitle').html(title);
    $('#poemContent').html(content);
    $('#poemInfo').modal('show');
}

function tableBuild(prop, propObj) {
    var html = '';
    html = ['<tr>',
        '<td>' + propObj.title + '</td>',
        '<td>' + propObj.author + '</td>',
        '<td>',
        '<button type="button" class="btn btn-sm btn-info check-info" id="' + prop + '">查看</button>',
        '</td>',
        '</tr>'].join("");
    return html;
}