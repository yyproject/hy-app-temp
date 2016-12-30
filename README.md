# hy-app-temp

> 通过 [grunt-init][], 创建一个虎牙移动端模板.

[grunt-init]: http://gruntjs.com/project-scaffolding

## 安装方式
如果你还没安装 [grunt-init][].的话，请安装

npm install -g grunt-init

一旦模板被安装到你的~/.grunt-init/目录中(在Windows平台是%USERPROFILE%\.grunt-init\目录)，那么就可以通过grunt-init命令来使用它们了。建议你使用git将模板克隆到项目目录中。例如, grunt-init-jquery模板可以像下面这样安装：


	git clone https://github.com/huya-fed/hy-app-temp.git ~/.grunt-init/hy-app-temp



## 使用

cd到一个空的目录下，然后执行以下cmd的命令


	grunt-init hy-app-temp


_请注意,该模板将生成文件在当前目录中,所以一定要先切换到一个新目录,如果你不想覆盖现有的文件。._

## 模板说明

该模板使用的是fis3的编译工具，依赖于以下插件



- npm install -g fis3@3.4.22
- npm install -g fis-parser-utc@0.0.2 //编译underscore模板
- npm install -g fis-parser-node-sass@0.2.1 //编译sass模板
- npm install -g fis-postprocessor-jswrapper@0.0.14 //模块化打包
- npm install -g fis3-preprocessor-js-require-file@0.1.0 //分析模块化的require依赖文件
- npm install -g fis3-preprocessor-js-require-css@0.1.0 //分析模块化的require依赖css
- npm install -g fis3-postpackager-loader@2.1.3 //资源打包
- npm install -g fis3-deploy-skip-packed@0.0.5 //过滤掉被打包的资源。
- npm install -g fis3-preprocessor-autoprefixer@0.1.0 //css前缀
- npm install -g postcss  //css前缀--用到
- npm install -g fis3-hook-commonjs //模块化
- npm install -g fis-parser-es6-babel   //编译e6的代码



#HTML/CSS 编写注意事项

----------

> 本脚手架是amazeui的阉割版，详细文档请查看Issues。


## 基本原则

- 以 hy 为命名空间
- 关注分离，将 HTML、CSS 解耦；模块化编码。


## 模块化编写实践

- **语义化的模块名**，通过模块名应该能一眼就看出模块的是干什么的。

- 模块内部的类名继承自父级。


		<div class="hy-box">
		   <h2 class="hy-box-hd">About the Site</h2>
		   <p class="hy-box-bd">This is my blog where I talk about only the bestest things in the whole wide world.</p>
		</div>


上面的代码中，模块的名为 **box**，模块最外层使用 **{命名空间}-{模块名}** 的方式命名 Class。模块子元素以在此基础上进行命名。如果不继承父级的类名，很容易造成命名冲突。



## 命名注意事项


###模块状态： {命名空间}-{模块名}-{状态描述}

常用状态有：hover, current, selected, disabled, focus, blur, checked, success, error 等

	hy-tab-hover


###子模块： {命名空间}-{模块名}-{子模块名}

常用模块名有：bd(body)，cnt(content)，hd(header)，text(txt)，img(images/pic)，title，item，cell 等， 词义表达组件要实现的功能

	<ul class="hy-nav">
	    <li class="hy-nav-item">
	        <a href="#">nav Triggle Link</a>
	        <ul class="hy-subnav">
	            <li class="hy-subnav-item">
	                <a href="#">subNav Triggle Link</a>
	                    <ul class="hy-list">   
  

统一命名风格（使用相同名词命名不同组件的子元素）：如 hy-tab-hd, hy-modal-hd，便于理解。    


虎牙构建工具会使用 Autoprefixer 自动添加浏览器厂商前缀，编写 CSS 时不要添加浏览器前缀，直接使用标准的 CSS 编写




##JavaScript

###默认绑定事件：

事件名（内置事件，非自定义事件）采用 {事件名}.{组件名}.{命名空间}，如 $(document).on('click.modal.hyui',...。


- 取消所有默认绑定事件： $(document).off('.hyui',...
- 取消特定组件的默认绑定事件： $(document).off('.modal.hyui',...
