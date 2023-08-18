const {Shop, User, Bill, Post} = require("../model/model");
const multer = require("multer")
const admin = require("firebase-admin");
const mongoose = require("mongoose");
const {Mongoose} = require("mongoose");
const upload = require("../upload_image").single("image");

const shopController = {
    getShops: async (req, res) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const shops = await Shop.find({}).populate({path: 'user',select:'_id',match: { active: true }})
                .skip(startIndex)
                .limit(limit);
            const filteredShops = shops.filter(shop => shop.user !== null).map(shop => ({...shop.toObject(),user: shop.user._id.toString()})); // Filter out shops with banned users
            res.status(200).json(filteredShops);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting categories from database.' });
        }
    },

    createShop : async (req, res) => {
        try {
            // const { user, name, description, address,phone} = req.body;
            // const shop = new Shop({ user, address, phone, name,description });

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const newShop = new Shop(req.body);

                const file = req.file;
                if(file){
                    const bucket = admin.storage().bucket()
                    const options = {
                        destination: `shops/${newShop._id}`, // set the destination path in the bucket
                        metadata: {
                            contentType: 'image/jpeg', // set the MIME type of the file
                        },
                    };
                    const blob = bucket.file(options.destination); // create a reference to the file in the bucket
                    const blobStream = blob.createWriteStream(options); // create a write stream to upload the file
                    blobStream.end(file.buffer); // write the buffer to the stream
                    return new Promise((resolve, reject) => {
                        blobStream.on('finish', async () => {
                            await blob.makePublic();
                            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // get the public URL of the uploaded file
                            resolve(publicUrl);
                            newShop.image = publicUrl
                            if(newShop.user){
                                await User.findByIdAndUpdate(newShop.user,{shopId: newShop._id})
                            }
                            await newShop.save()
                            res.status(200).json(newShop);
                        });
                        blobStream.on('error', reject);
                    })
                } else {
                    const newShop = new Shop(req.body);
                    if(newShop.user){
                        await User.findByIdAndUpdate(newShop.user,{shopId: newShop._id})
                    }
                    await newShop.save()
                    res.status(200).json(newShop);
                    //res.status(404).json({ error: "file not found" });
                }
                // Everything went fine.
            })

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getShopById : async (req, res) => {
        try {
            const id = req.params.id;
            const shop = await Shop.findById(id);
            if (!shop) {
                return res.status(404).json({ error: 'Shop not found' });
            }
            res.json(shop);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateShop : async (req, res) => {
        try {
            const id = req.params.id;
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const shop = await Shop.findById(id);
                const file = req.file;
                if(file){
                    console.log("file")
                    const bucket = admin.storage().bucket()
                    const options = {
                        overwrite: true,
                        destination: `shops/${shop._id}`, // set the destination path in the bucket
                        metadata: {
                            contentType: 'image/jpeg', // set the MIME type of the file
                        },
                    };

                    const blob = bucket.file(options.destination); // create a reference to the file in the bucket
                    const blobStream = blob.createWriteStream(options); // create a write stream to upload the file
                    blobStream.end(file.buffer); // write the buffer to the stream
                    return new Promise( (resolve, reject) => {
                        blobStream.on('finish', async() => {
                            //const blob = bucket.file(options.destination);
                            const config = {
                                action: 'read',
                                expires: '03-17-3025', // set the expiration date of the URL
                            };
                            const [url] = await blob.getSignedUrl(config);
                            resolve(url);
                            console.log(url)
                            await shop.updateOne({image:url,...req.body});
                            return res.status(200).json({message: "shop updated"});
                            // newUser.avatar = publicUrl
                            // await newUser.save()
                            //res.status(201).json(newUser);
                        });
                        blobStream.on('error', reject);
                    });
                } else {
                    //console.log("none")
                    // const shop = await  Shop.findById(id)
                    // Object.assign(shop, req.body)
                    // const updateShop = await shop.save()
                     const updateShop = await Shop.findByIdAndUpdate(id,req.body, {new:true})
                    res.status(200).json({message: "shop updated", data: updateShop});
                }

                // Everything went fine.
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteShop : async (req, res) => {
        try {
            const shop = await Shop.findByIdAndDelete(req.params.id);
            // const bucket = admin.storage().bucket();
            // await bucket.file("shops/"+shop._id).delete()
            if (!shop) {
                res.status(404).json({ error: 'Shop not found.' });
            } else {
                await User.findByIdAndUpdate(shop.user,{shopId:null})
                res.status(200).json({message: "Shop is deleted"});
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getReviewsByShop : async (req, res) => {
        try {
            const { startIndex, limit } = req.query;
            const shop = await Shop.findById(req.params.id).populate({
                path: 'reviews',
                options: {
                    skip: parseInt(startIndex) || 0,
                    limit: parseInt(limit) || 10,
                },
                populate: {
                    path: 'bill',
                    populate:[
                        {
                            path: 'buyer',
                            select: 'fullName'
                        },
                        {
                            path: 'posts',
                            select: 'bookName price images'
                        },
                    ]
                }
            });
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            res.json(shop.reviews);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getPostsByShop : async (req, res) => {
        try {
            const { startIndex, limit } = req.query;
            const shop = await Shop.findById(req.params.id).populate({
                path: 'posts',
                options: {
                    skip: parseInt(startIndex) || 0,
                    limit: parseInt(limit) || 20,
                },
                //match:{postStatus:"1"},
                populate:[
                    {
                        path:"seller",
                        select:"fullName phone"
                    },
                    {
                        path:"author",
                        select:"name"
                    },
                    {
                        path:"publisher",
                        select:"name"
                    },
                    {
                        path:"category",
                        select:"name"
                    },
                    {
                        path: "shopId",
                        select: "name"
                    }
                ]
            });
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            res.json(shop.posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getAllDiscountsByShop: async(req,res) => {
        try {
            const shop = await Shop.findById(req.params.id).populate({
                path: 'allDiscounts',
            });
            if (!shop) {
                return res.status(400).json('shop not found')
            }
            return res.status(200).json(shop.allDiscounts);
        } catch (error) {
            res.status(500).json('server loi')
        }
    },

    getSellBillsByShop : async (req,res) => {
        try {
            const { startIndex, limit } = req.query;
            const { id } = req.params;
            const shop = await Shop.findById(id).populate({
                path: 'sellBills',
                options: { skip: parseInt(startIndex) || 0,
                    limit: parseInt(limit) || 20
                },
                populate:[
                    {
                        path:"buyer",
                        select:"fullName phone"
                    },
                    {
                        path:"seller",
                        select:"fullName phone"
                    },
                    {
                        path:"shopId",
                        select:"name"
                    },
                    {
                        path:"posts",
                        select:"images bookName price"
                    }
                ]
            })
            if (!shop) {
                return res.status(400).json("User not found")
            }
            res.status(200).json(shop.sellBills);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getShop7DaysStatistical: async (req, res)=>{
        try{
            const today = new Date();
            const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6); // Ngày bắt đầu là 6 ngày trước hôm nay

            // Create an empty map to store the counts
            const dataThisWeekRegularTemplate = {};
            const shop = await Shop.findById(req.params.id).populate('sellBills')
            // Iterate over each day of the week
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
                const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);
                let countSendBill = 0
                let countDoneBill = 0
                let totalPrice = 0
                // Count posts for the current day
                // const postsCount = await Post.countDocuments({ createdAt: { $gte: currentDate, $lt: nextDate } });
                for (let bill of shop.sellBills){
                    if(bill.createdAt && bill.createdAt.getTime() > currentDate && bill.createdAt.getTime() < nextDate){
                        countSendBill++;
                    }
                    if(bill.updatedAt && bill.updatedAt.getTime() > currentDate && bill.updatedAt.getTime() < nextDate && bill.status === 3){
                        countDoneBill++;
                        totalPrice+=bill.totalPrice
                    }
                }
                // Get the day name
                const dayName = currentDate.toLocaleDateString('vi-VN')

                // Save the count in the map
                dataThisWeekRegularTemplate[`${dayName.substring(0, dayName.lastIndexOf('/'))}`] = {countDoneBill,countSendBill,totalPrice};
            }

            res.json(dataThisWeekRegularTemplate)
        } catch (e) {
          console.log(e)
        }
    },
    getShopStatisticalByTime: async (req, res)=>{
        try{
            const startDate = new Date(req.body.startDay)
            const endDate = new Date(req.body.endDay)
            startDate.setHours(startDate.getHours()+5)
            endDate.setHours(endDate.getHours()+5)

            const shop = await Shop.findById(req.params.id).populate('sellBills')
            // Iterate over each day of the week
            let countSendBill = 0
            let countDoneBill = 0
            let totalPrice = 0

            for(let bill of shop.sellBills){
                if(bill.createdAt && bill.createdAt.getTime() > startDate && bill.createdAt.getTime() < endDate){
                    countSendBill++;
                }
                if(bill.updatedAt && bill.updatedAt.getTime() > startDate && bill.updatedAt.getTime() < endDate && bill.status === 3){
                    countDoneBill++;
                    totalPrice+=bill.totalPrice
                }
            }
            res.json({countSendBill,countDoneBill,totalPrice})
        } catch (e) {
            console.log(e)
        }
    },

    getShopBillStatisticalByTime: async (req, res)=>{
        try{
            const startDate = new Date(req.body.startDay)
            const endDate = new Date(req.body.endDay)
            startDate.setHours(startDate.getHours()+5)
            endDate.setHours(endDate.getHours()+5)

            const shop = await Shop.findById(req.params.id).populate('sellBills')
            // Iterate over each day of the week
            let sendBills = []
            let doneBills = []

            for(let bill of shop.sellBills){
                if(bill.createdAt && bill.createdAt.getTime() > startDate && bill.createdAt.getTime() < endDate){
                    await bill.populate([
                        {
                            path: 'posts',
                            select: "bookName price images"
                        },
                        {
                            path: 'buyer',
                            select: "fullName"
                        },
                        {
                            path: 'seller',
                            select: "fullName"
                        },
                        {
                            path: 'shopId',
                            select: "name"
                        },
                    ])

                    sendBills.push(bill)
                }
                if(bill.updatedAt && bill.updatedAt.getTime() > startDate && bill.updatedAt.getTime() < endDate && bill.status === 3){
                    await bill.populate([
                        {
                            path: 'posts',
                            select: "bookName price images"
                        },
                        {
                            path: 'buyer',
                            select: "fullName"
                        },
                        {
                            path: 'seller',
                            select: "fullName"
                        },
                        {
                            path: 'shopId',
                            select: "name"
                        },
                    ])
                    doneBills.push(bill)
                }
            }
            res.json({sendBills,doneBills})
        } catch (e) {
            console.log(e)
        }
    },


}

module.exports = shopController