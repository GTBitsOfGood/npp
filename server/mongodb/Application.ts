import mongoose from 'mongoose';

const { Schema } = mongoose;

// Create Schema
const ApplicationSchema = new Schema({
  organizationName: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: false,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  // CONTACT
  mission: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
    enum: ['WEBSITE', 'MOBILE_APP']
  },
  needsOtherExpand: {
    type: String,
    required: false,
  },
  stageNew: {
    type: String,
    required: false,
  },
  stageRadio: {
    type: String,
    required: false,
  },
  stageOtherExpand: {
    type: String,
    required: false,
  },
  availRadio: {
    type: String,
    required: false,
  },
  fieldRadio: {
    type: String,
    required: false,
  },
  productExtra: {
    type: String,
    required: false,
  },
  feedback: {
    type: String,
    required: false,
  },
  status: {
    type: Number,
    default: 0,
  },
  urlString: {
    type: String,
    required: false,
  },
  decision: {
    type: Boolean,
    default: null,
  },
  meeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Availability',
    default: null,
  },
}, {
  timestamps: {
    createdAt: 'submitted',
  },
});

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
