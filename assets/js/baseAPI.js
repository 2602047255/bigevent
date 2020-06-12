/**
 * 每次发送 ajax 请求之前，都会先调用该函数
 * 里面的信息是给 ajax 提供的配置对象
*/
$.ajaxPrefilter(function(options) {
    // 请求路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})