const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const Task = require('./models/Tasks');
const Pom = require('./models/Pomz');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

mongoose.connect('mongodb://tim:pass@ds251287.mlab.com:51287/pomodoro-app-dev');

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ['asd;flkasv;aseoirasd;vlkasjd;ae']
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ---- passport google authentication ----- //

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: '105825970012-to9bshmunrlc741dgiqgft8a0h2ubfqd.apps.googleusercontent.com',
      clientSecret: 'CMjXVE_MD0JwcjC08_lRet7g',
      callbackURL: 'http://localhost:5000/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ googleId: profile.id, email: profile.email }).save();
      done(null, user);
    }
  )
);

// ---- AUTH ROUTES ----- ///

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('http://localhost:3000');
});

app.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/tasks', async (req, res) => {
  const userTasks = await Task.find({ owner: req.user._id });

  res.status(200).send(userTasks);
});

app.post('/api/tasks/new', (req, res) => {
  const newTask = new Task(req.body);

  newTask.save(function(err, task) {
    if (err) throw err;

    console.log('task saved');
    res.send(task);
  });
});

app.delete('/api/tasks/delete', (req, res) => {
  Task.findByIdAndRemove(req.body.task, function(err, deletedTask) {
    if (err) throw err;

    console.log('task removed');
    res.status(200).send(deletedTask);
  });
});

app.post('/api/tasks/open', (req, res) => {
  Task.findOne({ _id: req.body.task }, function(err, task) {
    if (err) throw err;

    task.status = 'Open';
    task.completed = null;

    task.save((err, task) => {
      if (err) throw err;

      res.send(task);
    });
  });
});

app.post('/api/tasks/close', (req, res) => {
  Task.findOne({ _id: req.body.task }, function(err, task) {
    if (err) {
    } else {
      task.status = 'Closed';
      task.completed = new Date();

      task.save(function(err, newTask) {
        if (err) throw err;

        res.send(newTask);
      });
    }
  });
});

app.post('/api/pom/new', (req, res) => {
  User.findById(req.user.id, function(err, user) {
    if (err) throw err;

    const pom = new Pom({
      owner: user.id
    });

    pom.save(function(err, newPom) {
      if (err) throw err;

      res.send('okay!');
    });
  });
});

app.get('/api/stats', (req, res) => {
  const startDate = new Date(2018, 00, 01);
  const endDate = new Date(2018, 00, 25);

  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          yearMonthDay: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          dayOfMonth: {
            $dateToString: {
              format: '%d',
              date: '$createdAt'
            }
          }
        },
        count: { $sum: 1 }
      }
    }
  ];

  Pom.aggregate(pipeline, function(err, data) {
    if (err) throw err;

    const day = startDate.getDate();

    console.log(data);
    res.send(data);
  });

  // Pom.find(
  //   {
  //     createdAt: { $gte: new Date(2018, 00, 01), $lt: new Date(2018, 00, 25) }
  //   },
  //   function(err, pomz) {
  //     if (err) throw err;
  //
  //     console.log(pomz);
  //     res.send(pomz);
  //   }
  // );
});

// ---- seed file ----- //

// User.findOne({ googleId: '109926637305563215405' }, function(err, user) {
//   if (err) {
//     console.log(err);
//   } else {
//     const task1 = new Task({
//       id: 2,
//       task: 'Go to the store',
//       status: 'Open',
//       created: new Date(),
//       completed: null,
//       owner: user.id
//     });
//     task1.save().then((err, data) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log('task saved!');
//       }
//     });
//   }
// });

const PORT = 5000;
app.listen(PORT, () => {
  console.log('server running on ', PORT);
});
