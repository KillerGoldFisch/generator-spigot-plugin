'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var httpreq = require('httpreq');

// Get all Matches and Groups for a RegEx String
function getMatches(string, regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while (match = regex.exec(string)) {
    matches.push(match[index]);
  }
  return matches;
}

module.exports = Generator.extend({
  prompting: function (mute, callback) {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the impeccable ' + chalk.red('generator-spigot-plugin') + ' generator!'
    ));

    var rex = />([0-9\.\-R]+-SNAPSHOT)\/</gm;
    httpreq.get('https://hub.spigotmc.org/nexus/content/groups/public/org/spigotmc/spigot-api/', function (err, res){
      var spigot_versions = null;
      if (err) spigot_versions = ['1.11.2-R0.1-SNAPSHOT']
      else spigot_versions = getMatches(res.body, rex, 1);


      var prompts = [{
          type: 'input',
          name: 'title',
          message: 'Name your project',
          default: this.config.get('title'),
          validate: function (input) {
            return input ? true : false;
          }
        },
        {
          type: 'input',
          name: 'description',
          message: 'What\'s your project about? (optional)',
          default: this.config.get('description') || null
        },
        {
          type: 'input',
          name: 'author',
          message: 'What\'s your name?',
          default: this.config.get('author'),
          validate: function (input) {
            return input ? true : false;
          }
        },
        {
          type: 'input',
          name: 'namespace',
          message: 'Choose a package namespace',
          default: this.config.get('namespace') || null
        },
        {
        type: 'list',
        name: 'spigot_version',
        message: 'Choose a Spigot version',
            choices: spigot_versions
        }
      ];

      return this.prompt(prompts).then(function (props) {
        // To access props later use this.props.someAnswer;
        this.props = props;

        if (callback) {
          callback(this.package);
        } else {
          done();
        }
      }.bind(this));
    }.bind(this));
    

  },

  writing: function () {
    var namespace = (this.props.namespace || '').replace(/\./g, '/');
    this.props.namespacepath = namespace

    var tmpl = function(t, src, dst) {
      t.fs.copyTpl(
        t.templatePath(src),
        t.destinationPath(dst),
        {props: t.props}
      );
    };

    tmpl(this, 'README.md', 'README.md');

    tmpl(this, '.gitignore', '.gitignore');
    tmpl(this, '.editorconfig', '.editorconfig');

    tmpl(this, 'build.gradle', 'build.gradle');
    tmpl(this, 'pom.xml', 'pom.xml');
    

    tmpl(this, 'Main.java', path.join('src/main/java', namespace, 'Main.java'));
    tmpl(this, 'BuildInfo.java.templ', path.join('src/main/java', namespace, 'BuildInfo.java.templ'));
    tmpl(this, 'config.yml', 'src/main/resources/config.yml');
    tmpl(this, 'plugin.yml.templ', 'src/main/resources/plugin.yml.templ');

  },
});