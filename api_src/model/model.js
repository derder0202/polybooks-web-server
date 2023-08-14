const { create } = require('hbs');
const mongoose = require('mongoose');

//change
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String ,immutable:true, unique: true, required: true },
    password: { type: String , required: true},
    email: { type: String , default:"" },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    avatar: { type: String },
    imageCover: { type: String },
    gender: { type: String, default: 'male'},//enum: ['male', 'female', 'other'] ,
    birthday: { type: Date , default:"" },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    buyBills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
    sellBills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
    role: { type: Number, default: 0 },
    buyerReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    sellerReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
    withdrawRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WithdrawRequest'}],
    active: {type: Boolean, default:true},
    location: {
        type: [Number],
        default: [ 105.3230297,20.9739994]
    },
    totalPost:{type:Number, default:0},
    updateTotalPost:{type:Date},
    token:{type:String},
    rating:{type: Number,default: 0},
    coin:{type:Number,default: 0},
    depositHistories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DepositHistory'}],
}, {timestamps: true});

UserSchema.statics.calculateRolePercentage = function(callback) {
    return User.aggregate([
        {
            $group: {
                _id: '$role',
                count: {$sum: 1}
            }
        },
        {
            $project: {
                _id: 0,
                role: '$_id',
                count: 1
            }
        }
    ],);
}

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image:{type:String,require:true},
    description: { type: String, default:""  },
   // createAt: { type: Date, default: Date.now },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const AuthorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const ShopSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            immutable: true
        },
        sellBills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }],
        address: {
                type: String,
                default: ""
        },
        phone1: {
            type: String,
            default: ""
        },
        phone2: {
            type: String,
            default:""
        },
        rating: {
            type: Number,
            default: 0
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default:""
        },
        shopImage: {
            type: String
        },
        coverImage: {
            type: String
        },
        endTime:{
            type:Date
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post'
            }
        ],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review'
            }
        ],
        location: {
            type: [Number],
            default: [ 105.3230297,20.9739994]
        },
        allDiscounts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }],
    },{ timestamps: true }
)

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
    endTime:{type:Date,default: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).setHours(24, 0, 0, 0)},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
    totalPage: { type: Number,default:0 },
    address: {type:String, default: ""},
    isbn: {type:String,default:""},
    postStatus: {type:String,default:"0"},
    replyToPost:{type:String},
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    startPrice: {type:String},
    endPrice: {type:String},
    salesType:{type:Number,default:0},
    location: {
        type: [Number],
        default: [ 105.3230297,20.9739994]
    },
    discount: {type:Number, default:0},
    allDiscounts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }],
   // createAt: { type: Date, default: Date.now },
}, {timestamps: true});
PostSchema.pre('save'||'updateMany'||'updateOne',async function (next) {
    try {
        //if(this.isModified("reviews")){
        await this.populate('allDiscounts')
        let latestUpdatedAt = null;
        let latestDiscount = null;
        if((this.get('allDiscounts') && this.get('allDiscounts').length > 0)){
            for(let discount of this.get('allDiscounts')){
                if(discount.isActive === true){
                    if (!latestUpdatedAt || discount.updatedAt > latestUpdatedAt) {
                        latestUpdatedAt = discount.updatedAt;
                        latestDiscount = discount.discountValue;
                    }
                }
            }
        }
        this.discount = latestDiscount
        next();
        // }
    } catch (err) {
        next(err);
    }
})

PostSchema.index({location: '2dsphere'});

const ReviewSchema = new mongoose.Schema({
    bill: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
    //post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    rating: { type: Number, required: true },
    message: { type: String ,required: true},
    images: [{ type: String }],
    status:{type: Number},// review ban hoac mua 1 la ban 2 la mua
    //createAt: { type: Date, default: Date.now },
}, {timestamps: true});

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    title: { type: String, required: true },
    read: { type: Boolean, default: false },
    imageUrl:{type:String},
    bill:{type: mongoose.Schema.Types.ObjectId, ref: 'Bill'}
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
        type: Number,
        default: 0,
    },
    totalPrice: {type:Number, default: 0},
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    reviewBuyer: {type: Number, default:0},
    reviewSeller: {type: Number, default:0},
    payment:{type:Number,default:0}
},{timestamps:true});

BillSchema.pre('save',async function (next) {
    try {
        await this.populate('posts','price')
        let totalMoney = 0;
        this.posts.forEach((post) => {
            totalMoney += post.price;
        });
        this.totalPrice = totalMoney
        next();
        // }
    } catch (err) {
        next(err);
    }
})



BillSchema.statics.countByCategory = function() {
    return this.aggregate([
        {
            $lookup: {
                from: 'posts',
                localField: 'posts',
                foreignField: '_id',
                as: 'postDetails'
            }
        },
        {
            $unwind: '$postDetails'
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'postDetails.category',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $group: {
                _id: {
                    id: '$category._id',
                    name: '$category.name'
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: '$_id.id',
                name: '$_id.name',
                count: 1
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ],);
};

// ShopSchema.pre('save',async function (next) {
//     try {
//         //if(this.isModified("reviews")){
//             await this.populate('reviews','rating')
//             const reviews = this.reviews
//             if (reviews.length === 0) {
//                 this.rating = 0;
//             } else {
//                 const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
//                 this.rating = totalRating / reviews.length;
//             }
//             next();
//        // }
//     } catch (err) {
//         next(err);
//     }
// })


// UserSchema.pre('save',async function (next) {
//     try {
//         //if(this.isModified("reviews")){
//         await this.populate('sellerReviews','rating')
//         await this.populate('buyerReviews','rating')
//             //await this.populate({path:'reviews',select:'rating',strictPopulate:false})
//             const reviews = [...this.sellerReviews,...this.buyerReviews]
//                 if (reviews.length === 0) {
//                     this.rating = 0;
//                 } else {
//                     const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
//                     this.rating = totalRating / reviews.length;
//                 }
//
//             next();
//         //}
//     } catch (err) {
//         next(err);
//     }
// })

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    },
    replyReport:{
        type:String
    },
    attachedFiles: {
        type: [String],
        required: false
    }
},{timestamps:true});
// Schema cho giảm giá
const discountSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    categoryId: { //neu co cai nay thi tat ca sach trong category giam gia
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    postId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post',
    },//neu co cai nay thi sach giam gia
    title: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    forAll: {
        type: Boolean,
        default: false
    },
    discountValue: {
        type: Number,
        required: true
    }, // theo %
    isActive: {
        type: Boolean,
        default: false
    }
},{timestamps:true});
// Schema cho lịch sử đặt cọc
const depositHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        //required: true
    },
},{timestamps: true});

const withdrawRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    withdrawAmount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
    },
    bankNumber: {
        type: String,
    },
    bankCode:{
        type:String
    },//VCB
    bankName:{
        type:String
    },
    replywithdraw:{
        type:String
    }
}, { timestamps: true });

const bannerSchema = new mongoose.Schema({
    name: {
        type:String,  
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    address:{
        type:String,  
        required: true
    },
    link: {
        type: String, 
        // required: true
    },
    description: {
        type: String,
        required: true
    },
    endTime: {
        type: Date,
        
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default:true
    },
    createUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
},{timestamps : true}
);
const AddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
});

const Address = mongoose.model('Address', AddressSchema);
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
const WithdrawRequest = mongoose.model('WithdrawRequest', withdrawRequestSchema);


//const Cart = mongoose.model('Cart', cartSchema);

module.exports = {
    WithdrawRequest,
    Address,
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