//导入css
require('./css/font-awesome.min.css')
require('./css/index.less')

//可以把他当成模块
const audio1 = require('../audios/我记得.mp3')
const audio2 = require('../audios/成都.mp3')
const audio3 = require('../audios/南方姑娘.mp3')
const audio4 = require('../audios/爱情转移.mp3')
const audio5 = require('../audios/阴天快乐.mp3')

var audios = [audio1,audio2,audio3,audio4,audio5]

// 保存音乐列表信息
var musicList = []
var currentIndex = 0//当前播放索引

// 程序入口：先加载音乐列表的信息
$.ajax({ //在项目中使用ajax请求获取music.json文件的时候控制台报跨域问题的错误。解决：安装live server(默认端口5500）插件并go live就可以了,同时要修改launch.json文件的url
	type: "GET",
	url: "../music.json",
	dataType: "json",
	success: function(data) {
		// console.log(data)
		musicList = data.map((item, index)=>{
			item.audio_url = audios[index].default
			return item
		})
		render(musicList[currentIndex])//实参，将会传给形参
		renderMusicList(musicList)
	}
})


// jQuery 提供的用于操作元素属性和样式的方法:

// .text() 用于处理文本内容，
// .attr() 用于处理元素属性，
// .css() 用于处理 CSS 样式属性。
//.html() 用于获取或设置元素的 HTML 内容。
//.val() 用于获取或设置表单控件的值    // 获取表单控件的值var value = $('input').val();//设置表单控件的值$('input').val('New Value');
// .addClass(), .removeClass(), .toggleClass(): 用于添加、移除或切换元素的 CSS 类。
// .addClass(className)：向匹配的元素添加指定的类名。
// .removeClass(className)：从匹配的元素中移除指定的类名。
// .toggleClass(className)：如果存在（不存在）就移除（添加）一个类。


// 渲染歌曲的卡片信息的方法
function render(data) {//获取(传）音乐列表的单个歌曲信息musicList[currentIndex]（参数进来）后要动态获取数据里面的内容，比如name、singer、ablum等
	console.log(data)
	$('.name').text(data.name)
	$('.singer_ablum').text(`${data.singer} - ${data.album}`)//" ` "这个是反引号，不是单引号" ' "
	$('.time').text(data.time)
	$('.cover img').attr('src', data.cover)
	$('.mask_bg').css({
		background: `url("${data.cover}") no-repeat center center`
	})

	$('audio').attr('src', data.audio_url)//获取当前播放的音频
}

// 渲染模态框里面的音乐列表
function renderMusicList(list) {//获取(传）音乐列表musicList（参数进来）
	$('.music_list').empty()//每次渲染之前需清空音乐列表
	
	$.each(list, function(index, item){//遍历
		console.log(item)
		//如果条件成立将会使用playing的css属性
		var $li = $(`
		<li class="${index == currentIndex ? "playing" : ""}">
			<span>0${index + 1}. ${item.name} - ${item.singer}</span>
			<span data-index = "${index}" class="fa ${
				index == currentIndex && !$('audio').get(0).paused ? 'fa-pause-circle' : 'fa-play-circle'
			} play-circle"></span>

        </li>
		`)
		$('.music_list').append($li)//把音乐加到模态框列表里面
	})
}



// 用于音频的事件类型包括：

// play：音频开始播放时触发。
// pause：音频暂停播放时触发。
// ended：音频播放结束时触发。
// loadedmetadata：音频元数据加载完成时触发。
// seeked：音频跳转至新的播放位置时触发。
// timeupdate：播放进度更新的事件。


// 给播放按钮绑定点击事件
$('#playBtn').on('click', function() {
	var audioElement = $('audio').get(0);//get(0) 是用于获取匹配元素集合中的第一个元素,通过 .get(0) 可以将 jQuery 对象转换为原生 DOM 对象，以便使用原生 DOM 对象上的属性和方法。
	if(audioElement instanceof HTMLAudioElement) { 
        if(audioElement.paused) {
			//if(audioElement instanceof HTMLAudioElement && audioElement.paused) { //if($('audio').get(0).paused){  如果已经处于暂停状态，应该让音乐播放
			audioElement.play() // 让音乐播放起来
			$(this).removeClass('fa-play').addClass('fa-pause')//暂停按钮改为播放按钮
			$('.player_info').animate(//音乐信息卡片显示出来
				{
					top: '-100%',
					opacity: 1//透明度，1表示完全不透明
				},
				"slow"
			)
			$('.cover').css({//封面图片转动起来
				"animation-play-state": "running"
			})

			
		}else{
			audioElement.pause() // 让音乐暂停
			$(this).removeClass('fa-pause').addClass('fa-play')//暂停按钮改为播放按钮
			$('.player_info').animate(//音乐信息卡片显示出来：js动画效果
				{
					top: '0%',
					opacity: 0//透明度，0表示透明
				},
				"slow"
			)
			$('.cover').css({//封面图片停止转动
				"animation-play-state": "paused"
			})
		}
	}else{
		console.error("找不到音频元素或者获取到的不是音频元素");
	}
	renderMusicList(musicList)//点完播放后重新调用这个函数，为了让音乐列表的播放按钮也能实现播放功能
})

//给上一首按钮绑定点击事件
$('#prevBtn').on('click', function(){
	if(currentIndex > 0){
		currentIndex--;
	}else{
		currentIndex = musicList.length - 1
	}
	render(musicList[currentIndex])//重新渲染歌曲
	$('#playBtn').trigger('click') // 让音乐播放
})

//给下一首按钮绑定点击事件
$('#nextBtn').on('click', function(){
	if(currentIndex < musicList.length - 1){
		currentIndex++;
	}else{
		currentIndex = 0;
	}
	render(musicList[currentIndex])//重新渲染歌曲
	$('#playBtn').trigger('click') // 让音乐播放
})

//给音乐列表绑定点击事件，点击打开模态框
$('#openModal').on('click', function(){
	$('.modal').css({
		display: "block"
	})
})
$('.modal_close').on('click', function(){
	$('.modal').css({
		display: "none"
	})
})

//播放进度条
//1、监听audio标签的 timeupdate 事件（当前播放时间发生变化时触发）
$('audio').on('timeupdate',function(){
	//获取音乐播放的当前时间和音乐播放总时长
	var currentTime = $('audio').get(0).currentTime || 0  //如果无法获取到当前时间，则默认值为0。
	console.log(currentTime) //打印出来的是以秒为单位的时间，所以要格式化成00:00（分：秒）的形式
	var duration = $('audio').get(0).duration || 0
	//设置当前播放时间
	$('.current_time').text(formatTime(currentTime))
	//设置进度条
	var value = ( currentTime / duration ) * 100 //当前播放时间 currentTime 占总播放时间 duration 的百分比;并乘以 100，我们可以得到一个百分比值
	$('.music_progress_line').css({
		width: value + '%'
	})

})
//格式化时间的方法
function formatTime(time) {
	var min = parseInt(time / 60)
	var sec = parseInt(time % 60)
	min = min < 10 ? '0' + min : min
	sec = sec < 10 ? '0' + sec : sec
	return `${min}:${sec}` //返回字符串类型用反引号(`)
}

//2、监听audio标签音乐播放完毕ended的事件
$('audio').on('ended',function(){
	$('#playBtn').removeClass('fa-pause').addClass('fa-play')
	//让封面图停止转动
	$('.cover').css({
		'animation-play-state': 'paused'
	})
})

//通过事件委托给音乐列表的播放按钮绑定点击事件
$('.music_list').on('click', '.play-circle', function(){
	console.log($(this))
	if($(this).hasClass('fa-play-circle')){
		var index = $(this).attr('data-index')
		currentIndex = index
		render(musicList[currentIndex])
		$('#playBtn').trigger('click')
	}else{
		$('#playBtn').trigger('click')
	}
})
