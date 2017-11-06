/**
 * Created by lhz on 2017/10/11
 *
 * 运单导入操作
 */
read_excell();
function read_excell(filename){//导入
    $('#excell-file').on('change', function(e){
        var files = e.target.files;
        if(files[0].name != '运单字段（新版）(1).xlsx'){
            layer.msg('文件选择错误,请点击上方下载标准模板');
            return;
        }
        var fileReader = new FileReader();
        $('#ifNodata').hide();
        $('#file-name').html(files[0].name);
        fileReader.onload = function(ev){
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    }),//以二进制流的方式读取整份excell表格对象
                    persons = []; //存储获取到的数据
            }catch (e){
                alert('文件类型不正确');
                return;
            }

            //表格的表格范围，可用于判断表头数量是否正确
            var fromTo = '';
            //遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if(workbook.Sheets.hasOwnProperty(sheet)){
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    // break;   // 如果只取第一张表，就取消注释这行
                }
            }
            tableRender(persons);
            $('.import-data-number').html(persons.length);
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
        document.getElementById("myForm").reset();
    })
}

/*table操作*/
function tableRender (dataArr){
    layui.use('table',function() {
        var table = layui.table;
        table.render({
            elem: '#demo'
            ,data:dataArr
//                ,height: '100%'
            ,cols: [[ //标题栏
                {edit: 'text', field: '运单编号', title: '运单编号', width: 100, fixed: true}
                ,{edit: 'text', field: '始发站', title: '始发站', width: 100}
                ,{edit: 'text', field: '到站', title: '到站', width: 100}
                ,{edit: 'text', field: '目的地', title: '目的地', width: 100}
                ,{edit: 'text', field: '录单员', title: '录单员', width: 100}
                ,{edit: 'text', field: '托运时间', title: '托运时间', width: 100}
                ,{edit: 'text', field: '客户名称', title: '客户名称', width: 100}
                ,{edit: 'text', field: '客户编码', title: '客户编码', width: 100}
                ,{edit: 'text', field: '客户地址', title: '客户地址', width: 100}
                ,{edit: 'text', field: '客户联系方式', title: '客户联系方式', width: 100}
                ,{edit: 'text', field: '行业类别', title: '行业类别', width: 100}
                ,{edit: 'text', field: '名称', title: '名称', width: 100}
                ,{edit: 'text', field: '手机', title: '手机', width: 100}
                ,{edit: 'text', field: '省市区', title: '省市区', width: 100}
                ,{edit: 'text', field: '地址', title: '地址', width: 100}
                ,{edit: 'text', field: '服务方式', title: '服务方式', width: 100}
                ,{edit: 'text', field: '承运人', title: '承运人', width: 100}
                ,{edit: 'text', field: '运输方式', title: '运输方式', width: 100}
                ,{edit: 'text', field: '运输天数', title: '运输天数', width: 100}
                ,{edit: 'text', field: '是否返单', title: '是否返单', width: 100}
                ,{edit: 'text', field: '返单要求', title: '返单要求', width: 100}
                ,{edit: 'text', field: '付费方式', title: '付费方式', width: 100}
                ,{edit: 'text', field: '保险费', title: '保险费', width: 100}
                ,{edit: 'text', field: '包装费', title: '包装费', width: 100}
                ,{edit: 'text', field: '装卸费', title: '装卸费', width: 100}
                ,{edit: 'text', field: '办单费', title: '办单费', width: 100}
                ,{edit: 'text', field: '客户单号', title: '客户单号', width: 100}
                ,{edit: 'text', field: '序号', title: '序号', width: 100}
                ,{edit: 'text', field: '品名', title: '品名', width: 100}
                ,{edit: 'text', field: '型号', title: '型号', width: 100}
                ,{edit: 'text', field: '件数', title: '件数', width: 100}
                ,{edit: 'text', field: '包装', title: '包装', width: 100}
                ,{edit: 'text', field: '重量（吨）', title: '重量（吨）', width: 100}
                ,{edit: 'text', field: '体积（立方）', title: '体积（立方）', width: 100}
                ,{edit: 'text', field: '保价金额', title: '保价金额', width: 100}
                ,{edit: 'text', field: '计费方式', title: '计费方式', width: 100}
                ,{edit: 'text', field: '运价', title: '运价', width: 100}
            ]]
            ,skin: 'row' //表格风格
            ,even: true
            ,page: true //是否显示分页
            ,limits: [10, 15, 20]//自定义每页条数
            ,limit: 15 //每页默认显示的数量
        })
        InfotoSubmit(dataArr);
    })
}
/*提交操作*/
function InfotoSubmit(dataArr){
    $('.toSubmit').unbind().on('click', function() {
        console.log(dataArr);
        $('.no-data-copy').html('提交成功');
        // $('#ifNodata').show();
        EasyAjax.ajax_Post_Json({
                url: 'http://172.16.250.27:8080/kylin/transport/convey/insert/save/batch',
                data: dataArr
            },
            function (data) {
                console.log(data);
            });
    })
}
