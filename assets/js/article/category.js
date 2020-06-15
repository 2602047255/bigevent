$(function() {
    var form = layui.form, layer = layui.layer

    /**
     * 获取文章分类列表的请求
    */
    function getCategory() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                // 使用模板引擎将数据渲染到页面
                var html = template('categoryTpl', res)
                $('#category').html(html)
            }
        })
    }
    getCategory()

    /**
     * 显示添加分类弹出层
    */
   var addDialog = null
    $('#addCategory').on('click', function() {
        addDialog = layer.open({
            type: 1,
            area: ['400px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    /**
     * 发送添加文章分类的请求
    */
    $('body').on('submit', '#addForm', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 关闭添加分类弹出层
                layer.close(addDialog)
                getCategory()
            }
        })
    })

    /**
     * 显示编辑分类弹出层
    */
    var editDialog = null
    $('#category').on('click', '#editCategory', function(){
        // 获取当前点击项的 id
        var id = $(this).attr('data-index')

        editDialog = layer.open({
            type: 1,
            area: ['400px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        })

        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'GET',
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    /**
     * 发送编辑文章分类的请求
    */
    $('body').on('submit', '#editForm', function(e) {
        e.preventDefault()
        $.ajax({
            url: "/my/article/updatecate",
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                layer.close(editDialog)
                getCategory()
            }
        })
    })

    /**
     * 发送删除文章分类的请求
    */
    $('#category').on('click', '#delCategory', function(){
        var id = $(this).attr('data-index')
        layer.confirm('是否要执行当前操作？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'GET',
                success: function(res) {
                    if(res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    layer.close(index);
                    getCategory()
                }
            })
        });
    })
})