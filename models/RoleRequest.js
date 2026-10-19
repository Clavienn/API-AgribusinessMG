// models/RoleRequest.js
import mongoose from 'mongoose'

const roleRequestSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    currentRole: { 
        type: String, 
        required: true 
    },
    requestedRole: { 
        type: String, 
        required: true 
    },
    reason: { 
        type: String, 
        required: true,
        minlength: 10 
    },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    requestDate: { 
        type: Date, 
        default: Date.now 
    },
    processedDate: Date,
    processedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    adminComment: String,
    userInfo: {
        name: String,
        email: String
    }
}, {
    timestamps: true
});

export default mongoose.model('RoleRequest', roleRequestSchema);