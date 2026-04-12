const safeParseJson = (text) => {
	try {
		return JSON.parse(text);
	} catch (error) {
		const match = String(text).match(/\{[\s\S]*\}/);
		if (!match) {
			return null;
		}

		try {
			return JSON.parse(match[0]);
		} catch (parseError) {
			return null;
		}
	}
};

module.exports = {
	safeParseJson,
};
