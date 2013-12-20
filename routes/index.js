/*
 * GET home page.
 */

exports.index = function (req, res) {
    //res.render('index', { title: '用AngularJS开发下一代Web应用' });
    var clientId = Math.random() * 1000000;
    clientId = (clientId+'').substring(0,6)+(+new Date);
    //res.send({clientId:clientId});
    res.render('index', { title: '牛牛'});
};