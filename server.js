var express = require('express');
var bodyParser = require('body-parser');
var format = require('util').format;
var bunyan = require('bunyan');
var nodemailer = require('nodemailer');
var path = require('path');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname,'/')); 

var args = process.argv.slice(2);
var loglevel = args.indexOf("debug") > -1 ? bunyan.DEBUG : bunyan.INFO;

var log = bunyan.createLogger({
	name: 'cheapskater', 
	streams: 
		[
			{
				level: loglevel,
				stream: process.stdout
			},
			{
				level: loglevel,
				stream: process.stderr
			},			
			{
				level: loglevel,
				type: 'rotating-file',
				path: 'cheapskater.log',
				period: '1d',
				count: 3
			}						
		]
});

app.get('*', function(req, res) {
    res.sendFile(path.resolve('index.html'));
});

var transporter = nodemailer.createTransport({
    service: 'Yahoo',
    auth: {
        user: process.env.EmailUser,
        pass: process.env.PW
    }
});

app.post('/api/email', function(req, res){

	var mailOptions = {
	    from: process.env.EmailUser, // sender address
	    to: process.env.EmailUser, // list of receivers
	    subject: req.body.subject, // Subject line
	    text: req.body.message, // plaintext body
	    html: req.body.message // html body
	};

	log.info(req.body);
	log.info(mailOptions);


	transporter.sendMail(mailOptions, function(error, info){
    if(error){
      log.info("Error sending email");
      log.info(error);
      res.send({success: false});	
    }else{
      log.info("Success sending email");
      res.send({success: true});				
    }
	});

});



var port = process.env.PORT || 3040;
app.listen(port);
log.info('Listening on port ' + port + '...');