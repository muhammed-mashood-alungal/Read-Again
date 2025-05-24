const cron = require("node-cron");
const { couponExpiryMonitorJob } = require("../jobs/couponJob");
const { OfferExpiryMonitorJob } = require("../jobs/offerJob");

cron.schedule("0 9 * * *", () => {
  couponExpiryMonitorJob();
  OfferExpiryMonitorJob();
});


cron.schedule('* * * * *',()=>{
   console.log('asdfasdf')
})