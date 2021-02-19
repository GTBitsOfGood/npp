// test to see if an email actually sends
import { sendEmail } from "&server/emails/Email";
import { StatusEmail } from "&server/emails/StatusEmail";

void sendEmail(
  "navbarry@gmail.com",
  new StatusEmail({
    name: "Bryce",
    status: 0,
  })
);
export default function (req, res) {
  res.send("test");
}
