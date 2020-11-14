import { Schema } from "mongoose";

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  organizationPhone: {
    type: String,
  },
  primaryPhone: {
    type: String,
  },
});

export default ContactSchema;
