'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

const GENERIC_JS = 'generic.js';
const MAIN_NAME = 'ISM';
const MAIN_INDEX = 'index.html';
const MAIN_TEMPLATE = 'index.tmpl';
const MAIN_STYLESHEET = 'style.css';
const CONTROLS_TEMPLATE = 'components/control-summary.tmpl';

function generateReport(options) {

	const mainName = options.summaryName || MAIN_NAME;
	const SUMMARY_PATH = path.resolve(process.cwd(), options.summaryPath);
	let suite = {
		style: MAIN_STYLESHEET,
		ISM: options.ISM,
		name: mainName,
	};

	_createControlsOverviewIndexPage(suite);

	/**
	 * Read a template file and return it's content
	 * @param {string} fileName
	 * @return {*} Content of the file
	 * @private
	 */
	function _readTemplateFile(fileName) {
		if (fileName) {
			try {
				fs.accessSync(fileName, fs.constants.R_OK);
				return fs.readFileSync(fileName, 'utf-8');
			} catch (err) {
				return fs.readFileSync(path.join(__dirname, 'template', fileName), 'utf-8');
			}
		} else {
			return '';
		}
	}

	/**
	 * Generate the ISM Controls overview
	 * @param {object} suite JSON object with all the options
	 * @private
	 */
	function _createControlsOverviewIndexPage(suite) {

		const controlsOverviewIndex = path.resolve(SUMMARY_PATH, MAIN_INDEX);
		// Copy the assets, but first check if they don't exists and not useCDN
		if (!fs.pathExistsSync(path.resolve(SUMMARY_PATH, 'assets'))) {
			fs.copySync(
				path.resolve(path.dirname(require.resolve('./package.json')), 'template/assets'),
				path.resolve(SUMMARY_PATH, 'assets')
			);
		}
		fs.writeFileSync(
			controlsOverviewIndex,
			_.template(_readTemplateFile(MAIN_TEMPLATE))({
				controlsTableName: suite.name,
				controlsOverview: _.template(_readTemplateFile(CONTROLS_TEMPLATE))({
					suite: suite,
					_: _
				}),
				styles: _readTemplateFile(MAIN_STYLESHEET),
				genericScript: _readTemplateFile(GENERIC_JS)
			})
		);
	}

}

module.exports = {
	generate: generateReport
};
