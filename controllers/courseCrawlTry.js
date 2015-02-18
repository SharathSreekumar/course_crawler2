var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var fs = require('fs');

var courseModel = require('../models/Course3');


mongoose.connect('mongodb://localhost:27017/course4');
mongoose.connection.on('error',function(){
    console.error('MongoDb is not connected. Check if Mongod is running.');
});

exports.createCourse = function(req,res){
    res.render('webtrial');
}

var urls = ['https://www.coursera.org','https://www.edx.org'];
var queries = ['/api/courses.v1?fields=certificates,instructorIds,partnerIds,photoUrl,specializations,startDate,v1Details,partners.v1(homeLink,logo,name),instructors.v1(firstName,lastName,middleName,prefixName,profileId,shortName,suffixName),specializations.v1(logo,partnerIds,shortName),v1Details.v1(upcomingSessionId),v1Sessions.v1(durationWeeks,hasSigTrack)&includes=instructorIds,partnerIds,specializations,v1Details,specializations.v1(partnerIds),v1Details.v1(upcomingSessionId)&extraIncludes=_facets&q=search&query=java&limit=20&courseType=v1.session,v2.ondemand','/search/api/all'];

var url1 = 'https://www.coursera.org/api/courses.v1?fields=certificates,instructorIds,partnerIds,photoUrl,specializations,startDate,v1Details,partners.v1(homeLink,logo,name),instructors.v1(firstName,lastName,middleName,prefixName,profileId,shortName,suffixName),specializations.v1(logo,partnerIds,shortName),v1Details.v1(upcomingSessionId),v1Sessions.v1(durationWeeks,hasSigTrack)&includes=instructorIds,partnerIds,specializations,v1Details,specializations.v1(partnerIds),v1Details.v1(upcomingSessionId)&extraIncludes=_facets&q=search&query=';

var query = '&limit=20&courseType=v1.session,v2.ondemand';

var url2 = 'https://www.edx.org/search/api/all';

var courseInstUrl = 'https://api.coursera.org/api/catalog.v1/instructors?id=';
var courseUnivUrl = 'https://api.coursera.org/api/catalog.v1/universities?id=';

var courseName,courseLink,courseTeach,courseTeachL,courseInstId,courseUnivId,courseUniv,cnt,courseCnt=0,univCnt=0,dataCourse,dataUniv,dataInst;

var file = 'C:/Projects/scraping/public/course.json';
var file1 = 'C:/Projects/scraping/public/instructor.json';
var file2 = 'C:/Projects/scraping/public/college.json';

storeNewCourse = function(searc){    // this function is to store value using 'post' operation
    if(fs.existsSync(file))
    {
       dataCourse = fs.readFileSync(file, 'utf8');      //copies whole json data to var dataCourse
    }
    if(fs.existsSync(file1))
    {
       dataInst = fs.readFileSync(file1, 'utf8');      //copies whole json data to var dataInst
    }
    if(fs.existsSync(file2))
    {
       dataUniv = fs.readFileSync(file2, 'utf8');      //copies whole json data to var dataUniv
    }
    //console.log(saved);
    var courseH = new courseModel();
    for(var d in dataCourse)
    courseH.course = dataCourse[d].name;
    courseH.link = dataCourse[d].photoUrl;
    courseH.courseSearcH = searc;
    courseH.instructor = dataInst[d].firstName+' '+dataInst[d].lastName;
    courseH.university = dataUniv[d].shortName;
    courseH.save();
}

startNewInstructor = function(courseInstid,d){
    console.log(" Instructor Function Success!!");
    request.get(courseInstUrl+courseInstId,function(err1,resp1, body1) {
                    //console.log(req.body.search);
    if(err1)
        return console.log(courseInstUrl+courseInstId+' error!');            //exiting at error...
        /*$1 = cheerio.load(body1);
        var data1 = JSON.parse(body1);
                    //console.log(req.body.search);
        console.log("Entering the Instructor loop.....");
        var courseTeacher = null;
        for(var i in data1.elements)
        {
            courseTeacher = courseTeacher+';'+data1.elements[i].firstName+' '+data1.elements[i].lastName;
            console.log(courseTeacher);
            return courseTeacher;
        }*/
        $1 = cheerio.load(body1);
        var data1 = JSON.parse(body1);
        
        var x = 
        console.log("Entering the Instructor loop.....");
        /*for(var i in data1.elements)
        {
            courseTeacher = courseTeacher+';'+data1.elements[i].firstName+' '+data1.elements[i].lastName;
            console.log(courseTeacher);
        }*/
        
        var saved1 = false;
        if(fs.existsSync(file1))
        {
          if(d==0)
            saved1 = fs.writeFileSync(file1,JSON.stringify(data1.elements[0]),'utf8');
          else
            saved1 = fs.appendFileSync(file1,","+JSON.stringify(data1.elements[0]),'utf8');
        }
        console.log(saved1);
        return saved1;
    });
}

startNewUniversity = function(courseUnivid,d,sear){
    console.log("University function Success!!");
    request.get(courseUnivUrl+courseUnivId,function(err2,resp2, body2) {
                    //console.log(req.body.search);
        if(err2)
            return console.log(courseUnivUrl+courseUnivId+' error!');            //exiting at error...
        /*$2 = cheerio.load(body2);
        var data2 = JSON.parse(body2);
                    //console.log(req.body.search);
        console.log("Entering the University loop.....");
        //for(var u in data2.elements)
        //{
        //    courseUniv = data2.elements[u].shortName;
        //    return courseUniv;
        //}
        courseUniv = data2.elements[0].shortName;
        return courseUniv;*/
        $2 = cheerio.load(body2);
        var data2 = JSON.parse(body2);
        console.log("Entering the University loop.....");
        courseUniv = data2.elements[0].shortName;
        //console.log(req.body.search);
        
        var saved2 = false;
        if(fs.existsSync(file2))
        {
           if(d==0)
           {
               saved2 = fs.writeFileSync(file2,JSON.stringify('['),'utf8');
               saved2 = fs.appendFileSync(file2,JSON.stringify(data2.elements[0]),'utf8');
           }
          else
            saved2 = fs.appendFileSync(file2,","+JSON.stringify(data2.elements[0]),'utf8');
          univCnt++;
          if(univCnt==courseCnt)
              saved2 = fs.appendFileSync(file2,JSON.stringify('];'),'utf8');
        }
        console.log(saved2);
        if(univCnt==courseCnt)
            storeNewCourse(sear);
        return saved2;
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
            
            var saved = false;
            if(fs.existsSync(file))
            {
                /*if(d==0)
                    saved = fs.writeFileSync(file,"{\ncourse:"+data.elements[d].name+",\nphotoUrl:"+data.elements[d].photoUrl+",\ninstructorId:"+data.elements[d].instructorIds[0]+",\nunivId:"+data.elements[d].partnerIds[0]+"}",'utf8');
                else
                    saved = fs.appendFileSync(file,",\n{\ncourse:"+data.elements[d].name+",\nphotoUrl:"+data.elements[d].photoUrl+",\ninstructorId:"+data.elements[d].instructorIds[0]+",\nunivId:"+data.elements[d].partnerIds[0]+"}",'utf8');
                    */
                saved = fs.writeFileSync(file,JSON.stringify(data.elements),'utf8');
            }
            console.log(saved);
            courseName = data.elements[d].name;
            courseLink = data.elements[d].photoUrl;
            courseCnt++;
            courseInstId = data.elements[d].instructorIds[0];
            courseUnivId = data.elements[d].partnerIds[0];
            courseTeach = startNewInstructor(courseInstId,d);
            courseUniv = startNewUniversity(courseUnivId,d,req.body.search);
            
            //---->>>>
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