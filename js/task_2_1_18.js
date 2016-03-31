/**
 * Created by Boyce on 2016/3/30.
 */
var conPanel, outputWrap,
    inputData = [],                     // 用于缓存用户输入
    $ = function (el) {return document.querySelector(el);};

conPanel = $('.control-panel');         // 操作按钮控制面板
outputWrap = $('.result');              // 结果输出面板

/**
 * 点击选项时的处理函数
 */
function processOpts(e) {
    var valNum = /^(-?\d+)(\.\d+)?$/,       // 用于验证是否数字
        target = EventUtil.getTarget(e);

    if (target.tagName === 'SPAN') {
        // 点击队列中的数字时
        var index, pos, msg;

        index = inputData.indexOf.call(target.parentNode.childNodes, target);       // 取得点击数值在数组中的索引
        pos = index + 1;
        msg = pos + '号位队员 "' + inputData[index] + '"离开了队伍';
        alert(msg);
        inputData.splice(index, 1);
    } else {
        // 点击操作按钮时
        var outNum,
            readyData =  $('input[type="text"]').value.trim(),
            len = inputData.length;

        switch (target.id) {
            case 'left-in':
                if (!valNum.test(readyData)) {
                    alert('只有数字才能进入队列');
                    break;
                } else {
                    ShiftApproaches.leftIn(readyData, inputData);
                    break;
                }
            case 'right-in':
                if (!valNum.test(readyData)) {
                    alert('只有数字才能进入队列');
                    break;
                } else {
                    ShiftApproaches.rightIn(readyData, inputData);
                    break;
                }
            case 'left-out':
                if (len === 0) {
                    ShiftApproaches.leftOut(inputData);
                    alert('队列里已结没有队员了');
                    break;
                } else {
                    outNum = ShiftApproaches.leftOut(inputData);
                    alert('"' + outNum + '" 离开了队列');
                    break;
                }
            case 'right-out':
                if (len === 0) {
                    ShiftApproaches.rightOut(inputData);
                    alert('队列里已结没有队员了');
                    break;
                } else {
                    outNum = ShiftApproaches.rightOut(inputData);
                    alert('右侧第一位队员 "' + outNum + '" 离开了队列');
                    break;
                }
        }
    }
    console.log(inputData);
    renderScreen();
}

// 数据存入数组方式，传入两个参数：待操作值和待操作数组
var ShiftApproaches = {
    leftIn: function(data, dataArr) {return dataArr.unshift(data);},    // 左侧入
    rightIn: function(data, dataArr) {return dataArr.push(data);},      // 右侧入
    leftOut: function(dataArr) {return dataArr.shift();},               // 左侧出
    rightOut: function(dataArr) {return dataArr.pop();}                 // 右侧出
};

// 渲染屏蔽
function renderScreen() {
    $('.result').innerHTML = inputData.map(function (v) {
        return '<span>' + v + '</span>';
    }).join('');
}

// 初始化button点击事件
(function btnClick() {
    EventUtil.delegate(conPanel, 'button', 'click', processOpts);
    EventUtil.delegate(outputWrap, 'span', 'click', processOpts);
})();
