/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    // HTML-focused
    htmlhint: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'dev/',
            src: ['*.htm*'],
          }
        ],
        options: {
          'tag-pair': true,
          'tagname-lowercase': true,
          //'tag-self-close': true,
          'attr-lowercase': true,
          'attr-value-double-quotes': true,
          'attr-no-duplication': true,
          'spec-char-escape': true,
          'id-unique': true,
          'doctype-first': true,
          'img-alt-require': true,
          'doctype-html5': true,
          'space-tab-mixed-disabled': true
        }
      }
    }, //htmlhint

    htmlmin: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'dev/',
            src: ['*.htm*'],
            dest: 'prod/',
            ext: '.html'
          }
        ],
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        }
      }
    }, //htmlmin

    validation: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'prod/',
            src: ['*.htm*']
          }
        ],
        options: {
            reset: grunt.option('reset') || false,
            relaxerror: [
              'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
              'This interface to HTML5 document checking is deprecated.'
            ] //ignores these errors 
        }
     }
    }, //validation

    // Image-focused
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [
            {
              name: 'xsmall',
              width: 320,
              quality: 20
            },
            {
              name: 'small',
              width: 480,
              quality: 20
            },
            {
              name: 'medium',
              width: 640,
              quality: 30
            },
            {
              name: "large",
              width: 800,
              quality: 30
            },
            {
              name: "xlarge",
              width: 960,
              quality: 40
            },
            {
              name: "xxlarge",
              width: 1024,
              quality: 40
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'dev/images/',
            src: ['*.{gif,jpg,png}'],
            dest: 'prod/images/'
          }
        ]
      }
    }, //responsive_images

    imagemin: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'dev/images/',
            src: ['*.{png,jpg,jpeg,gif}'],
            dest: 'prod/images/'
          }
        ],
        options: {
          svgoPlugins: [
            { removeViewBox: false },
            { removeUselessStrokeAndFill: false },
            { removeEmptyAttrs: false }
          ]
        }
      }
    }, //imagemin

    rename: {
      moveXSmall: {
        files: [
          {
            expand: true,
            cwd: 'prod/images/',
            src: ['*xsmall.{gif,jpg,png}'],
            dest: 'prod/images/xsmall/'
          }
        ]
      },
      moveSmall: {
        files: [
          {
            expand: true,
            cwd: 'prod/images/',
            src: ['*small.{gif,jpg,png}'],
            dest: 'prod/images/small/'
          }
        ]
      },
      moveMedium: {
        files: [
          {
            expand: true,
            cwd: 'prod/images/',
            src: ['*medium.{gif,jpg,png}'],
            dest: 'prod/images/medium/'
          }
        ]
      },
      moveLarge: {
        files: [
          {
            expand: true,
            cwd: 'prod/images/',
            src: ['*large.{gif,jpg,png}'],
            dest: 'prod/images/large/'
          }
        ]
      },
      moveXLarge: {
        files: [
          {
            expand: true,
            cwd: 'prod/images/',
            src: ['*xlarge.{gif,jpg,png}'],
            dest: 'prod/images/xlarge/'
          }
        ]
      },
      moveXXLarge: {
        files: [
          {
            expand: true,
            cwd: 'prod/images/',
            src: ['*xxlarge.{gif,jpg,png}'],
            dest: 'prod/images/xxlarge/'
          }
        ]
      }
    },

    // CSS-focused
    postcss: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'dev/css/',
            src: ['*.css', '!*.min.css'],
            dest: 'prod/css/',
            ext: '.css'
          }
        ],
        options: {
          processors: [
            require('pixrem')(), // add fallbacks for rem units
            require('autoprefixer-core')({browsers: 'last 2 versions'}), // add vendor prefixes
            require('cssnano')() // minify the result
          ]
        }
      }
    }, //postcss

    //JS-focused
    jshint: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'dev/js/',
            src: ['*.js']
          }
        ]
      },
      options: {
        //Report errors but pass the task
        force: true
      }
    }, //jshint

    uglify: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'dev/js',
            src: ['*.js'],
            dest: 'prod/js',
            ext: '.js'
          }
        ],
        options: {
          preserveComments: 'some',
          quoteStyle: 1,
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            drop_debugger: true,
            conditionals: true,
            comparisons: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            if_return: true,
            join_vars: true,
            warnings: true,
            drop_console: true
          }
        }
      }
    }, //uglify
    
    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'prod/',
            src: ['css', 'images']
          }
        ],
      },
      css: {
        files: [
          {
            expand: true,
            cwd: 'prod/',
            src: ['css']
          }
        ],
      },
      img: {
        files: [
          {
            expand: true,
            cwd: 'prod/',
            src: ['images']
          }
        ],
      },
    }, //clean

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['prod/css', 'prod/images']
        },
      },
      css: {
        options: {
          create: ['prod/css']
        },
      },
      img: {
        options: {
          create: ['prod/images']
        },
      },
    }, //mkdir

    /* Copy the "fixed" images that don't go through processing into the images/directory */
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'dev/',
            src: 'images/fixed/*.{gif,jpg,png}',
            dest: 'prod/'
          }
        ]
      },
    }, //copy

    watch: {
      dev: {
          files: ['dev/**/*'],
          tasks: ['newer:concurrent']
      }, //dev
      html: {
          files: ['*.htm*'],
          tasks: ['newer:htmlhint:build', 'newer:htmlmin:build', 'newer:htmlvalid:build']
      }, //html
      css: {
          files: ['dev/css/*.css'],
          tasks: ['newer:postcss:build']
      }, //css
      img: {
          files: ['dev/imgages/*'],
          tasks: ['clean:img', 'copy', 'newer:responsive_images:build','newer:imagemin:build']
      }, //img
      options: {
        livereload: true, // reloads browser on save
        spawn: false,
        debounceDelay: 1000,
      }
    }, //watch

    concurrent: {
      first: ['htmlhint:build', 'postcss:build', 'responsive_images:build'],
      second: ['htmlmin:build', 'uglify:build', 'imagemin:build'],
      third: ['htmlvalid:build', 'rename'],
      options: {
        limit: 4
      }
    } //concurrent
  }); //initConfig

  grunt.registerTask('default', 'watch:dev');
  grunt.registerTask('init', ['clean:dev', 'mkdir:dev', 'copy']);
  grunt.registerTask('build', ['clean:dev', 'mkdir:dev', 'copy', 'newer:concurrent']);
  grunt.registerTask('prod', ['htmlmin:build', 'validation:build','postcss:build', 'uglify:build']);
  grunt.registerTask('img', ['copy', 'responsive_images', 'imagemin', 'rename']);
};
