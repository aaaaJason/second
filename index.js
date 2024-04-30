
const express = require('express')
const app = express()

const cors = require('express') //解决跨域问题
app.use(cors())

const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
// 处理 x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// 处理 mutipart/form-data
app.use(multiparty())
// 处理 application/json
app.use(bodyParser.json())
//导入我们上一步写的连接数据库的函数
const {conMysql} = require('./mysql')
//创建统一的返回报文对象
class Response {
	constructor(isSucceed, msg, code, data) {
		this.isSucceed = isSucceed;
		this.msg = msg;
		this.code = code;
		this.data = data;
	}
}

//根据前端传过来的id查询数据库中对应的id的信息
app.get('/getUserInfo', (req, res) => {
	let sql = 'select * from com'
	conMysql(sql).then(result => {
		let response = new Response(true, '获取成功', 200, result)
		res.send(response)
	}).catch(err => {
		res.status(500).send('数据库连接出错!')
	})
})

//根据前端传过来的id查询数据库中对应的id的信息
app.get('/getUserData', (req, res) => {
	let sql = 'select * from cdata'
	conMysql(sql).then(result => {
		let response = new Response(true, '获取成功', 200, result)
		res.send(response)
	}).catch(err => {
		res.status(500).send('数据库连接出错!')
	})
})
app.post('/insertData', (req, res) => {
    // 从请求体中获取要插入的数据
    const { cid, specia, abnormal, sick, personal } = req.body;

    // 构建插入数据的 SQL 语句
    const sql = `INSERT INTO com (cid, specia, abnormal, sick, personal) VALUES (${cid}, ${specia}, ${abnormal}, ${sick}, ${personal})`;

    // 执行 SQL 语句
    conMysql(sql, [cid,specia,abnormal,sick,personal])
        .then(result => {
            // 构建响应对象并发送给客户端
            const response = new Response(true, '插入成功', 200, result);
            res.send(response);
        })
        .catch(err => {
            // 如果插入失败，则发送错误信息给客户端
            const response = new Response(false, '插入失败', 500, err.message);
            res.status(500).send(response);
        });
});
app.post('/delData', (req, res) => {
    const { cid } = req.body;

    // 构建删除数据的 SQL 语句
    const sql = `DELETE FROM com  WHERE cid = ${cid}`;

    // 执行 SQL 语句
    conMysql(sql,[cid])
        .then(result => {
            // 构建响应对象并发送给客户端
            const response = new Response(true, '删除成功', 200, result);
            res.send(response);
        })
        .catch(err => {
            // 如果删除失败，则发送错误信息给客户端
            const response = new Response(false, '删除失败', 500, err.message);
            res.status(500).send(response);
        });
});
app.post('/upData', (req, res) => {
    const { cid, specia, abnormal, sick, personal } = req.body;

    // 构建删除数据的 SQL 语句
    const sql = `UPDATE com SET specia=${specia},abnormal= ${abnormal},sick= ${sick},personal= ${personal} WHERE cid =${cid}`;

    // 执行 SQL 语句
    conMysql(sql, [cid,specia,abnormal,sick,personal])
        .then(result => {
            const response = new Response(true, '更新成功', 200, result);
            res.send(response);
        })
        .catch(err => {
            const response = new Response(false, '更新失败', 500, err.message);
            res.status(500).send(response);
        });
});

app.use((req, res) => {
	res.status(404);
	res.send('<h1>Error 404: Resource not found</h1>')
  })

//监听node服务器的端口号
app.listen(3000, () => {
	console.log('恭喜你，服务器启动成功')
})