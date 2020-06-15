$(function() {
    var form = layui.form, layer = layui.layer

    // 初始化富文本编辑器
    initEditor()

    /**
     * 获取文章分类的请求
    */
    function getCategroy() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                var html = template('categoryTpl', res)
                $('#cate').html(html)
                form.render()
            }
        })
    }
    getCategroy()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    /**
     * 选择封面
    */
    $('#chooseImage').on('click', function() {
        $('#coverFile').click()
    })

    /**
     * 获取图片路径
    */
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
        if(files.length === 0) return
        
        // 图片路径
        var newImgURL = URL.createObjectURL(files[0])
        // 预览封面图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    /**
     * 如果点击的是存为草稿按钮，就将文章状态改成 “草稿”
    */
    var art_state = '已发布'
    $('#draft').on('click', function() {
        art_state = '草稿'
    })

    /**
     * 发送添加文章的请求
    */
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        var formData = new FormData($(this)[0])
        // 将文章状态追加到 FormData 对象里面
        formData.append('state', art_state)
        // 将封面图片，输出为文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 将文件对象追加到 FormData 对象里面
            formData.append('cover_img', blob)
            publishArticle(formData)
        })
    })
    // 发布文章
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                location.href = '/article/list.html'
            }
        })
    }
})