$(function() {
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    /**
     * 选择图片
    */
    $('#chooseImage').on('click', function() {
        $('#file').click()
    })

    /**
     * 获取图片路径
    */
    $('#file').on('change', function(e) {
        var fileList = e.target.files
        if(fileList.length === 0) return layer.msg('请选择图片')

        // 获取用户选择的图片
        var file = e.target.files[0]
        // 将图片转换成路径
        var imgURL = URL.createObjectURL(file)
        // 初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)     // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    /**
     * 发送上传图片的请求
    */
    $('#upload').on('click', function() {
        // 将图片转换为 base64 格式
        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        
        $.ajax({
            url: '/my/update/avatar',
            method: 'POST',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // index 页面的 getUserInfo() 方法
                window.parent.getUserInfo()
            }
        })
    })
})