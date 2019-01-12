const express = require('express');
const app = express();
const fs = require('fs');


let timestamps = {
	[0.5]: "It works",
	[1.0]: "This is people walking",
	[1.5]: "Ok cool",
	[2.0]: "2 seconds",
	[2.5]: "2.5",
	[3.0]: "hello"
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

app.get("/timestamps", (req, res) => {
	let time = req.query.time;
	let message = timestamps[time];
	res.header("Access-Control-Allow-Origin", "*");
	if (message) {
		res.send(JSON.stringify({ message: message }));
	} else {
		res.send(JSON.stringify({ message: "no transcription" }));
	}

});

app.listen(3000, () => console.log("Listening on "));
