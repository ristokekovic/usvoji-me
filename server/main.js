import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  UploadServer.init({
      tmpDir: '/public/uploads',
      uploadDir:  '/public/uploads',
      checkCreateDirectories: true,
      uploadUrl: '/upload',
      // *** For renaming files on server
	  getFileName: function(file, formData) {
	  	return new Date().getTime() + '-' + Math.floor((Math.random() * 10000) + 1) + '-' + file.name; 
	  	// we get this value in the ajax response
	  }
    });
});

Images.allow({
  'insert': function () {
    // add custom authentication code here
    return true;
  }
});
