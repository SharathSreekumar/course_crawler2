var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

var courseModel = require('../models/Course3');

mongoose.connect('mongodb://localhost:27017/course4');
mongoose.connection.on('error',function(){
    console.error('MongoDb is not connected. Check if Mongod is running.');
});

exports.createCourse = function(req,res){
    res.render('webtrial');
}

storeNewCourse = function(searc,crc,lk,instructor,university){    // this function is to store value using 'post' operation
    var courseH = new courseModel();
    courseH.course = crc;
    courseH.link = lk;
    courseH.courseSearcH = searc;
    courseH.instructor = instructor;
    courseH.university = university;
    courseH.save();
}

var urls = ['https://www.coursera.org','https://www.edx.org'];
var queries = ['/api/courses.v1?fields=certificates,instructorIds,partnerIds,photoUrl,specializations,startDate,v1Details,partners.v1(homeLink,logo,name),instructors.v1(firstName,lastName,middleName,prefixName,profileId,shortName,suffixName),specializations.v1(logo,partnerIds,shortName),v1Details.v1(upcomingSessionId),v1Sessions.v1(durationWeeks,hasSigTrack)&includes=instructorIds,partnerIds,specializations,v1Details,specializations.v1(partnerIds),v1Details.v1(upcomingSessionId)&extraIncludes=_facets&q=search&query=java&limit=20&courseType=v1.session,v2.ondemand','/search/api/all'];

var url1 = 'https://www.coursera.org/api/courses.v1?fields=certificates,instructorIds,partnerIds,photoUrl,specializations,startDate,v1Details,partners.v1(homeLink,logo,name),instructors.v1(firstName,lastName,middleName,prefixName,profileId,shortName,suffixName),specializations.v1(logo,partnerIds,shortName),v1Details.v1(upcomingSessionId),v1Sessions.v1(durationWeeks,hasSigTrack)&includes=instructorIds,partnerIds,specializations,v1Details,specializations.v1(partnerIds),v1Details.v1(upcomingSessionId)&extraIncludes=_facets&q=search&query=';

var query = '&limit=20&courseType=v1.session,v2.ondemand';

var url2 = 'https://www.edx.org/search/api/all';

var courseInstUrl = 'https://api.coursera.org/api/catalog.v1/instructors?id=';
var courseUnivUrl = 'https://api.coursera.org/api/catalog.v1/universities?id=';

var courseName,courseLink,courseTeach,courseTeachL,courseInstId,courseUnivId,courseUniv,cnt;

startNewInstructor = function(courseInstid){
    console.log(" Instructor Function Success!!");
    request.get(courseInstUrl+courseInstId,function(err1,resp1, body1) {
                    //console.log(req.body.search);
    if(err1)
        return console.log(courseInstUrl+courseInstId+' error!');            //exiting at error...
        $1 = cheerio.load(body1);
        var data1 = JSON.parse(body1);
                    //console.log(req.body.search);
        console.log("Entering the Instructor loop.....");
        var courseTeacher = null;
        for(var i in data1.elements)
        {
            courseTeacher = courseTeacher+';'+data1.elements[i].firstName+' '+data1.elements[i].lastName;
            console.log(courseTeacher);
            return courseTeacher;
        }
    });
}

startNewUniversity = function(courseUnivid){
    console.log("University function Success!!");
    request.get(courseUnivUrl+courseUnivId,function(err2,resp2, body2) {
                    //console.log(req.body.search);
        if(err2)
            return console.log(courseInstUrl+courseInstId+' error!');            //exiting at error...
        $2 = cheerio.load(body2);
        var data2 = JSON.parse(body2);
                    //console.log(req.body.search);
        console.log("Entering the University loop.....");
        /*for(var u in data2.elements)
        {
            courseUniv = data2.elements[u].shortName;
            return courseUniv;
        }*/
        courseUniv = data2.elements[0].shortName;
        return courseUniv;
    });
}

exports.startNewCollection = function(req,res) {
    
    request.get(url1+req.body.search+query,function(err,resp, body) {
        console.log(req.body.search);
        if(err)
            return console.log(url1+req.body.search+query+' error!');            //exiting at error...
        $ = cheerio.load(body);
        var data = JSON.parse(body);
        console.log(req.body.search);
        console.log("Entering the main loop.....");
        for(var d in data.elements)
        {
            console.log("Loop main Success!!");
            //console.log(data[d].l);
            //console.log(data[d].url);
            //createCourse;
            courseName = data.elements[d].name;
            courseLink = data.elements[d].photoUrl;
            courseInstId = data.elements[d].instructorIds[0];
            courseUnivId = data.elements[d].partnerIds[0];
            //courseTeach = startNewInstructor(courseInstId);
            //courseUniv = startNewUniversity(courseUnivId);
            
            request.get(courseUnivUrl+courseUnivId,function(err2,resp2, body2) {
                    //console.log(req.body.search);
                if(err2)
                    return console.log(courseInstUrl+courseInstId+' error!');            //exiting at error...
                
                    //console.log(req.body.search);
                
                request.get(courseInstUrl+courseInstId,function(err1,resp1, body1) {
                    //console.log(req.body.search);
                    if(err1)
                        return console.log(courseInstUrl+courseInstId+' error!');            //exiting at error...
                    $1 = cheerio.load(body1);
                    var data1 = JSON.parse(body1);
                    
                    console.log("Entering the Instructor loop.....");
                /*for(var i in data1.elements)
                {
                    courseTeacher = courseTeacher+';'+data1.elements[i].firstName+' '+data1.elements[i].lastName;
                    console.log(courseTeacher);
                }*/
                    courseTeach = data1.elements[0].firstName+' '+data1.elements[0].lastName;
                    
                    $2 = cheerio.load(body2);
                    var data2 = JSON.parse(body2);
                    console.log("Entering the University loop.....");
                    courseUniv = data2.elements[0].shortName;
                    //console.log(req.body.search);
                    
                    console.log(req.body.search+' '+data.elements[d].name+' '+data.elements[d].photoUrl+' '+courseTeach+' '+courseUniv);
                    console.log("database Execution..");
                    storeNewCourse(req.body.search,data.elements[d].name,data.elements[d].photoUrl,courseTeach,courseUniv);
                });
            });
            //setTimeout(storeNewCourse(req.body.search,data.elements[d].name,data.elements[d].photoUrl,courseTeach,courseUniv),10000);
            //storeNewCourse(req.body.search,data.elements[d].name,data.elements[d].photoUrl,courseTeach,courseUniv);
        }
        console.log("Final Success!!");
    });
}


/*exports.startNewCollection = function(req,res) {
    request.get(url1+req.body.search+query,function(err,resp, body) {
        console.log(req.body.search);
        if(err)
            return console.log(url1+req.body.search+query+' error!');            //exiting at error...
        $ = cheerio.load(body);
        var data = JSON.parse(body);
        console.log(req.body.search);
        console.log("Entering the loop.....");
        for(var d in data.elements)
        {
            //console.log(data[d].l);
            //console.log(data[d].url);
            //createCourse;
            universityId = data.elements[d].partnerIds[0];
            console.log(universityId);
            console.log(data.linked);
            //var partners = data.linked.partners.v1; 
            console.log(data.linked.partners);
            for(var p in partners)
            {
                partner = data.linked.partners[p].id;
                console.log(universityId);
                console.log(universityId);
                console.log(partner);
                if(university==partner)
                {
                    university=data.linked.partners.v1[p].name;
                    console.log(university);
                    break;
                }
            }
            console.log(data.linked.partners.v1);
                storeNewCourse(req.body.search,data.elements[d].name,university,data.elements[d].photoUrl);
        }
        console.log("Success!!");
    });
}
*/

exports.displayAllCourse = function(req,res){
    courseModel.find(req.params.course,function(err,courses){
        if(err)
            res.send(err);
        //res.json(courses);
        res.render('index',{
            courses : courses
        });
    });
    
}