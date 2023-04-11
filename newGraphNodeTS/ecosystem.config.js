module.exports = {
  apps : [{
    name   : "Cat-Service",
    script : "./server.js",
    instances : 1,
    exec_mode: "fork"	
  }]
}