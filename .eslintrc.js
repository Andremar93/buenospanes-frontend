module.exports = {
	extends: ["expo", "prettier"],
	plugins: ["prettier"],
	rules: {
		"prettier/prettier": [
			"error",
			{
				tabWidth: 4,
				useTabs: true,
			},
		],
	},
	ignorePatterns: ["/dist/*"],
};
