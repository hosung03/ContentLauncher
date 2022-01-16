const path = require('path');
const rimraf = require('rimraf');

function _deleteDir(dir) {

	return new Promise((resolve) => {
		const DIR = path.join(__dirname, dir);
		rimraf(DIR, function () { 
			console.log('done', dir, DIR); 
			resolve();
		});
	});

}

async function _clear() {
	console.log('==> Clear ./dist');
	await _deleteDir('./dist');
	console.log('====================================> Clear complete');
}
_clear();