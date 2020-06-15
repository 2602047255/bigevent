$(function() {
    var form = layui.form
    var layer = layui.layer

    /**
     * 自定义表单验证
    */
    form.verify({
        nickname: function(value) {
            if(value.length > 6)  return '昵称长度不能超过6个'
        }
    })

    /**
     * 获取用户信息的请求
    */
    function getUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                // 快速为表单赋值
                form.val('userInfo_form', res.data)
            }
        })
    }
    getUserInfo()

    /**
     * 重置表单数据
    */
    $('#reset').on('click', function(e) {
        e.preventDefault()
        getUserInfo()
    })

    /**
     * 发送修改用户信息的请求
    */
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 调用 index 页面的 getUserInfo() 方法
                window.parent.getUserInfo()
            }
        })
    })
})