import mongoose, { Schema, Document, Model } from "mongoose"

interface IWaitlist extends Document {
    fullName: string
    email: string
    agreedToTerms: boolean
    createdAt: Date
    updatedAt: Date
}


const waitlistSchema = new Schema<IWaitlist>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        agreedToTerms: { type: Boolean, required: true },
    },
    { timestamps: true }
)

export const Waitlist: Model<IWaitlist> =
    mongoose.models.Waitlist ?? mongoose.model<IWaitlist>("Waitlist", waitlistSchema)
