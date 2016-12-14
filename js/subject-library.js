/*��ʾ�������*/
;$('.form_datetime').datetimepicker({
        //language:  'fr',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
    });
$('.form_date').datetimepicker({
    language:  'fr',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
});
$('.form_time').datetimepicker({
    language:  'fr',
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 1,
    minView: 0,
    maxView: 1,
    forceParse: 0
});

var deleteSubject = [],
    subject = [],
    index,
    _this,
    whichDelete = 0;

/*������Ŀ*/

function updateSubject(){
    $('#subject > tbody').children().remove('*');
    $.ajax({
        method: 'post',
        url: 'http://localhost:2332/',
        data: null,
        contentType: 'plain',
        success: function(rel){
            subject = [];
            for(var i = 0;i < rel.length;i ++){
                var s = new sub();
                s.id = rel[i]._id;
                s.content = rel[i].content;
                s.time = rel[i].time;
                s.type = rel[i].type;
                subject.push(s);
            }
            insert();
        },
        error: function(rel){
            console.log(rel);
        }
    });
}

function insert(){
    $('#subject>tbody').html("");
    for(var i = 0;i < subject.length;i ++){
        var oTr = $('#subject>tbody').append('<tr></tr>');
        oTr.children(':last-child').append('<td><div class = "checkbox f-l col-md-12 top-m-0"><label for="checkbox'+i+'"><input type="checkbox" id="checkbox'+i+'">'+(i+1)+'</label></div></td><td>'+subject[i].content+'</td><td>'+subject[i].type+'</td><td>'+subject[i].time+'</td><td class="color-primary"><a href="javascript:void(0);">delete</a>/<a href="javascript:void(0);">lead</a></td>');
    }
}
/*��ʾ��*/
function display(obj){
    obj.addClass('top-display-b');        //��ʾ������
    obj.addClass('fade');
    obj.addClass('in');
}
/*���ؿ�*/
function hidden(obj){
    obj.removeClass('top-display-b');        //��ʾ������
    obj.removeClass('fade');
    obj.removeClass('in');
}
/*��Ŀ��Ϣ*/
function sub(){
    this.id = "";
    this.content = "";
    this.time = "";
    this.type = "";
}
/*��ʽ������*/
Date.prototype.Format=function() {
    var year = this.getFullYear();
    var month = this.getMonth()+1; //�·�
    var day = this.getDate(); //��
    return year + "-" + month + "-" + day;
}

window.onload = function () {

    updateSubject();         //������Ŀ����

    $('.select-subject').find('input').val($('.select-subject ul').find('li > a').eq(0).html());
    /*�������ѡ��γ�������*/
    $('.select-subject').find('button').click(function (event) {
        event.stopPropagation();
        $(this).siblings('ul').toggleClass('top-display-b');
    });
    $('body').click(function () {
        $('.select-subject').find('ul').removeClass('top-display-b');
    });
    $('.select-subject').find('ul > li').click(function () {
        $(this).parent().parent().siblings('input').val($(this).find('a').html());

    });

    $('.select-subject').eq(0).find('ul > li').click(function(){
        var typeValue = $('#type').val();
        $.ajax({
            method: 'post',
            url: 'http://localhost:2332/type',
            contentType: 'text/plain',
            data: typeValue,
            success: function (rel) {
                subject = [];
                for(var i = 0;i < rel.length;i ++){
                    var s = new sub();
                    s.content = rel[i].content;
                    s.time = rel[i].time;
                    s.type = rel[i].type;
                    subject.push(s);
                }
                insert();
            },
            error: function () {
                console.log('error');
            }
        });
    });

    /*�����Ŀ��ť��Ч*/
    $('#topic-add-btn').click(function () {
        $('#topic-add-subject').find('textarea').val("");
        display($('#topic-add-subject'));
    });

    /*�رհ�ť��Ч*/
    $('button.close').click(function () {
        $(this).parent().parent().parent().parent().removeClass('top-display-b');
    });

    /*�������*/
    $('#topic-adda-btn').click(function () {
        display($('#topic-adda-subject'));
    });

    /*����γ�*/
    $('#topic-lead-btn').click(function () {
        deleteSubject = [];
        for (var i = 0; i < $('input[type="checkbox"]').not($('#check-all')).size(); i++) {
            if ($('input[type="checkbox"]').not($('#check-all')).eq(i).is(':checked')) {
                deleteSubject.push(subject[i]);
            }
        }
        if (deleteSubject.length != 0){
            display($('#topic-lead-subject'));
            console.log(deleteSubject.length);
        }

        else
            display($('#topic-error'));
    });

    /*ɾ���γ�*/
    $('#topic-delete-btn').click(function () {
        deleteSubject = [];
        for (var i = 0; i < $('input[type="checkbox"]').not($('#check-all')).size(); i++) {
            if ($('input[type="checkbox"]').not($('#check-all')).eq(i).is(':checked')) {
                deleteSubject.push(subject[i]);
            }
        }
        if (deleteSubject.length != 0)
            display($('#topic-delete-subject'));
        else
            display($('#topic-error'));
    });

    /*ȫѡ/��ѡ����*/
    $('#check-all').click(function () {
        $('input[type = "checkbox"]').not($('#check-all').find('input')[0]).prop('checked', $(this).is(':checked'));
    });

    /*����ɾ��������Ч*/
    $('#subject').on('click', 'a:even', function () {
        deleteSubject = [];
        var deleteS = subject[$(this).parent().parent().index()]
        deleteSubject.push(deleteS);
        display($('#topic-delete-subject'));
        whichDelete = 1;
    });

    /*�������빦����Ч*/
    $('#subject').on('click', 'a:odd', function () {
        display($('#topic-lead-subject'));
        deleteSubject = [];
        var deleteS = subject[$(this).parent().parent().index()]
        deleteSubject.push(deleteS);
        whichDelete = 1;
        //������ȷ������deleteEle�е�ɾ��
    });

    /*���ȡ��*/
    $('.modal-footer').find('button:odd').click(function () {
        hidden($(this).parent().parent().parent().parent());
        deleteSubject = [];
    });

    /*�����Ŀ�������������*/
    $('#topic-add-subject .modal-footer').find('button').eq(0).click(function () {
        if ($(this).parent().parent().find('textarea').val() != "") {
            var s = new sub();
            s.content = $(this).parent().parent().find('textarea').val();
            s.time = new Date().Format();
            s.type = $(this).parent().parent().find('input').val();
        //    subject.push(s);
        //    updateSubject();
        }
        hidden($(this).parent().parent().parent().parent());

        $.ajax({
            method: 'post',
            url: 'http://localhost:2332/add',
            contentType: 'application/json',
            data: JSON.stringify({
                content: s.content,
                time: s.time,
                type: s.type
            }),
            success: function () {
                updateSubject();
            },
            error: function () {
                console.log('error');
            }
        });
    });

    /*������Ӳ��������ȷ��*/
    $('#topic-adda-subject .modal-footer').find('button').eq(0).click(function () {
        hidden($(this).parent().parent().parent().parent());
    });

    /*������������ȷ��*/
    $('#topic-lead-subject .modal-footer').find('button').eq(0).click(function () {
        if(!whichDelete){
            deleteSubject = [];
            var checkbox = $('#subject').find('input[type=checkbox]');
            for(var i = 0;i < checkbox.length;i ++){
                if(checkbox.eq(i).is(':checked')){
                    deleteSubject.push(subject[checkbox.eq(i).parent().parent().parent().parent().index()]);
                }
            }
        }
        var typeChange = $('#topic-lead-subject').find('input').val();
        console.log(deleteSubject);
        hidden($(this).parent().parent().parent().parent());
        $.ajax({
            method: 'post',
            url: 'http://localhost:2332/lead',
            data:JSON.stringify({
                leadSubject: deleteSubject,
                typeChange: typeChange,
                timeChange: new Date().Format()
            }),
            contentType: 'application/json',
            success: function(rel){
                updateSubject();
            },
            error: function(){
                console.log('lead error');
            }
        });
    });

    /*ɾ������,���ȷ��*/
    $('#topic-delete-subject .modal-footer').find('button').eq(0).click(function () {
        if(!whichDelete){
            deleteSubject = [];
            var checkbox = $('#subject').find('input[type=checkbox]');
            for(var i = 0;i < checkbox.length;i ++){
                if(checkbox.eq(i).is(':checked')){
                    deleteSubject.push(subject[checkbox.eq(i).parent().parent().parent().parent().index()]);
                }
            }
        }
        hidden($(this).parent().parent().parent().parent());
        $.ajax({
            method: 'post',
            url: 'http://localhost:2332/delete',
            data: JSON.stringify({
                delete: deleteSubject,
            }),
            contentType: 'application/json',
            success: function(rel){
                updateSubject();
            },
            error: function(){
                console.log('delete error');
            }
        });
        whichDelete = 0;
    });

    /*������ʾ�򣬵��ȷ������*/
    $('#topic-error .modal-footer').find('button').click(function () {
        hidden($('#topic-error'));
    });

    /*������Ŀ�����޸Ŀ�*/
    $('#subject').on('click','tr td:nth-child(2)',function(){
        $('#topic-modify-subject').find('textarea').val($(this).html());
        display($('#topic-modify-subject'));

        index = $(this).parent().index();
        _this = this;
    });

    /*���ȷ��,�޸���Ŀ*/
    $('#topic-modify-subject .modal-footer').find('button').eq(0).click(function () {
        _this.innerHTML = $('#topic-modify-subject').find('textarea').val();
        subject[index].content = $(this).parent().parent().find('textarea').html();
        hidden($(this).parent().parent().parent().parent());
    });

    $('#topic-page').find('li:eq(0)').addClass('disabled');
    $('#topic-page').find('li:eq(1)').addClass('active');

};




