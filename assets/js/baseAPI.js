/**
 * 每次发送 ajax 请求之前，都会先调用该函数
 * 里面的信息是给 ajax 提供的配置对象
*/
$.ajaxPrefilter(function(options) {
    // 设置请求路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 设置请求头
    if(options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 设置 complete 回调函数，该函数无论请求成功与否都会被执行
    options.complete = function(res) {
        // 当用户未登录进入首页时，强制跳转到登录页面
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})