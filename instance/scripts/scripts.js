const { execSync } = require('child_process');

const LINE_JUMP_REGEX = /\n/g;

const getMyOwnIP = () => {
	let ownIp = execSync('hostname -i').toString();
	ownIp = ownIp.trim();
	ownIp = ownIp.replace(LINE_JUMP_REGEX, '');
	return ownIp;
};

module.exports = {
	getMyOwnIP,
};
