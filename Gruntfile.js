/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jscs: {
      options: {
        preset: 'node-style-guide'
      },
      build: {
        files: [
          { expand: true,
            cwd: 'src/js/',
            src: ['**/*.js', '!lib/**/*.js']
          }
        ]
      }
    },
    jshint: {
      options: {
        boss: true,
        browser: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        globals: {},
        latedef: true,
        noarg: true,
        undef: true,
        unused: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        files: [
          { expand: true,
            cwd: 'src/js/lib/',
            src: ['**/*.js']
          }
        ]
      },
      app_test: {
        files: [
          { expand: true,
            cwd: '<%= jscs.build.files.cwd %>',
            src: '<%= jscs.build.files.src %>',
          }
        ]
      }
    },
    qunit: {
      //files: ['test/**/*.html']
      lib_test: {
        files: [
          { expand: true,
            cwd: 'src/js/lib-test/',
            src: ['**/*.js']
          }
        ]
      },
      app_test: {
        files: [
          { expand: true,
            cwd: 'src/js/test/',
            src: ['**/*.js']
          }
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      build: {
        files: [
          //{src: ['src/js/**/*.js', '!src/js/lib/**/*.js'], dest: 'dev/js/<%= pkg.name %>.js'}
          { expand: true,
            cwd: '<%= jscs.build.files.cwd %>',
            src: '<%= jscs.build.files.src %>',
            dest: 'dev/js/<%= pkg.name %>.js'
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        files: [
          //{src: ['<%= concat.build.files.dest %>'], dest: 'dev/dist/<%= pkg.name %>.min.js'}
          { expand: true,
            src: '<%= concat.build.files.dest %>',
            dest: 'dev/js/',
            ext: '.min.js',
            extDot: 'first'
          }
        ]
      }
    },
    responsive_images: {
      build: {
        options: {
          engine: 'im',
          sizes: [{
            name: 'small',
            width: '30%',
            suffix: '_small',
            quality: 20
          },{
            name: 'large',
            width: '50%',
            suffix: '_large',
            quality: 40
          }]
        },
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['*.{gif,jpg,png}'],
          dest: 'dev/images/'
        }]
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-responsive-images');

  // CSS-related tasks.
  grunt.registerTask('lintcss', 'Validate css quality', ['jscs', 'jshint']);
  grunt.registerTask('testcss', 'Test validated css', ['lintcss', 'qunit']);

  // JS-related tasks.
  grunt.registerTask('lintjs', 'Validate javascript quality', ['jscs', 'jshint']);
  grunt.registerTask('testjs', 'Test validated javascript', function() {
    grunt.task.run(['lintjs', 'qunit']);
  });
  grunt.registerTask('js', 'Check and build javascript', function() {
    grunt.task.run(['testjs', 'concat', 'uglify']);
  });

  // Optimization tasks.
  grunt.registerTask('img', ['responsive_images']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
};
