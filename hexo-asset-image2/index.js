'use strict';
var cheerio = require('cheerio');

/**
 * 注册 after_post_render filter, 当整个 post render 完成后调用
 * 这时在 data 中我们会获取 3 个字段, 然后对这 3 个 html 片段进行处理
 * excerpt 代表摘要
 * more 代表摘要后的部分
 * content 则是整个内容
 */
hexo.extend.filter.register('after_post_render', function (data) {
    // 获取 hexo _config.yml 中的配置
    var config = hexo.config;

    // 需要 _config.yml 中 post_asset_folder: true 才生效
    if (config.post_asset_folder == false)
        return;

    // permalink 形如 http://example.com/2023/01/16/mypost/
    // 截取后的 link = 2023/01/16/mypost/
    var link = data.permalink;
    var beginPos = link.split('/', 3).join('/').length + 1;
    var endPos = link.lastIndexOf('/') + 1;
    link = link.substring(beginPos, endPos);

    // 处理 data 中这 3 个字段
    var toprocess = ['excerpt', 'more', 'content'];
    for (var i = 0; i < toprocess.length; i++) {
        var key = toprocess[i];

        // 使用 cheerio 对 html 解析
        var $ = cheerio.load(data[key], {
            ignoreWhitespace: false,
            xmlMode: false,
            lowerCaseTags: false,
            decodeEntities: false
        });

        $('img').each(function () {
            // img 标签不包含 src 属性
            if (!$(this).attr('src')) {
                console.info && console.info("no src attr, skipped...");
                console.info && console.info($(this));
                return;
            }

            // For windows style path, we replace '\' to '/'.
            var src = $(this).attr('src').replace('\\', '/');

            // http 开头的表示用户直接使用图片地址, 这里不用做处理
            if (/http[s]*.*|\/\/.*/.test(src))
                return;

            // 替换形如 /mypost/image.png 或 mypost/image.png --> image.png, 
            var srcArray = src.split('/').filter(function (elem) {
                return elem != '' && elem != '.';
            });
            if (srcArray.length > 1)
                srcArray.shift();
            src = srcArray.join('/');
            $(this).attr('src', config.root + link + src);
            console.info && console.info("update link as:-->" + config.root + link + src);
        });

        data[key] = $.html();
    }
});
