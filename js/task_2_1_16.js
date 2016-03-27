/**
 * Created by Boyce on 2016/3/27.
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {


    var inputCity = document.querySelector('#aqi-city-input'),      //获取输入的城市名
        city = inputCity.value.trim(),
        inputAqi = document.querySelector('#aqi-value-input'),      //获取空气质量
        aqi = inputAqi.value.trim(),
        validCity = /^[\u4e00-\u9fa5A-Za-z]+$/,       //匹配中英文字符
        validAqi = /^\d+$/;           //匹配非负整数

    if (!validCity.test(city)) {
        alert('输入无效！城市名必须为中英文字符！');
        inputCity.focus();
        return;
    }

    if (!validAqi.test(aqi)) {
        alert('输入无效！空气质量指数必须为非负整数！');
        inputAqi.focus();
        return;
    }

    aqiData[city] = aqi;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList(src) {
    var /*rowCache = [],          //缓存表格行*/
        row = '',
        rowS = '<tr><td>',
        rowE = '</td></tr>',
        tdES = '</td><td>',
        delHtml = '<button>删除</button>';

    row += rowS + '城市' + tdES + '空气质量' + tdES + '操作' + rowE;
//    rowCache.push(row);
    for (var city in src) {
        row += rowS + city + tdES + src[city] + tdES + delHtml + rowE;
//        rowCache.push(row);
//        console.log(rowCache);
    }
    document.querySelector('#aqi-table').innerHTML = row;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList(aqiData);
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
    var target, elTr, elTable, cityDel;

    target = EventUtil.getTarget(e);        //获取点击的元素
    elTr = target.parentNode.parentNode;    //取得元素所在行
    elTable =elTr.parentNode;               //取得元素所属表格
    elTable.removeChild(elTr);              //移除点击元素所在行

    cityDel = elTr.firstChild.textContent;
    delete aqiData[cityDel];
//    renderAqiList(aqiData);
}

function init() {
    var addBtn = document.querySelector('#add-btn'),          //获取添加按钮
        delBtn = document.querySelector('#aqi-table');        //获取操作表格

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    EventUtil.addHandler(addBtn, 'click', addBtnHandle);

    // 将button元素的点击事件冒泡到表元素处理
    EventUtil.delegate(delBtn, 'button', 'click', delBtnHandle);
}

init();
