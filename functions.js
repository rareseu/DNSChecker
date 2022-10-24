const dns = require('dns');
const dnsPromises = dns.promises;

const errHandler = (error) => {
  if(!error) return 'error'
  if(error.code == 'ENODATA') return null
  else if(error.code == 'ENOTFOUND') return null
  else if(error.code == 'ESERVFAIL') return 'Server Failed'
  else return error
}

const IP_DNS = async (url, type) => {
  let array = [];
  try {
    if(type == 1) array = await dnsPromises.resolve4(url, { ttl : true });
    else if(type == 2) array = await dnsPromises.resolve6(url, { ttl : true });
    for(let i=0; i<array.length; i++) {
      try {
        array[i].reverse = await dnsPromises.reverse(array[i].address)
      } catch (error) {
        if(array.length) array[i].reverse = null;
      }
    }
    return array
  } catch (error) { return errHandler(error) }
}

const MIX_DNS = async (url, type) => {
  try { return await dnsPromises.resolve(url, type) }
  catch (error) { return errHandler(error) }
}

const ALL_DNS = async (url) => {
  let array = {"timestamp": new Date().getTime(), "req": {"url": url, "ts": new Date(), "id": require("crypto").randomBytes(10).toString('hex')}, "data": {"A": await IP_DNS(url, 1), "AAAA": await IP_DNS(url, 2)}, "serversUsed": await dnsPromises.getServers()},  all = ['CAA', 'CNAME', 'MX', 'NS', 'SOA', 'SRV', 'TXT' ];
  for(let i=0; i<all.length; i++) array.data[all[i]] = await MIX_DNS(url, all[i])
  array.req.ts = new Date() - array.req.ts
  return array
}

const domainRegex = async (req, res, next) => {
  let url = req.params.url;
  if(!url) return res.send('Missing /URL')
  if(!url.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) return res.send('invalid domain')
  else {
    let dnses = {
      google: ['8.8.8.8','2001:4860:4860::8888','8.8.4.4','2001:4860:4860::8844'], cloudflare: ['1.1.1.1','1.0.0.1','2606:4700:4700::1111','2606:4700:4700::1001'],
      opendns: ['208.67.222.222','208.67.220.220','2620:119:35::35','2620:119:53::53'],
      verisign: ['64.6.64.6', '64.6.65.6', '2620:74:1b::1:1', '2620:74:1c::2:2'],
      dnswatch: ['84.200.69.80', '84.200.70.40', '2001:1608:10:25::1c04:b12f', '2001:1608:10:25::9249:d69b'],
      freenom: ['80.80.80.80', '80.80.81.81'],
      alidns: ['223.5.5.5', '223.6.6.6'],
      dyn: ['216.146.35.35', '216.146.36.36']
    };
    if(req.params.dns) {
      let dns = req.params.dns.toLowerCase()
      if(dnses[dns] && dnses[dns].length) await dnsPromises.setServers(dnses[dns])
      else await dnsPromises.setServers(dnses['google'])
    } else await dnsPromises.setServers(dnses['google'])
    return next()
  }
}

module.exports = {
  IP_DNS,
  MIX_DNS,
  ALL_DNS,
  domainRegex
}