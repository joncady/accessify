const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.static('public'))

let timestamps = {
	["walking.mp4"]: {
		[0]: "It works",
		[1]: "This is people walking",
		[2]: "Ok cool",
		[3]: "2 seconds",
		[4]: "2.5",
		[5]: "hello"
	},
	["flower.mp4"]: {
		[0]: "It works",
		[1]: "This is people walking",
		[2]: "Ok cool",
		[3]: "2 seconds",
		[4]: "2.5",
		[5]: "hello"
	},
	["red.mp4"]: {
		[0]: "It works",
		[1]: "This is people walking",
		[2]: "Ok cool",
		[3]: "2 seconds",
		[4]: "2.5",
		[5]: "hello"
	},
	["stuartreges.mp4"]: {
		[0]: "let's go ahead and get started",
		[1]: "let's go ahead and get started",
		[2]: "let's go ahead and get started",
		[3]: "let's go ahead and get started",
		[4]: "let's go ahead and get started",
		[5]: "let's go ahead and get started"
	}
}

app.get('/video', function (req, res) {
	let name = req.query.name;
	const path = `ex/${name}`;
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize - 1
		const chunksize = (end - start) + 1
		const file = fs.createReadStream(path, { start, end })
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
});

app.get("/transcript", (req, res) => {
	let name = req.query.name;
	res.header("Access-Control-Allow-Origin", "*");
	res.send(timestamps[name]);
});

app.get("/getallvideos", (req, res) => {
	const path = "ex";
	let files = fs.readdirSync(path);
	res.header("Access-Control-Allow-Origin", "*");
	res.send(JSON.stringify(files));
});

app.get("/image", (req, res) => {
	let image = req.query.name;
	let path = `public/${image}`;
	let file = fs.readFile(path, (err, file) => {
		res.header("content-type", "image/png");
		res.header("Access-Control-Allow-Origin", "*");
		res.end(file, "binary");
	});
})

app.listen(3000, () => console.log("Listening on 3000"));

