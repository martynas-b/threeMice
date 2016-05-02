/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    copy: {
        copy_to_build: {
            files: [{
                cwd: 'dev/',
                src: 'threeMice.js',
                dest: 'build/',
                expand: true
            }]
        }
    },
    uglify: {
        options: {
          mangle: true
        },
        min_threeMice: {
      	  options: {
      	  },
	        files: {
	        	'build/threeMice.min.js': ['dev/threeMice.js'],
	        }
        }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: false,
        latedef: "nofunc",
        unused: "vars",
        scripturl: true,
        
        globals: {
          
        },
        
	    exported: {
	    	
	    }
	    
      },
        all: [
              'Gruntfile.js', 
              'dev/**/*.js',
            ]
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Default task.
  grunt.registerTask('default', ['jshint', 'uglify', 'copy']);

};
