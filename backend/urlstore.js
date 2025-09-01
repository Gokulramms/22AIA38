const store={};

function save(shortcode,url,expiry) {
  store[shortcode]={
    url,
    expiry,
    createdAt:new Date(),
    clicks:0,
    stats:[]
  };
}

function get(shortcode){
  return store[shortcode];
}

function exists(shortcode){
  return !!store[shortcode];
}

module.exports={save,get,exists,store};
