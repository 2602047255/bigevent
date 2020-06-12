$(function() {
    /**
     * 登录与注册的切换
    */
    $('#register').on('click', function() {
        $('.login').hide().siblings('.register').show()
    })
    $('#login').on('click', function() {
        $('.register').hide().siblings('.login').show()
    })

    /**
     * 自定义表单验证
    */
    var form = layui.form
    form.verify({
        password:  [/^[\S]{6,12}$/, '密码长度必须是6~12位，且不能出现空格'],
        repassword: function(value) {
            var passwordValue = $('.register [name=password]').val()
            if(value !== passwordValue) {
                return '两次输入的密码不一致'
            }
        }
    })

    var layer = layui.layer

    /**
     * 发送用户注册的请求
    */
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/reguser',
            method: 'POST',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                $('#login').click()
            }
        })
    })

    /**
     * 发送用户登录的请求
    */
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                // 将 token 保存到 locaStorage
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})