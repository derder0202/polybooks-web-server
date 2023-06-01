const mongoose = require('mongoose');

//change
const UserSchema = new mongoose.Schema({
    uid: { type: String, unique: true, required: true ,immutable:true},
    fullName: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    //bio: { type: String },
    avatar: { type: String },
    gender: { type: String, default: 'male'},//enum: ['male', 'female', 'other'] ,
    birthday: { type: Date },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    role: { type: String, enum: ['manual', 'vip', 'admin'], default: 'manual' },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

}, {timestamps: true});
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
   // createAt: { type: Date, default: Date.now },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});
// const BookSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     bookType: { type: mongoose.Schema.Types.ObjectId, ref: 'BookType',},
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
//     publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
//     year: { type: Number },
//     description: { type: String },
//     price: { type: Number, required: true },
//     images: [{ type: String }],
//     condition: { type: String, enum: ['new', 'like new', 'good', 'fair', 'poor'] },
//     size: { type: String },
//     totalPage: { type: Number },
//     language: { type: String },
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
//     createAt: { type: Date, default: Date.now },
// });
const AuthorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    //birthday: { type: Date },
    //description: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

//change
const ShopSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number},
    description: { type: String, },
    image: { type: String,},
    address: { type: String, },
    phone: { type: String,},
   // createAt: { type: Date, default: Date.now },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
   // taxCode: { type: String }
}, {timestamps: true});

//change
const PostSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postTitle: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    images: [{ type: String }],
    bookStatus: { type: String },
    bookSize: { type: String },
    language: { type: String },
    startTime:{type:Date},
    endTime:{type:Date},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
    totalPage: { type: Number },
    address: {type:String},
    isbn: {type:String},
    postStatus: {type:String},
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    startPrice: {type:String},
    endPrice: {type:String},
    salesType:{type:Number,default:0},
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
   // createAt: { type: Date, default: Date.now },
}, {timestamps: true});

// const cartSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
//    // createdAt: { type: Date, default: Date.now },
// }, {timestamps: true});

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    rating: { type: Number, required: true },
    message: { type: String },
    image: { type: String },
    //createAt: { type: Date, default: Date.now },
}, {timestamps: true});

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    //createAt: { type: Date, default: Date.now },
}, {timestamps: true});
const PublisherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});


//Not Use
const AuctionPostSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number },
    bids: [{
        bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number, required: true },
        createAt: { type: Date, default: Date.now },
    }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isClosed: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
});


const BillSchema = new mongoose.Schema({
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    //createAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    address: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{timestamps:true});
const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);
//const Book = mongoose.model('Book', BookSchema);
const Author = mongoose.model('Author', AuthorSchema);
const Shop = mongoose.model('Shop', ShopSchema);
const Post = mongoose.model('Post', PostSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const Publisher = mongoose.model('Publisher', PublisherSchema);
const AuctionPost = mongoose.model('AuctionPost', AuctionPostSchema);
const Bill = mongoose.model('Bill', BillSchema);
//const Cart = mongoose.model('Cart', cartSchema);

module.exports = {
    User,
    Category,
   // Book,
    Author,
    Shop,
    Post,
    Review,
    Notification,
    Publisher,
    AuctionPost,
    Bill,
   // Cart
};