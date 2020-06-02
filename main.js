#!/usr/bin/env node
'use strict';

const rp = require('request-promise');
const $ = require('cheerio');
const fxp = require('fast-xml-parser');
const gen = require('./generate-summary');
const chalk = require('chalk');

// These two might change at any time! Ensure they match the link to the ISM xml path.
const urlCyberISM = 'https://www.cyber.gov.au/ism';
const selectorXmlISM = 'article > div > a[class=file_embedded_format_xml]';

var xmlParseOptions = {
	ignoreAttributes: true,
	trimValues: true,
	parseNodeValue: true
};

// Collect and parse the xml to generate the search page
rp(urlCyberISM).then(function (html) {
	const urlToXMLISM = $(selectorXmlISM, html)[0].attribs.href
	rp(urlToXMLISM).then(function (xmlBody) {
		var parseResult = fxp.validate(xmlBody);
		if (parseResult !== true) {
			console.error(chalk.red(result.err));
			process.exit(-1);
		}
		var ismJson = fxp.parse(xmlBody, xmlParseOptions);
		//Call generator with our ISM object
		gen.generate({
			ISM: ismJson.ISM,
			summaryPath: process.env.npm_config_outputFolder,
			summaryName: `Cyber.gov.au ISM generated at - ${new Date().toLocaleString()}`,
		});
	});
}).catch(function (err) {
	console.error("You might have to change the url and CSS selector to find the new ISM XML!");
});

