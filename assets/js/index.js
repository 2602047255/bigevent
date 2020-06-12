$(function() {
    getUserInfo()

    var layer = layui.layer

    /**
     * 退出登录
    */
    $('#logout').on('click', function() {
        // 弹出框
        layer.confirm('是否退出登录？', {icon: 3, title:'提示'}, function(index){
            // 移除 token，并跳转到登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'

            // 关闭弹出框
            layer.close(index);
        });
    })
})

/**
 * 获取用户基本信息请求
*/
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function(res) {
            if(res.status !== 0) return layui.layer.msg(res.message)
            renderAvatar(res.data)
        }
    })
}

/**
 * 渲染用户头像
*/
function renderAvatar(user){
    // 渲染用户名称
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 按需渲染用户头像
    var pic = user.user_pic
    if(pic !== null) {
        $('.layui-nav-img').attr('src', pic).show()
        $('.text-avatar').hide()
    } else {
        // 将用户名称的第一个字符作为用户头像
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}