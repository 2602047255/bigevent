$(function() {
    var form = layui.form, layer = layui.layer, laypage = layui.laypage

    // 查询参数对象
    var query = {
        pagenum: 1,     // 页码值
        pagesize: 5,    // 一页显示条数
        cate_id: '',    // 文章分类 ID
        state: ''       // 文章发布状态
    }

    /**
     * 自定义时间格式
    */
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = zero(dt.getMonth() + 1)
        var d = zero(dt.getDate())

        var h = zero(dt.getHours())
        var i = zero(dt.getMinutes())
        var s = zero(dt.getSeconds())

        return `${y}-${m}-${d} ${h}:${i}:${s}`
    }

    /**
     * 自动补零
    */
    function zero(n) {
        return n <= 9 ? `0${n}` : n
    }

    /**
     * 获取文章列表的请求
    */
    function getNewsList() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: query,
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                var html = template('newslistTpl', res)
                $('#newsList').html(html)
                // 调用分页渲染函数
                renderPage(res.total)
            }
        })
    }
    getNewsList()

    /**
     * 获取文章分类的请求
    */
    function getCategory() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if(res.status !== 0) return layer.msg(res.message)
                var html = template('categoryTpl', res)
                $('[name=cate_id]').html(html)
                // 重新渲染表单结构
                form.render()
            }
        })
    }
    getCategory()

    /**
     * 发起筛选的请求
    */
    $('#searchForm').on('submit', function(e) {
        e.preventDefault()

        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        query.cate_id = cate_id
        query.state = state

        getNewsList()
    })

    /**
     * 分页渲染
    */
    function renderPage(total) {
        // 渲染分页的 UI 结构
        laypage.render({
            elem: 'page',           // 分页 UI 的容器
            count: total,           // 总数据长度
            limit: query.pagesize,  // 每页显示条数
            curr: query.pagenum,    // 当前被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],     // 自定义分页排版
            limits: [5, 10, 15, 20],             // 配置 layout 中的 limit 选项的值
            // 分页切换时，触发的函数
            jump: function(obj, first) {
                // 分页切换时，将最新的页码值，赋值给 query 中的 pagenum 参数
                query.pagenum = obj.curr
                // 每页显示条数切换时，将最新的每页显示条数，赋值给 query 中的 pagesize 参数
                query.pagesize = obj.limit
                // 重新渲染文章列表数据
                if(!first) getNewsList()
            }
        })
    }

    /**
     * 发送删除文章列表的请求
    */
    $('#newsList').on('click', '.del', function() {
        var len = $('.del').length
        var id = $(this).attr('data-index')

        layer.confirm('是否要执行当前操作？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'GET',
                success: function(res) {
                    if(res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    // 判断当前分页的显示条数，如果当前分页的显示条数没有数据，则让页码值 -1，再重新渲染文章列表数据
                    if(len === 1) {
                        // 页码值最小要等于 1
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
                    }
                    getNewsList()
                }
            })

            layer.close(index)
        })
    })
})