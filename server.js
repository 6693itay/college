const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const app = express();

const sequelize = require('./db');
const teacherAuth = require('./middleware/teacherAuth');
const auth = require('./middleware/auth');
const { getCourseDaysBoolArray, incrementDate } = require('./helperFunctions');

const Attendances = sequelize.import(__dirname + "/models/Attendances");
const Courses = sequelize.import(__dirname + "/models/Courses");
const Students = sequelize.import(__dirname + "/models/Students");
const Teachers = sequelize.import(__dirname + "/models/Teachers.js");
const users = sequelize.import(__dirname + "/models/users.js");
const tokens = sequelize.import(__dirname + "/models/tokens.js");
require('./config');

const port = process.env.port;

// db.users.create({ id: "123456789", username: "admin", password: "admin", role: "teacher" })
//     .then((user) => console.log(user.get({plain:true})))
//     .catch((err) => console.log(err));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    sequelize
        .authenticate()
        .then(() => {
            next();
        })
        .catch(err => {
            res.status(500).send(err);
        });
});
app.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("Request must contain username and password.");
    }
    var userRole;
    users.findByCredentials(req.body.username, req.body.password)
        .then((user) => {
            userRole = user.role;
            return users.generateToken(user.id);
        })
        .then(async (userToken) => {
            if (userRole == "student") {
                return res.send({ details: await Students.findByPk(userToken.id), token: userToken.token, teacher: false });
            }
            res.send({ details: await Teachers.findByPk(userToken.id), token: userToken.token, teacher: true })
        })
        .catch((err) => {
            console.log(err);
            res.status(401).send(err)
        });
});
app.post('/logout', (req, res) => {
    let token = req.header("auth");
    if (!token) {
        return res.status(401).send({ error: "Token is needed" });
    }
    tokens.findByPk(token).then((userToken) => {
        if (userToken) {
            userToken.destroy();
            res.send({ message: "Logged out successfully" });
        } else {
            res.status(401).send({ error: "Invalid token." });
        }
    });
});
app.get('/students', teacherAuth, async (req, res) => {
    res.send(await Students.findAll());
});
app.post('/student', teacherAuth, (req, res) => {
    let student = _.pick(req.body, ['id', 'name', 'phoneNumber', 'city']);
    Students.create(student)
        .then((student) => res.send(student))
        .catch((err) => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).send({ error: "Student already in database" });
            }
            res.status(400).send(err)
            console.log(err);
        });
});
app.post('/course', teacherAuth, (req, res) => {
    let course = _.pick(req.body, ['name', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'startDate', 'endDate']);
    console.log(course);
    Courses.create(course)
        .then((course) => res.send(course))
        .catch((err) => res.status(400).send(err));
});
app.get('/courses', auth, async (req, res) => {
    res.send(await Courses.findAll());
});
app.get('/course', auth, async (req, res) => {

    res.send(await Courses.findByPk(req.query.courseId));
});
app.post('/course-student', teacherAuth, async (req, res) => {
    let courseId = req.body.courseId;
    let studentId = req.body.studentId;
    if (!(courseId && studentId)) {
        return res.status(400).send("Request must contain courseId and StudentId");
    }
    let course = await Courses.findByPk(courseId);
    let student = await Students.findByPk(studentId);
    if (!course) {
        return res.status(404).send("Course not found");
    }
    if (!student) {
        return res.status(404).send("Student not found");
    }
    let courseDaysBoolArray = getCourseDaysBoolArray(course);
    let endDate = new Date(course.endDate);
    let date = new Date(course.startDate);
    while (date <= endDate) {
        if (courseDaysBoolArray[date.getDay()]) {
            try {
                await Attendances.addNewAttendance(studentId, courseId, date);
            } catch (err) {
                res.status(400).send(err);
                return;
            }
        }
        incrementDate(date);
    }
    res.send({ message: `Student ${studentId} signed to course ${courseId} successfully` });
});
app.get('/attendances-students', teacherAuth, async (req, res) => {
    res.send(await Attendances.findAll());
});
app.get('/attendances-student', auth, async (req, res) => {
    if (req.user.role == "teacher") {
        console.log(req.query);
        res.send(await Attendances.findAll(({ where: { studentId: req.query.studentId } })));
    } else {
        res.send(await Attendances.findAll(({ where: { studentId: req.user.id } })));
    }
});
app.patch('/attendance-student', auth, (req, res) => {
    console.log(req.body);
    let attendance = _.pick(req.body, ['courseId', 'sessionDate', 'attended', 'message']);
    if (!(attendance.courseId && attendance.sessionDate && attendance.attended!==undefined)) {
        res.status(400).send("Request must contain: courseId, sessionDate, attended");
    }
    if (req.user.role == 'teacher') {
        attendance.studentId = req.body.studentId;
    } else {
        attendance.studentId = req.user.id;
    }
    attendanceQueryObject=_.pick(attendance,['studentId','courseId', 'sessionDate'])
    Attendances.findOne({ where: attendanceQueryObject })
        .then((foundAttendance) => {
            if (!foundAttendance) {
               return res.status(404).send("The requested attendance not found.");
            }
            foundAttendance.update(attendance)
                .then(updatedAttendance => res.send(updatedAttendance))
                .catch((err) => res.status(400).send(err));
        })
});
app.patch('/change-password', auth, (req, res) => {
    console.log(req.body);
    if (!req.body.oldPassword || !req.body.newPassword) {
        return res.status(400).send("Request must contain oldPassword and newPassword.")

    }
    users.findByCredentials(req.user.username, req.body.oldPassword)
        .then((user) => {
            user.update({ password: req.body.newPassword })
                .then(() => res.send({ message: "Password changed successfully." }))

        }).catch((err) => {
            console.log(err);
            res.status(401).send({ error: err })
        });
});
app.patch('/change-username', auth, (req, res) => {
    if (!req.body.password || !req.body.newUsername) {
        return res.status(400).send({ error: "Request must contain oldPassword and newUsername." })
    }
    users.findByCredentials(req.user.username, req.body.password)
        .then((user) => user.update({ username: req.body.newUsername }))
        .then(() => res.send({ message: "Username changed successfully." }))
        .catch((err) => {
            if (err == "Incorrect credentials") {
                res.status(401).send({ error: { err } });
            } else {
                res.status(400).send({ error: "Username already in use" });
            }

        });
});
app.listen(port, () => {
    console.log("listening on port " + port);
});




