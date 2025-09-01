function generateShortcode(length=6){
  return Math.random().toString(36).substring(2,2+length);
}

function isExpired(entry) {
  return new Date()>new Date(entry.expiry);
}

function isoExpiry(minutes) {
  return new Date(Date.now()+minutes*60*1000).toISOString();
}

module.exports={generateShortcode,isExpired,isoExpiry};
