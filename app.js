const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const LocalStrategy = require('passport-local').Strategy;
const admin = require("firebase-admin");

const serviceAccount = require("./credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://polybooks-52282.appspot.com",
});


require('dotenv').config()

//connect mongoose
mongoose.connect(process.env.MONGODBURL).then(()=>{
  console.log("mongodb connected")
})

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const memberRouter = require('./routes/member');
const vipmemberRouter = require('./routes/vipmember');
const autionPostRouter = require('./routes/autionpost');
const contentRouter = require('./routes/content');
const newContentRouter = require('./routes/newcontent');
const pendingReportRouter = require('./routes/pendingreport');
const processedreportRouter = require('./routes/processedreport');
const admanagementRouter = require('./routes/admanagement');
const statisticalRouter = require('./routes/statistical');
const authenticationRouter = require('./routes/authentication');


const apiUserRouter = require('./api_src/route/user')
const apiPostRouter = require('./api_src/route/post')
const apiAuthorRouter = require('./api_src/route/author')
const apiReviewRouter = require('./api_src/route/review')
const apiShopRouter = require('./api_src/route/shop')
const apiCategoryRouter = require('./api_src/route/category')
const apiDepositHistoryRouter = require('./api_src/route/deposit_history')
const apiDiscountRouter = require('./api_src/route/discount')
const apiReportRouter = require('./api_src/route/report')
const apiBannerRouter = require('./api_src/route/banner')
const apiPublisherRouter = require('./api_src/route/publisher')
const apiBillRouter = require('./api_src/route/bill')
const passport = require("passport");
const {User} = require("./api_src/model/model");



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
    async function(username, password, done) {
      const user = await User.findOne({ phone: username })

      if (!user) {
        console.log("no user")
        return done(null, false, { message: 'Incorrect username.' });
      }
      console.log(user.password)
      console.log(password)
      if (user.password !== password) {
        console.log("???")
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    }
));


//Web Admin
app.use('/', indexRouter);
app.use('/Users', usersRouter);
app.use('/RegularMembers',memberRouter)
app.use('/VipMembers',vipmemberRouter)
app.use('/AutionPost',autionPostRouter)
app.use('/BookApproval',contentRouter)
app.use('/NewApproval',newContentRouter)
app.use('/PendingReport',pendingReportRouter)
app.use('/ProcessedReport',processedreportRouter)
app.use('/AdvertisingManagement',admanagementRouter)
app.use('/Statistical',statisticalRouter)
app.use('/Login',authenticationRouter)


//API
app.use('/api/users',apiUserRouter)
app.use('/api/posts',apiPostRouter)
app.use('/api/authors',apiAuthorRouter)
app.use('/api/reviews',apiReviewRouter)
app.use('/api/shops',apiShopRouter)
app.use('/api/categories',apiCategoryRouter)
app.use('/api/reports',apiReportRouter)
app.use('/api/depositHistory',apiDepositHistoryRouter)
app.use('/api/discounts',apiDiscountRouter)
app.use('/api/banners',apiBannerRouter)
app.use('/api/publishers',apiPublisherRouter)
app.use('/api/bills',apiBillRouter)




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
