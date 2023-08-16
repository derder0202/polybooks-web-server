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

// Đăng ký partials
// const handlebars = require('handlebars');
// const fs = require('fs');
//
// const partialsDir = __dirname + '/partials';
//
// const filenames = fs.readdirSync(partialsDir);
//
// filenames.forEach(filename => {
//     const matches = /^([^.]+).hbs$/.exec(filename);
//     if (!matches) {
//         return;
//     }
//     const name = matches[1];
//     const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
//     handlebars.registerPartial(name, template);
// });
// đăng ký partials

require('dotenv').config()
admin.initializeApp({
    credential: admin.credential.cert(require("./credentials.json")),
    storageBucket: process.env.STORAGE_BUCKET,
});
//connect mongoose
mongoose.connect(process.env.MONGODBURL).then(()=>{
  console.log("mongodb connected")
})

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const memberRouter = require('./routes/member');
const vipmemberRouter = require('./routes/vipmember');
const autionPostRouter = require('./routes/autionpost');
const prepareAuctionRouter = require('./routes/prepareauction');
const endAuctionRouter = require('./routes/endauction');
const contentRouter = require('./routes/content');
const newContentRouter = require('./routes/newcontent');
const pendingReportRouter = require('./routes/pendingreport');
const processedreportRouter = require('./routes/processedreport');
const admanagementRouter = require('./routes/admanagement');
const statisticalRouter = require('./routes/statistical');
const authenticationRouter = require('./routes/authentication');
const autionApprovalRouter = require('./routes/autionapproval');
const shopRouter = require('./routes/shop');
const rechargeHistoryRouter = require('./routes/rechargehistory');
const withdrawRequestsRouter = require('./routes/withdrawrequests');
const browseWithdrawalsRouter = require('./routes/browsewithdrawals');
const accountisLockedRouter = require('./routes/accountislocked');


const apiNotificationRouter =  require('./api_src/route/notification')
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
const apiWithdrawRequest = require('./api_src/route/withdraw_request')
const apiCoinChangeHistory = require('./api_src/route/coin_change_history')

const passport = require("passport");
const {User, Bill, Post} = require("./api_src/model/model");



const app = express();
const hbs = require('hbs');
const moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const partialsPath =path.join(__dirname,"views/partials");
hbs.registerPartials(partialsPath);

hbs.registerHelper('formatTime', function (date){
    const formattedDate = moment(date).format('HH:mm:ss DD-MM-YYYY ');
    return new hbs.SafeString(formattedDate);
});

hbs.registerHelper('formatDateOfBirth', function (date){
    const formattedDate = moment(date).format('DD-MM-YYYY ');
    return new hbs.SafeString(formattedDate);
});
hbs.registerHelper('formatCurrency', function (amount) {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });
  return formatter.format(amount);
});
hbs.registerHelper('formatTimes', function (time) {
  let totalSeconds = time;
  if (typeof time !== 'number') {
    if (!(time instanceof Date)) {
      time = new Date(time);
    }
    totalSeconds = Math.floor(time.getTime() / 1000);
  }
  const hours = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2);
  const minutes = (totalSeconds % 60).toString().padStart(2);

  return `${hours} giờ ${minutes}`;
});


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
        //console.log("no user")
        return done(null, false, { message: 'Incorrect username.' });
      }
      //console.log(user.password)
      //console.log(password)
      if (user.password !== btoa(password)) {
        //console.log("???")
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
app.use('/Prepare',prepareAuctionRouter)
app.use('/EndAuction',endAuctionRouter)
app.use('/AutionApproval',autionApprovalRouter);
app.use('/NewApproval',newContentRouter)
app.use('/PendingReport',pendingReportRouter)
app.use('/ProcessedReport',processedreportRouter)
app.use('/AdvertisingManagement',admanagementRouter)
app.use('/Statistical',statisticalRouter)
app.use('/Login',authenticationRouter)
app.use('/Shop',shopRouter)
app.use('/RechargeHistory',rechargeHistoryRouter)
app.use('/WithdrawRequests',withdrawRequestsRouter)
app.use('/BrowseWithdrawals',browseWithdrawalsRouter)
app.use('/AccountHasBeenLocked',accountisLockedRouter)


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
app.use('/api/notifications',apiNotificationRouter)
app.use('/api/withdrawRequests',apiWithdrawRequest)
app.use('/api/coinChangeHistories',apiCoinChangeHistory)

// async function checkEveryday(){
//     const cutOfDate = new Date(Date.now() - 7*24*60 * 60 * 1000) // 64c7c4d93adce43a06c79732
//     // cutOfDate.setHours(cutOfDate.getHours()+5) // mui gio
//     await Bill.updateMany(
//         {updatedAt:{$lte: cutOfDate}, status: 2}, // filter
//         {status:3}
//     )
//     // const bill  = await Bill.findById('64c7c4d93adce43a06c79732')
//     // console.log(new Date(bill.updatedAt))
//     // console.log(cutOfDate)
//     // const newDate = new Date()
//
// }
// setInterval(checkEveryday,24*60*60*1000)  // 24*60*60*1000 => 1 ngay`

function runAtMidnight(callback) {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // Next day at 00:00:00
    0, // Hours
    0, // Minutes
    0 // Seconds
  );
  const timeUntilMidnight = midnight - now;
   setTimeout(() => {
    callback();
    setInterval(callback, 24 * 60 * 60 * 1000); // Repeat every 24 hours
  }, timeUntilMidnight);
}
 // Sử dụng hàm runAtMidnight để thực thi một đoạn mã vào nửa đêm
runAtMidnight(async () => {
    const cutOfDate = new Date(Date.now() - 7*24*60 * 60 * 1000) // 64c7c4d93adce43a06c79732
    // cutOfDate.setHours(cutOfDate.getHours()+5) // mui gio
    await Bill.updateMany(
        {updatedAt:{$lte: cutOfDate}, status: 2}, // filter
        {status:3}
    )
    const today = new Date()
    Post.updateMany({endTime: {$lte: today},postStatus:"1"},{postStatus:"2"})
    if(today.getDate() === 1){
        User.updateMany({},{totalPost: 0})
    }
});
app.use('/policy',(req,res)=>{
    res.render('policy')
})

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
