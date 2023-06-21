const mongoose = require('mongoose');

//change
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String ,immutable:true, unique: true, required: true },
    password: { type: String , required: true},
    email: { type: String , default:"" },
    address: { type: String, default:"" },
    //bio: { type: String },
    avatar: { type: String },
    gender: { type: String, default: 'male'},//enum: ['male', 'female', 'other'] ,
    birthday: { type: Date , default:"" },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    role: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
}, {timestamps: true});
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image:{type:String,require:true},
    description: { type: String, default:""  },
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , immutable: true},
    name: { type: String, required: true },
    rating: { type: Number, default: 0},
    description: { type: String, default:"" },
    image: { type: String,},
    address: { type: String, default:"" },
    phone: { type: String, default:"" },
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
    description: { type: String, default:""  },
    price: { type: Number,required: true },
    images: [{ type: String }],
    bookStatus: { type: String, default:0 },
    bookSize: { type: String, default:"" },
    language: { type: String, default:"" },
    startTime:{type:Date},
    endTime:{type:Date},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
    totalPage: { type: Number,default:0 },
    address: {type:String, default: ""},
    isbn: {type:String,default:""},
    postStatus: {type:String,default:"0"},
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
    message: { type: String ,required: true},
    image: { type: String },
    //createAt: { type: Date, default: Date.now },
}, {timestamps: true});

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    title: { type: String, required: true },
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

ShopSchema.pre('save',async function (next) {
    try {
        if(this.isModified("reviews")){
            await this.populate('reviews','rating')
            const reviews = this.reviews
            console.log(reviews)
            if (reviews.length === 0) {
                this.rating = 0;
            } else {
                const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
                this.rating = totalRating / reviews.length;
            }
            next();
        }
    } catch (err) {
        next(err);
    }
})

const reportSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String,
        required: true
    },
    attachedFiles: {
        type: [String],
        required: false
    }
});
// Schema cho giảm giá
const discountSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    discountCode: {
        type: String,
        required: true,
    },
    discountValue: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});
// Schema cho lịch sử đặt cọc
const depositHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    depositAmount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default:0
    },
    description: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
});
const bannerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default:true
    }
});


const Banner = mongoose.model('Banner', bannerSchema);
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
const Report= mongoose.model('Report', reportSchema)
const Discount = mongoose.model('Discount', discountSchema)
const DepositHistory = mongoose.model('DepositHistory', depositHistorySchema)

//const Cart = mongoose.model('Cart', cartSchema);

module.exports = {
    Banner,
    Report,
    Discount,
    DepositHistory,
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