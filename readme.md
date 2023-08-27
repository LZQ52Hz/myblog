
# 博客源码模板

执行

```sh
npm install

# s 开启服务, g 生成, d 发布
hexo s
```

## 写文章

在 source/_post 中创建 markdown, 或直接 hexo new mypost

## 主题

更换主题直接在 _config.yml 中改 `theme: ` 即可

支持主题:

* next 配置文件 _config.next.yml
* keep 配置文件 source/_data/keep.yml

## 图片插入

hexo-asset-image2 改自 hexo-asset-image 修复了一些 bug

方法: 确保 _config.yml 中 post_asset_folder: true, 且图片必须放在和 md 文件同名的文件夹下, 例如

```
mypost/myimage.jpg
mypost.md
```
然后引用时 `![myimage](mypost/myimage.jpg)`
