
/**
 * Created by Boyce on 2016/4/4.
 */

var conPanel, outputWrap, chartBoard, optsWrap, chartWrap,
    inputData = [],                             // 用于缓存用户输入
    regTxt =/[^\u4E00-\u9FA5A-Za-z0-9]+/,       // 用于匹配非数字、中文、英文字符
    $ = function (el) {return document.querySelector(el);};

conPanel = $('.control-panel');         // 操作按钮控制面板
outputWrap = $('.result');              // 结果输出面板
chartBoard = $('.chart-board');

optsWrap = $('.opts-wrapper');
chartWrap = $('.chart-wrapper');

/**
 * 数据存入数组方式
 * 传入两个参数：待操作值和待操作数组
 */
var ShiftApproaches = {
    // 左侧入
    leftIn: function(data, dataArr) {
        for (let i = data.length - 1; i >= 0; i--){
            dataArr.unshift(data[i]);
        }
        return dataArr;
    },
    // 右侧入
    rightIn: function(data, dataArr) {
        for (let i = 0, len = data.length; i < len; i++){
            dataArr.push(data[i]);
        }
        console.log(dataArr);
        return dataArr;
    },
    leftOut: function(dataArr) {return dataArr.shift();},               // 左侧出
    rightOut: function(dataArr) {return dataArr.pop();}                 // 右侧出
};

/**
 * 异常处理
 */
var ExceptionHandling = {
    // 验证输入结果是否为数字
    isNumber: function (data) {
        var valNum = /^(-?\d+)(\.\d+)?$/;       // 用于验证是否数字
        if (data === '') {
            alert('咦，我啥也没看到');
            return false;
        } else if (!valNum.test(data)) {
            alert('只有数字家族成员才能进入队列');
            return false;
        } else {return true;}
    },

    // 验证数字范围
    numRange: function (data, min, max) {
        if (data < min && data !== '') {
            alert('哎呀，小朋友你还太小了，不满' + min + '岁我们不能接收啊');
            return false;
        } else if (data > max) {
            alert('哎呀呀，超过' + max + '岁的老人家应该在家享清福啊');
            return false;
        } else {return true;}
    },

    // 检查数组长度
    arrLen: function (array, max) {
        if (array.length > max) {
            alert('哎呀，太挤了\r\r队列最多接收' + max + '个成员\r\r得有队员离开队列才能继续接收成员\r');
            return false;
        } else {return true;}
    },

    // 数组为空时
    emptyArr: function (array) {
        if (array.length === 0) {
            alert('队列里已结没有队员了');
            return false;
        } else {return true;}
    }
};

/**
 * 点击选项时的处理函数
 */
function processOpts(e, elName, opts, newArr, oldArr) {
    var target = EventUtil.getTarget(e);
    let i = 0;

    if (target.tagName !== elName.toUpperCase()) {
        // 点击操作按钮时
        let outNum, emptyArr;
        switch (target.id) {
            case opts[i]:
                if (newArr === false) {break;}
                else {
                    ShiftApproaches.leftIn(newArr, oldArr);
                    RenderScreen.spanRight(oldArr);
                    break;
                }
            case opts[i + 1]:
                if (newArr === false) {break;}
                else {
                    ShiftApproaches.rightIn(newArr, oldArr);
                    RenderScreen.spanRight(oldArr);
                    break;
                }
            case opts[i + 2]:
                emptyArr = ExceptionHandling.emptyArr(oldArr);
                if (emptyArr === false) {break;}
                else {
                    outNum = ShiftApproaches.leftOut(oldArr);
                    RenderScreen.spanRight(oldArr);
                    alert('左侧第一位队员 "' + outNum + '" 离开了队列');
                    break;
                }
            case opts[i + 3]:
                emptyArr = ExceptionHandling.emptyArr(oldArr);
                if (emptyArr === false) {break;}
                else {
                    outNum = ShiftApproaches.rightOut(oldArr);
                    RenderScreen.spanRight(oldArr);
                    alert('右侧第一位队员 "' + outNum + '" 离开了队列');
                    break;
                }
            case opts[i + 4]:
                searchMatch();
                break;
        }
    } else {
        // 点击队列中的数字时
        let index, pos, msg;
        // 取得点击数值在数组中的索引
        index = oldArr.indexOf.call(target.parentNode.childNodes, target);
        pos = index + 1;
        msg = pos + '号位队员 "' + oldArr[index] + '"离开了队伍';
        alert(msg);
        oldArr.splice(index, 1);

        RenderScreen.spanRight(oldArr);
        
    }
}

/**
 * 渲染屏蔽
 */
var RenderScreen = {
    // 输出柱形图到右侧屏幕
    spanRight: function (src) {
        chartBoard.innerHTML = src.map(function (v) {
            return '<span>' + v + '</span>';
        }).join('');
    }
};

/**
 * 查询匹配
 */
function searchMatch() {
    let searchValue = $('input[type="text"]').value.trim();     // 取得查询框输入值
//        regTxt =
    RenderScreen.spanRight(inputData);
    inputData.map(function (item, index) {
        if (item.search(searchValue) !== -1 && searchValue !== '') {
            let matchItem = chartBoard.children[index];
            matchItem.className = 'match';
            matchItem.innerHTML = matchItem.innerHTML.replace(searchValue, '<span class="matchTxt">' + searchValue + '</span>')
        }
    })
}

/**
 * 获得输入结果
 */
function getInputValue() {
    let inputTxt = $('#multiText').value.trim(),        // 取得textarea的输入值
        // 用于存储从textarea分离的值
        splitTxt = inputTxt.split(regTxt).filter(function (s) {
            return s !== '';
        });

    if (splitTxt !== '') {console.log(splitTxt); return splitTxt;}
    else {return false;}

}

// 初始化button点击事件
function initBtnClick() {
    let opts = ['left-in', 'right-in', 'left-out', 'right-out', 'search-btn'],
        fn = function (e) {processOpts(e, 'span', opts, getInputValue(), inputData)};

    EventUtil.delegate(optsWrap, 'button', 'click', fn);       // 绑定四个操作按钮
//    EventUtil.delegate(optsWrap, 'span', 'click', fn);         // 绑定队列元素
    EventUtil.delegate(chartWrap, 'button', 'click', fn);      // 绑定排序按钮
    EventUtil.delegate(chartWrap, 'span', 'click', fn);        // 绑定队列元素
}

/**
 * 初始化函数
 */
function init() {
    initBtnClick();
}

init();
