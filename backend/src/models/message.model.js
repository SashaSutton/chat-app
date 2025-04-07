import mongoose from 'mongoose';

const messageSchema = new monggose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    }
}, {timestamps: true});


const Message = mongoose.model('Message', messageSchema);

export default Message;
