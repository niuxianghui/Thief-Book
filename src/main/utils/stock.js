'use strict';
var request = require('request');


const url = 'http://hq.sinajs.cn/list=';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
}

export default {
    getData(display_shares_list, callback) {
        var code = display_shares_list[0];
        var stock_number = display_shares_list[1];
        var stock_avg = display_shares_list[2];
        request({
            url: url + code,
            method: "GET",
            encoding: null,
            headers: headers
        }, function (err, res, body) {
            var arr = body.toString().split(",")
            var today_price = parseFloat(arr[2]);
            var curr_price = parseFloat(arr[3]);
            var buy1 = parseFloat(arr[11]);
            var buy1Count = parseInt(arr[10])/100;
            var sell1 = parseFloat(arr[21]);
            var sell1Count = parseInt(arr[20])/100;
            var percentage = (curr_price - today_price) / today_price * 100;
            // 计算当前总股价
            var sumPrice = curr_price * stock_number;
            var sumChengben = stock_avg * stock_number;
            var diff = sumPrice - sumChengben;
            var text = curr_price.toFixed(2) +
             " " + percentage.toFixed(2) + " " + buy1.toFixed(2) + ":" +
              buy1Count.toFixed(0) + " " + sell1.toFixed(2) + 
              ":" + sell1Count.toFixed(0) + " " + stock_avg + " " + diff.toFixed(2);
            callback(text)
        })
    }
};
