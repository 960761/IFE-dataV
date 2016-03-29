/**
 * Created by Boyce on 2016/3/28.
 */

/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
},
    chartData = {},                                             // 用于渲染图表的数据
    pageState = {nowSelectCity: -1, nowGraTime: "day"},         // 记录当前页面的表单选项
    forGraTime = document.querySelector('#form-gra-time'),      // 用于事件绑定
    citySelected = document.querySelector('#city-select'),      // 下拉选项单
    aqiCharTitle = document.querySelector('.aqi-chart-wrap'),   // 图表外层框
    aqiChart = document.querySelector('.aqi-chart'),            // 图表框
    CHART_WIDTH,                                                // 常数，用于存储class为.aqi-chart的宽度
    opts = document.querySelectorAll('.op-wrapper label'),      // 日期粒度选项
    // 转换日期粒度用于图表标题
     chartTitle = function () {
        switch (pageState.nowGraTime) {
            case 'day': return '每日';
            case 'week': return '每周平均';
            default: return '每月平均';
        }
     };

CHART_WIDTH = aqiChart.clientWidth;         // 将图表框宽度保存为常数备用

/**
 * 设置条形图颜色及宽度
 */
var BarConfig = {
    // 生成颜色
    getRandomColor: function () {
        var color = '#',
            seed = '0123456789abcdef';
        for (var i = 0; i < 6; i++) {
            var index = Math.round(Math.random() * 15);
            color += seed.charAt(index);
        }
        return color;
    },

    // 计算柱状图中每条柱子的宽度，接收两个参数：父容器宽度和对象或数组
    barWidth: function (CONTAINER_WIDTH, src) {
        var barCnt = Object.keys(src).length || src.length;
        return Math.round(CONTAINER_WIDTH / barCnt);
    }
};

/**
 * 渲染图表
 */
function renderChart() {
    var color, width,
        chartHtml = '';

    // 渲染图表标题
    chartHtml += '<h1 class="title">' + '<span class="city-select selected">';
    chartHtml += pageState.nowSelectCity + '</span>' + '01-03月';
    chartHtml += '<span class="op-item selected">' + chartTitle() + '</span>' + '空气质量报告</h1>';
    chartHtml += '<div class="aqi-chart">';

    width = BarConfig.barWidth(CHART_WIDTH, chartData);

    // 渲染图表
    for (var item in chartData) {
        color = BarConfig.getRandomColor();
        if (chartData.hasOwnProperty(item)) {
            chartHtml += '<div class="aqi-chart-item" style="height: ' + chartData[item]*.6 + 'px;width: ' + width + 'px;background-color: '+ color;
            chartHtml += ';" title="时间：' + item + '；' + '空气质量指数：' + chartData[item] + '"></div>';
        }

    }
    chartHtml += '</div>';
    aqiCharTitle.innerHTML = chartHtml;
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    if (citySelected.value !== pageState.nowSelectCity) {
        // 设置对应数据
        pageState.nowSelectCity = citySelected.value;
        chartData = aqiSourceData[pageState.nowSelectCity];
    }

    // 调用图表渲染函数
    initAqiChartData();
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
    var target, elInput, lastNode,
        classSelect = ' selected';

    target = EventUtil.getTarget(e);        // 取得点击的目标元素
    lastNode = target.lastElementChild;
    // firefox下点击label标签会产生一个span子子节点导致无法取到input子节点
    // elInput = typeof(firstNode.value) == 'undefined'? lastNode : firstNode;
    elInput = lastNode;
    console.log(lastNode.value);
    console.log(target.lastElementChild);
    // 将被选中样式selected转移给点击目标
    if (target.className.search(classSelect) !== -1) {
        return;
    }
    for (var i = 0, len = opts.length; i < len; i++) {
        opts[i].className = opts[i].className.replace(classSelect, '');
    }
    target.className += classSelect;

    // 确定是否选项发生了变化
    if (elInput.value !== pageState.nowGraTime) {
        // 设置对应数据
        pageState.nowGraTime = elInput.value;
        // 调用图表渲染函数
        initAqiChartData();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    // 将radio上的事件绑定给祖先元素fieldset
    EventUtil.delegate(forGraTime, 'label', 'click', graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var cityOptsHtml = '';
    for (var city in aqiSourceData) {
        cityOptsHtml += '<option>' + city + '</option>';
    }
    citySelected.innerHTML = cityOptsHtml;

    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    EventUtil.delegate(forGraTime, 'select', 'change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    pageState.nowSelectCity = citySelected.value;
    var date, weekDay, i = 0, sum = 0, week= 1,
        city = pageState.nowSelectCity;
//    var dataSrc = transDataFormat(pageState.nowSelectCity);
    switch (pageState.nowGraTime) {
        case 'day': chartData = aqiSourceData[city]; break;
        case 'week':
            chartData = {};
            i =0;
            sum = 0;
            for (var item in aqiSourceData[city]) {
                date = new Date(item);
                weekDay = date.getDay();
                i++;
                sum += aqiSourceData[city][item];
                if (weekDay == 6) {
                    chartData['2016年第' + week + '周'] = Math.round(sum / i);
                    i = 0;
                    sum = 0;
                    week++;
                } else {
                    i++;
                    sum += aqiSourceData[city][item];
                }
            }
            chartData['2016年第' + week + '周'] = Math.round(sum / i);
            break;
        case 'month':
            chartData = {};
            i = 0;
            sum = 0;
            var month = -1;
            for (var item in aqiSourceData[city]) {
                date = new Date(item);
                if (month == -1) {
                    month = date.getMonth() + 1;
                } else if (date.getMonth() + 1 != month) {
                    chartData['2016-0' + month] = Math.round(sum / i);
                    month = date.getMonth() + 1;
                    i = 0;
                    sum = 0;
                }
                i++;
                sum += aqiSourceData[city][item];
            }
            chartData['2016-0' + month] = Math.round(sum / i);
            break;
    }
    renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();
