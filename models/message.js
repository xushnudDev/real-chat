import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    room: {
        type: String,
    },
    message: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
},{
    collection: 'messages',
    timestamps: true,
    versionKey: false,

});

export default mongoose.model('Message', messageSchema);