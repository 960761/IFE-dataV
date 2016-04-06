/**
 * Created by Boyce on 2016/4/5.
 */
var tagStore = [],                              // 存储输入的tag
    hobbyStore = [],                            // 存储每项兴趣爱好
    regTxt =/[^\u4E00-\u9FA5A-Za-z0-9]+/,       // 用于匹配非数字、中文、英文字符
    $ = function (el) {return document.querySelector(el);};

var result = $('.result'),
    tagWrap = $('.opts-wrapper'),
    chartBoard = $('.chart-board'),
    hobbyWrap = $('.chart-wrapper');

/**
 * 将输入的内容分割为数组
 */
function formatInput(text) {
    let tmpStore = [];
    text.split(regTxt).forEach(function (item) {
        if (item.trim() !== '') {tmpStore.push(item);} else {return false;}
    });
    return tmpStore;
}

/**
 * 渲染屏蔽
 * 接收两个参数：渲染输出结果的包含元素、需要渲染的数据
 */
function renderScreen(wrapper, src) {
    wrapper.innerHTML = src.map(function (item) {return '<span>' + item + '</span>';}).join('');
}

/**
 * 取得输入结果
 */
var GetInput = {
    // 取得tag输入框内容
    tagsInput: function () {
        let tagTmp = $('input[type="text"]').value;
        if (tagTmp !== '') {return tagTmp;} else {return false;}
    },

    // 取得兴趣爱好输入框内容
    hobbiesSplit: function () {
        let inputData = $('#multiText').value.trim(),
            hobbyTmpStore = formatInput(inputData);
        if (hobbyTmpStore !== false) {return hobbyTmpStore;} else {return false;}
    }
};

/**
 * 将用户输入结果存入数组
 */
function deal(e) {
    let target = EventUtil.getTarget(e);

    // 处理重复
    this.avoidRepeat = function(referArray, compItem) {
        let repeat = referArray.indexOf(compItem),
            noBlank = compItem.trim() !== '';
        if (repeat === -1 && noBlank) {
            referArray.push(compItem);
        } else if (repeat > -1 && noBlank) {
            console.log('"' + compItem + '"' + ' 已经出现在列表里');
        }
    };

    // 数组长度大于10时
    this.limitLen = function (referArray, MaxLen) {
        if (referArray.length > MaxLen) {
            referArray.splice(0, (referArray.length - MaxLen));
        }
    };

    switch (target.id) {
        case 'confirm-btn':
            let data = GetInput.hobbiesSplit();
            if (data === false) {break;}
            else {
                data.forEach(function (item) {
                    // 过滤重复爱好
                    this.avoidRepeat(hobbyStore, item);
                    // 最多允许10个兴趣爱好，多于10个时，按照录入的先后顺序，把最前面的删掉
                    this.limitLen(hobbyStore, 10);
                });
                renderScreen(chartBoard, hobbyStore);
                break;
            }
        case 'tags-input':
            let tag = GetInput.tagsInput(),
                event = EventUtil.getEvent(e);
            if (tag === false) {break;}
            else if (regTxt.test(tag) || event.keyCode === 13) {  // 遇到用户输入非数字、英文、中文字符时，将输入存到数组里
                let validTag = formatInput(tag)[0];
                // 过滤重复tag
                this.avoidRepeat(tagStore, validTag);
                // 多于10个tag时，按照录入的先后顺序，把最前面的删掉
                this.limitLen(tagStore, 10);
                renderScreen(result, tagStore);
                $('input[type="text"]').value = '';
                break;
            }
    }
}

/**
 * 鼠标mouseover, mouseout, click事件
 */
function mouseEvent(e) {
    let target = EventUtil.getTarget(e),            // 获取事件对象
        eventType = EventUtil.getEvent(e).type;     // 获取事件类型

    // 判断事件类型，执行对应操作
    switch (eventType) {
        case 'click':
            let index = tagStore.indexOf.call(target.parentNode.childNodes, target);
            tagStore.splice(index, 1);
            renderScreen(result, tagStore);
            break;
        case 'mouseover':
            target.style.backgroundColor = 'red';
            target.innerHTML = '点击删除 ' + target.textContent;
            break;
        case 'mouseout':
            target.style.backgroundColor = '#16324a';
            target.innerHTML = target.textContent.replace('点击删除 ','');
            break;
    }
}

/**
 * 初始化鼠标、键盘事件
 */
function init() {
    EventUtil.delegate(hobbyWrap, 'button', 'click', function (e) {deal(e)});   // 绑定确认按钮
    EventUtil.delegate(tagWrap, 'input', 'keyup', function (e) {deal(e)});      // 绑定tag输入框
    EventUtil.delegate(tagWrap, 'span', 'click', mouseEvent);                   // 绑定tag标签的点击事件
    EventUtil.delegate(tagWrap, 'span', 'mouseover', mouseEvent);               // 绑定tag标签的mouseover事件
    EventUtil.delegate(tagWrap, 'span', 'mouseout', mouseEvent);                // 绑定tag标签的mouseout事件
}

init();