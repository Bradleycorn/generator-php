'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

function CleanURL(url) {
	if (url.indexOf('http://') === 0)
		url = url.substr(7);
	if (url.indexOf('https://') === 0)
		url = url.substr(8);
	if (url.indexOf('www.') === 0)
		url = url.substr(4);
	return url;
}


var PhpGenerator = module.exports = function PhpGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.paths = {};
  this.paths.dev = "app";
  this.paths.dist = "dist";

  this.isIIS = (options['iis']) ? true : false;

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.php'));
  this.tailFile = this.readFileAsString(path.join(this.sourceRoot(), '_/inc/tail.php'));
  this.initFile = this.readFileAsString(path.join(this.sourceRoot(), '_/inc/init.php'));
  this.headFile = this.readFileAsString(path.join(this.sourceRoot(), '_/inc/head.php'));
};

util.inherits(PhpGenerator, yeoman.generators.Base);

PhpGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);
  console.log('I\'ll be scaffolding out a php website for you.');
  console.log('Out of the box you\'re going to get:');
  console.log('- HTML5 Boilerplate');
  console.log('- jQuery (v1.10)');
  console.log('- Modernizr (v2.6.2)');
  if (this.isIIS)
 	 console.log('I see you are running windows. I\'ll take that into account');

  var prompts = [{
    name: 'siteURL',
    message: 'What\'s the production URL for this site?',
  },
  {
    name: 'devURL',
    message: 'and the dev URL? (the seccweb url)',
  },
  {
    name: 'localURL',
    message: 'and your local URL? (on your local machine)',
  },
  {
    name: 'css',
    message: 'Which CSS preprocessor shall I use (none, sass, compass)?',
    default: 'sass'
  },
  {
    name: 'bootstrap',
    message: 'Which version of Twitter Bootstrap shall I include (none, 2.3.2, 3.0.0, etc)?',
    default: '3.1.1'
  },
  {
    name: 'versioning',
    message: 'Which files should be versioned to force cache expiration (none, all, css, js, img)?',
    default: 'none'
  }];

  this.prompt(prompts, function (props) {
    this.userOpts = {};
    this.userOpts.siteURL = CleanURL(props.siteURL);
    this.userOpts.devURL = CleanURL(props.devURL);
    this.userOpts.localURL = CleanURL(props.localURL);
    this.userOpts.devPort = 80;
    this.userOpts.phpServer = false;
    this.userOpts.css = props.css.toLowerCase();
    props.bootstrap = props.bootstrap.toLowerCase().trim();
    if (props.bootstrap.search(/^\d{1,2}(\.\d{1,2})?(\.\d{1,2})?$/) == 0)
      this.userOpts.bootstrap = props.bootstrap;
    else
      this.userOpts.bootstrap = 'none';
    this.userOpts.foundation = false;

    //Default file versioning to "off" for all types
    this.userOpts.revImages = false;
    this.userOpts.revScripts = false;
    this.userOpts.revStyles = false;

    props.versioning = props.versioning.toLowerCase().trim();

    if (props.versioning == 'all') {
      //Enable versioning on all file types
      this.userOpts.revImages = true;
      this.userOpts.revScripts = true;
      this.userOpts.revStyles = true;
    } else {
      //Loop through user input and enable versioning on appropriate file types
      var fileType, i;
      var fileTypes = props.versioning.split(',');
      for(i=0;i<fileTypes.length;i++) {
        fileType = fileTypes[i].trim();
        switch (fileType) {
          case 'css':
            this.userOpts.revStyles = true;
            break;
          case 'js':
            this.userOpts.revScripts = true;
            break;
          case 'img':
            this.userOpts.revImages = true;
            break;
        }
      }
    }
    this.paths.dev = 'dev';
    this.paths.dist = 'www';

    this.urlParts = {};
    this.urlParts.devHost = this.userOpts.devURL.substring(0, this.userOpts.devURL.lastIndexOf('.'));
    this.urlParts.devURLext = props.devURL.substr(props.devURL.lastIndexOf('.') + 1);

    cb();
  }.bind(this));
};

PhpGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

PhpGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

PhpGenerator.prototype.bower = function bower() {
  this.template('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

PhpGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.template('gitignore', '.gitignore');
};

PhpGenerator.prototype.app = function app() {
  this.mkdir(this.paths.dev);
  this.mkdir(this.paths.dev + '/_');
  this.mkdir(this.paths.dev + '/_/js');
  this.mkdir(this.paths.dev + '/_/css');
  this.mkdir(this.paths.dev + '/_/img');
  this.mkdir(this.paths.dev + '/_/inc');

  if (this.userOpts.phpServer) {
    this.template('router.php', 'router.php');
    this.copy('router-dist.php', 'router-dist.php');
  }
};

PhpGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', this.paths.dev + '/favicon.ico');
  this.copy('404.html', this.paths.dev + '/404.html');
  this.copy('robots.txt', this.paths.dev + '/robots.txt');
  this.template('web.config', this.paths.dev + '/web.config');
  if (!this.isIIS)
    this.copy('htaccess', this.paths.dev + '/.htaccess');
};

PhpGenerator.prototype.styles = function styles() {
  if (this.userOpts.css == 'compass' || this.userOpts.css == 'sass') {
    this.copy('_/css/_init.scss', this.paths.dev + '/_/css/_init.scss');
    this.copy('_/css/layout.scss', this.paths.dev + '/_/css/layout.scss');
    this.copy('_/css/main.scss', this.paths.dev + '/_/css/main.scss');
  } else {
    this.copy('_/css/layout.css', this.paths.dev + '/_/css/layout.css');
    this.copy('_/css/main.css', this.paths.dev + '/_/css/main.css');
  }
};

PhpGenerator.prototype.scripts = function scripts() {
  this.copy('_/js/functions.js', this.paths.dev + '/_/js/functions.js');
  this.copy('_/js/validation.js', this.paths.dev + '/_/js/validation.js');
};

PhpGenerator.prototype.inc = function inc() {
  this.copy('_/inc/analytics.php', this.paths.dev + '/_/inc/analytics.php');
  this.copy('_/inc/footer.php', this.paths.dev + '/_/inc/footer.php');
  this.copy('_/inc/functions.php', this.paths.dev + '/_/inc/functions.php');
  this.copy('_/inc/header.php', this.paths.dev + '/_/inc/header.php');

  if (this.userOpts.foundation) {
    this.directory('_/foundation', this.paths.dev + '/_/foundation');
  }
}

PhpGenerator.prototype.writeInit = function writeInit() {
  this.initFile = this.initFile.replace(/SiteName/g, this.userOpts.siteURL);
  this.initFile = this.initFile.replace(/DevSite/g, this.userOpts.devURL);
  this.initFile = this.initFile.replace(/LocalSite/g, this.userOpts.localURL);
  this.write(this.paths.dev + '/_/inc/init.php', this.initFile);
};

PhpGenerator.prototype.writeTail = function writeTail() {
  var tailScripts = [];
  tailScripts.push('/_/bower_components/jquery/jquery.js');
  if (this.userOpts.bootstrap == 'none')
    tailScripts.push('/_/bower_components/html5-boilerplate/js/plugins.js');
  tailScripts.push('/_/js/functions.js');
  tailScripts.push('/_/js/validation.js');

  this.tailFile = this.appendScripts(this.tailFile, '/_/js/main.js', tailScripts);

  if (this.userOpts.bootstrap == '2.3.2') {
    this.tailFile = this.appendScripts(this.tailFile, '/_/js/bootstrap.js', [
      '/_/bower_components/bootstrap/docs/assets/js/bootstrap.js',
    ]);

  } else if (this.userOpts.bootstrap != 'none') {
    this.tailFile = this.appendScripts(this.tailFile, '/_/js/bootstrap.js', [
      '/_/bower_components/bootstrap/dist/js/bootstrap.js'
    ]);
  }

  if (this.userOpts.foundation) {
    this.tailFile = this.appendScripts(this.tailFile, '/_/foundation/javascripts/foundation.js', [
      '/_/foundation/javascripts/jquery.foundation.alerts.js',
      '/_/foundation/javascripts/jquery.foundation.buttons.js',
      '/_/foundation/javascripts/jquery.foundation.accordion.js',
      '/_/foundation/javascripts/jquery.foundation.mediaQueryToggle.js',
      '/_/foundation/javascripts/jquery.foundation.navigation.js',
      '/_/foundation/javascripts/jquery.foundation.tabs.js',
      '/_/foundation/javascripts/jquery.placeholder.js',
      '/_/foundation/javascripts/jquery.foundation.forms.js',
      '/_/foundation/javascripts/jquery.foundation.reveal.js',
      '/_/foundation/javascripts/jquery.foundation.orbit.js',
      '/_/foundation/javascripts/jquery.foundation.tooltips.js',
      '/_/foundation/javascripts/jquery.foundation.topbar.js',
      '/_/foundation/javascripts/jquery.foundation.joyride.js',
      '/_/foundation/javascripts/jquery.foundation.clearing.js',
      '/_/foundation/javascripts/jquery.foundation.magellan.js',
      '/_/foundation/javascripts/app.js'
    ]);
  }

  this.tailFile = this.tailFile.replace("<body>", "").replace("</body>", "");
  this.tailFile = this.tailFile.replace(/build:js/g, "build:js(" + this.paths.dev + ")");
  this.tailFile = this.tailFile.replace("[localurl]", this.userOpts.localURL);
  this.write(this.paths.dev + '/_/inc/tail.php', this.tailFile);
};

PhpGenerator.prototype.writeHead = function writeHead() {
  if (this.userOpts.bootstrap == '2.3.2') {
    this.headFile = this.appendStyles(this.headFile, '/_/css/bootstrap.css', [
        '/_/bower_components/bootstrap/docs/assets/css/bootstrap.css',
        '/_/bower_components/bootstrap/docs/assets/css/bootstrap-responsive.css'
    ]);
  } else if (this.userOpts.bootstrap != 'none') {
    this.headFile = this.appendStyles(this.headFile, '/_/css/bootstrap.css', [
        '/_/bower_components/bootstrap/dist/css/bootstrap.css',
        '/_/bower_components/bootstrap/dist/css/bootstrap-theme.css'
    ]);
  } else {
    this.headFile = this.appendStyles(this.headFile, '/_/css/lib/html5bp.css', [
        '/_/bower_components/html5-boilerplate/css/normalize.css',
        '/_/bower_components/html5-boilerplate/css/main.css'
    ]);
  }

  if (this.userOpts.foundation) {
    this.headFile = this.appendStyles(this.headFile, '/_/foundation/stylesheets/foundation.css', [
        '/_/foundation/stylesheets/foundation.css'
    ]);
  }

  this.headFile = this.appendStyles(this.headFile, '/_/css/site-styles.css', [
    '/_/css/main.css',
    '/_/css/layout.css'
  ]);

  this.headFile = this.headFile.replace("<head>", "").replace("</head>", "");
  this.headFile = this.headFile.replace(/build:css/g, "build:css({.tmp," + this.paths.dev + "})");
  this.headFile = this.headFile.replace("&lt;", "<").replace("&gt;", ">");

  if (this.userOpts.bootstrap != 'none' && this.userOpts.bootstrap != '2.3.2') {
    this.headFile += "\n<!-- build:js /_/js/respond.js -->\n<!--[if lt IE 9]>\n<script src=\"/_/bower_components/respond/respond.min.js\"></script>\n<![endif]-->\n<!-- endbuild -->\n";
  }
  this.write(this.paths.dev + '/_/inc/head.php', this.headFile);
};

PhpGenerator.prototype.writeIndex = function writeIndex() {
  var html = "        <h1>" + this.userOpts.siteURL + "</h1>";
  html += "        Your site is already wired up with:\n        <ul>\n";
  html += "            <li>Modernizr</li>\n";
  html += "            <li>Jquery (1.10)</li>\n";
  html += "            <li>HTML 5 Boilerplate</li>\n";
  if (this.userOpts.css == 'sass')
    html += "            <li>Sass Stylesheets</li>\n";
  else if (this.userOpts.css == 'compass')
    html += "            <li>Sass Stylesheets with Compass</li>\n";
  if (this.userOpts.bootstrap != 'none')
    html += "            <li>Twitter Bootstrap (v " + this.userOpts.bootstrap + ")</li>\n";
  if (this.userOpts.foundation)
    html += "            <li>Foundation (v3)</li>\n";
  html += "        </ul>\n";

  html += "        <p>Don't forget to setup your site-wide variables for DEV and LIVE in /_/inc/init.php</p>";
  this.indexFile = this.indexFile.replace('<div id="PageBody">','<div id="PageBody">\n' + html);
  this.write(this.paths.dev + "/index.php", this.indexFile);
}
