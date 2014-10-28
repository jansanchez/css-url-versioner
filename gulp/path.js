/*!!
 * 
 * gulp path
 * @author: Jan Sanchez
 *
 */

var Path = {},
	d = new Date(),
	currentDate = '';

currentDate = d.getDate().toString() + "-" + (d.getMonth()+1).toString() + "-" + d.getFullYear().toString() + "_" + d.getHours().toString() + "-"+ d.getMinutes().toString();


Path.src = { folder: 'source/' };

Path.src.coffee = Path.src.folder + 'coffee/';

Path.dest = {};

Path.dest.folder = 'dist/';
Path.dest.js = Path.dest.folder;


/* Coffee Path */
Path.coffee = {
	default : {
		src: [
			Path.src.coffee + '**/*.coffee',
			'!' + Path.src.coffee + '_**/*.coffee',
			'!' + Path.src.coffee + '**/_*.coffee'
		],
		dest: Path.dest.js
	}
};

/* Javascript Path */
Path.javascript = {
	default: {
		src: [
			Path.dest.js + '**/*.js'
		],
		dest: Path.dest.js
	},
	lint: [
		Path.dest.js + '**/*.js'
	],
	complexity: [
		Path.dest.js + '**/*.js'
	]
};


/* Clean Path */
Path.clean = {
	js: {
		package: [
			Path.dest.js + '**/*.*'
		]
	}
};

/* Watch Paths */
Path.watch = {
	coffee: [Path.src.coffee + '**/*.coffee']
};


module.exports = Path;

