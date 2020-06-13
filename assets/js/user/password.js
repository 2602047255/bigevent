$(function() {
    var form = layui.form
    var layer = layui.layer

    /**
     * 自定义表单验证
    */
    form.verify({
        password: [/^[\S]{6,12}$/, '密码必须6~12位，且不能出现空格'],
        samePassword: function(value) {
            var oldPwdValue = $('.layui-form [name=oldPwd]').val()
            if(value === oldPwdValue) return '新旧密码不能相同'
        },
        rePassword: function(value) {
            var newPwdValue = $('.layui-form [name=newPwd]').val()
            if(value !== newPwdValue) return '两次输入的密码不一致'
        }
    })

    /**
     * 发送修改密码的请求
    */
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/updatepwd',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})