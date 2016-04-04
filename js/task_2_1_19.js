/**
 * Created by Boyce on 2016/3/31.
 */

var conPanel, outputWrap, chartBoard, optsWrap, chartWrap,
    inputData = [],                     // 用于缓存用户输入
    $ = function (el) {return document.querySelector(el);};

conPanel = $('.control-panel');         // 操作按钮控制面板
outputWrap = $('.result');              // 结果输出面板
chartBoard = $('.chart-board');

optsWrap = $('.opts-wrapper');
chartWrap = $('.chart-wrapper');

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
 * 数据存入数组方式
 * 传入两个参数：待操作值和待操作数组
 */
var ShiftApproaches = {
    leftIn: function(data, dataArr) {return dataArr.unshift(data);},    // 左侧入
    rightIn: function(data, dataArr) {return dataArr.push(data);},      // 右侧入
    leftOut: function(dataArr) {return dataArr.shift();},               // 左侧出
    rightOut: function(dataArr) {return dataArr.pop();}                 // 右侧出
};

/**
 * 排序方法
 */
var SortApproaches = {
    /**
     * 方法一：通过设置元素的order值（在使用flex布局情况下）等于其title值进行排序
     * 传入元素集合作为参数
     */
    flexOrderSort: function (elArr) {
        // 将 NodeList 转换为 Array
        // 如果不做这一步，Firefox和IE无法直接将传入的NodeList当成数组，进而无法使用forEach
        // 在chrome浏览器中就没这个问题
        let elLists = Array.prototype.slice.call(elArr);
        elLists.forEach(function (item) {
                item.style.order = item.title;
                console.log(item.style.order);
            });
    },

    /*
     * 方法二：冒泡排序
     * 传入两个参数：排序数组和屏幕渲染函数
     */
    bubbleSort: function (arr) {
        let tmp, i = 0, j = 1,
            timer = null;

        timer = setInterval(sort, 10);
        function sort() {
            if (i < arr.length -1) {
                if (j < arr.length) {
                    if (arr[i] > arr[j]) {
                        tmp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = tmp;
                        RenderScreen.spanRight(arr);
                        RenderScreen.spanLeft(arr);
                        document.querySelectorAll('.chart-board span').item(i).style.backgroundColor = 'yellow';
                        document.querySelectorAll('.chart-board span').item(j).style.backgroundColor = 'black';
                        document.querySelectorAll('.result span').item(i).style.backgroundColor = 'yellow';
                        document.querySelectorAll('.result span').item(j).style.backgroundColor = 'black';
//                        console.log('i-' + tmp + '; j-' + arr[i] + '; tmp-' + arr[j]);
                    }
                    j++;
                } else {
                    i++;
                    j = i + 1;
                }
            } else {
                clearInterval(timer);
                RenderScreen.spanRight(arr);
                RenderScreen.spanLeft(arr);
            }
        }
//        console.log('bubble: ' + arr);
    }
};

/**
 * 重置数据
 */
function reset() {
    return inputData.slice(0);
//    console.log('resetData: ' + resetData);
//    return resetData;
}

/**
 * 随机模拟生成测试数据
 */
function randomBuildData(length, min, max) {
    var returnData = [];
    for (var i = 1; i <= length; i++) {
        returnData.push(Math.ceil(min + Math.random() * (max - min)));
    }
    return returnData;
}

/**
 * 点击选项时的处理函数
 */
function processOpts(e, elName, opts, src) {
    var target = EventUtil.getTarget(e);
    let i = 0;

    if (target.tagName !== elName.toUpperCase()) {
        // 点击操作按钮时
        let outNum, readyData, emptyArr;
        switch (target.id) {
            case opts[i]:
                readyData = getInputValue();
                if (readyData === false) {break;}
                else {
                    ShiftApproaches.leftIn(readyData, src);
                    RenderScreen.spanLeft(src);
                    RenderScreen.spanRight(src);
                    break;
                }
            case opts[i + 1]:
                readyData = getInputValue();
                if (readyData === false) {break;}
                else {
                    ShiftApproaches.rightIn(readyData, src);
                    RenderScreen.spanLeft(src);
                    RenderScreen.spanRight(src);
                    break;
                }
            case opts[i + 2]:
                emptyArr = ExceptionHandling.emptyArr(src);
                if (emptyArr === false) {break;}
                else {
                    outNum = ShiftApproaches.leftOut(src);
                    RenderScreen.spanLeft(src);
                    RenderScreen.spanRight(src);
                    alert('左侧第一位队员 "' + outNum + '" 离开了队列');
                    break;}
            case opts[i + 3]:
                emptyArr = ExceptionHandling.emptyArr(src);
                if (emptyArr === false) {break;}
                else {
                    outNum = ShiftApproaches.rightOut(src);
                    RenderScreen.spanLeft(src);
                    RenderScreen.spanRight(src);
                    alert('右侧第一位队员 "' + outNum + '" 离开了队列');
                    break;}
            case opts[i + 4]:
                var span = document.querySelectorAll('.chart-wrapper span');
                SortApproaches.flexOrderSort(span);
                break;
            case opts[i + 5]:
                SortApproaches.bubbleSort(src);
                RenderScreen.spanRight(src);
                break;
            case opts[i + 6]:
                RenderScreen.spanLeft(inputData);
                RenderScreen.spanRight(inputData);
                break;
        }
    } else {
        // 点击队列中的数字时
        let index, pos, msg;
        // 取得点击数值在数组中的索引
        index = src.indexOf.call(target.parentNode.childNodes, target);
        pos = index + 1;
        msg = pos + '号位队员 "' + src[index] + '"离开了队伍';
        alert(msg);
        src.splice(index, 1);

        RenderScreen.spanRight(src);
        RenderScreen.spanLeft(src);
    }
}

/*
 * 颜色选择
 */
function colorSelector(height) {
    if (height <= 18) {
        return '#00f7ff';
    } else if (height < 25) {
        return '#16324a';
    } else if (height < 40) {
        return '#8a8b7b';
    } else if (height < 60) {
        return '#ea0c00';
    } else if (height < 80) {
        return '#915c30';
    } else {
        return '#0a7679';
    }
}

/**
 * 渲染屏蔽
 */
var RenderScreen = {
    // 输出数字标签到左侧屏幕
    spanLeft: function (src) {
//        $('.result').innerHTML = '';
        $('.result').innerHTML = src.map(function (v) {
            return '<span style="background-color: ' + colorSelector(v) + ';">' + v + '</span>';
        }).join('');
    },

    // 输出柱形图到右侧屏幕
    spanRight: function (src) {
//        $('.chart-board').innerHTML = '';
        $('.chart-board').innerHTML = src.map(function (v) {
            return '<span style="height: ' + (v * 2.5) +'px;' +
                ' background-color: ' + colorSelector(v) + ';"' +
                ' title="' + v + '">' + '</span>';
        }).join('');
    }
};

/**
 * 获得输入结果
 */
function getInputValue() {
    var inputNum = $('input[type="text"]').value.trim(),            // 取得输入值
        isNum = ExceptionHandling.isNumber(inputNum),               // 验证输入结果是否为数字
        inRng = ExceptionHandling.numRange(inputNum, 10, 100),      // 验证数字是否在规定范围内
        inLen = ExceptionHandling.arrLen(inputData, 60);            // 检查数组长度是否超过60

    // 都符合要求，返回输入结果
    if (isNum && inRng && inLen) {return inputNum;}
    else {return false;}
}

// 初始化button点击事件
function initBtnClick() {
    let opts = ['left-in', 'right-in', 'left-out', 'right-out', 'flex-sort', 'bubble-sort', 'sort-reset'],
        fn = function (e) {processOpts(e, 'span', opts, reset())};

    EventUtil.delegate(optsWrap, 'button', 'click', fn);       // 绑定四个操作按钮
    EventUtil.delegate(optsWrap, 'span', 'click', fn);         // 绑定队列元素
    EventUtil.delegate(chartWrap, 'button', 'click', fn);      // 绑定排序按钮
    EventUtil.delegate(chartWrap, 'span', 'click', fn);        // 绑定柱形图队列元素
}

/**
 * 初始化函数
 */
function init() {
    inputData = randomBuildData(50, 10, 100);
    console.log('原始数组：' + inputData);
    initBtnClick();
    RenderScreen.spanLeft(reset());
    RenderScreen.spanRight(reset());
}

init();
