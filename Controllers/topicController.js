const User = require('../models/User');
const Topic = require('../models/Topic');
const Message = require('../models/Message');

// Dashboard
exports.getDashboard = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    try {
        const user = await User.findById(req.session.userId).populate('subscribedTopics');
        let dashboardData = [];
        
        for (let topic of user.subscribedTopics) {
            const recentMessages = await Message.find({ topic: topic._id })
                .sort({ createdAt: -1 })
                .limit(2)
                .populate('author', 'username');
            dashboardData.push({ topic: topic, messages: recentMessages });
        }
        
        res.render('dashboard', { username: user.username, dashboardData: dashboardData });
    } catch (error) {
        console.error(error);
        res.send("Error loading dashboard.");
    }
};

// All Topics with the Smart Button logic
exports.getAllTopics = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    try {
        const topics = await Topic.find();
        
        // Pull the currently logged-in user to see what they are subscribed to
        const user = await User.findById(req.session.userId);
        const subbedIds = user.subscribedTopics.map(id => id.toString());

        res.render('topics', { topics: topics, subbedIds: subbedIds });
    } catch (error) {
        console.error(error);
        res.send("Error loading topics.");
    }
};

// Create new Topic
exports.createTopic = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    try {
        const newTopic = new Topic({
            title: req.body.title,
            creator: req.session.userId
        });
        newTopic.subscribers.push(req.session.userId);
        await newTopic.save();

        const user = await User.findById(req.session.userId);
        user.subscribedTopics.push(newTopic._id);
        await user.save();

        res.redirect('/topics');
    } catch (error) {
        console.error(error);
        res.send("Error creating topic.");
    }
};

// Subscribe
exports.subscribe = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    try {
        const topicId = req.params.id;
        const userId = req.session.userId;
        
        const topic = await Topic.findById(topicId);
        if (!topic.subscribers.includes(userId)) {
            topic.subscribers.push(userId);
            await topic.save();
        }

        const user = await User.findById(userId);
        if (!user.subscribedTopics.includes(topicId)) {
            user.subscribedTopics.push(topicId);
            await user.save();
        }
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.send("Error subscribing.");
    }
};

// Unsubscribe
exports.unsubscribe = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    try {
        const topicId = req.params.id;
        const userId = req.session.userId;
        
        await Topic.findByIdAndUpdate(topicId, { $pull: { subscribers: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { subscribedTopics: topicId } });

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.send("Error unsubscribing.");
    }
};

// Single Topic (Chat Room) 
exports.getSingleTopic = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    try {
        const topicId = req.params.id;
        const topic = await Topic.findById(topicId);
        
        // Check if the user is on the subscriber list
        if (!topic.subscribers.includes(req.session.userId)) {
            return res.redirect('/topics');
        }

        await Topic.findByIdAndUpdate(topicId, { $inc: { accessCount: 1 } });
        
        const messages = await Message.find({ topic: topicId })
                                      .sort({ createdAt: 1 }) 
                                      .populate('author', 'username');
        
        res.render('singleTopic', { 
            topic: topic, 
            messages: messages,
            currentUserId: req.session.userId 
        });
    } catch (error) {
        console.error(error);
        res.send("Error loading the topic.");
    }
};

// Post Message - VIP Access Only
exports.postMessage = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    try {
        const topicId = req.params.id;
        const topic = await Topic.findById(topicId);

        // Second check that makes absolutely sure they are subscribed before saving
        if (!topic.subscribers.includes(req.session.userId)) {
            return res.redirect('/topics');
        }

        const newMessage = new Message({
            content: req.body.content,
            author: req.session.userId,
            topic: topicId
        });
        await newMessage.save();
        
        res.redirect(`/topics/${topicId}`);
    } catch (error) {
        console.error(error);
        res.send("Error posting message.");
    }
};

// Get Stats
exports.getStats = async (req, res) => {
    try {
        const topics = await Topic.find().select('title accessCount');
        res.render('stats', { topics: topics });
    } catch (error) {
        console.error(error);
        res.send("Error loading statistics.");
    }
};

// Delete Message
exports.deleteMessage = async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    try {
        const messageId = req.params.messageId;
        const message = await Message.findById(messageId);

        if (message.author.toString() === req.session.userId) {
            await Message.findByIdAndDelete(messageId);
        }

        res.redirect(`/topics/${message.topic}`);
    } catch (error) {
        console.error(error);
        res.send("Error deleting message.");
    }
};