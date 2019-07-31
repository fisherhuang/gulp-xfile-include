#Gulp 文件合并工具
  为解决HTML template加入到js 以及在js中引入指定的js合并麻烦的问题

示例:参照test中的测试js
      gulp.src(fixtures('main.js'), { allowEmpty: true })
        .pipe(include(option))
    . include(option) option 为可选参数
    . option 为一个集合[{type:'',transform:'',rule:''},....]
      - type:为指定文件的类型
      - tranform:为需要对改文件转换的方法
      - rule： 获取指定文件的正则表达式

当前插件中已经写好了Html以及JS的文件格式也可以根据自身需要修改对应的取文件规则，但是文件路径必须为正则表达式的第一个元组